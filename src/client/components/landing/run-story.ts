/**
 * @file 랜딩 여정의 스크롤 이야기
 * @description 스크롤은 이야기 위치 S만 정하고, 화면은 S를 감쇠로 따라가며 매 프레임 그린다(명세 §4–5).
 *              DOM에는 transform·opacity·CSS 변수만 쓴다. 불연속 값(착지·공지 펼침·'지금' 줄)만
 *              hooks로 React에 올린다 — 그 셋은 실제 뷰어 부품(NoticeBar·Timeline)의 prop이라서.
 *              기준 시안: docs/design/prototypes/landing-renewal-v8.html 의 frame()/scenes().
 *
 * @connects
 *  - src/client/components/landing/landing-story.tsx  → 요소·hooks를 넘기고 정리 함수를 받는다
 *  - src/client/components/viewer/rail-geometry.ts    → 점 중심(offsetTop 사슬)
 */

import { dotCenters, offsetY } from "@/client/components/viewer/rail-geometry";
import { clamp, ease, lerp, smooth, storyPosition } from "@/client/components/landing/story-math";

export type StoryEls = {
  journey: HTMLElement;
  stage: HTMLElement;
  slot: HTMLElement;
  steps: HTMLElement[];
  pings: HTMLElement;
  cue: HTMLElement;
  tryPhone: HTMLElement | null;
  phone: HTMLElement;
  screen: HTMLElement;
  vwrap: HTMLElement;
  scroll: HTMLElement;
  msgs: HTMLElement[];
  lcard: HTMLElement;
  taps: HTMLElement;
  tapClass: string;
  finger: HTMLElement;
  map: HTMLElement;
  route: SVGPathElement;
  routeGlow: SVGPathElement;
  car: SVGCircleElement;
  arrive: SVGCircleElement;
  sheet: HTMLElement;
  eta: HTMLElement;
};

/** 지금 폰에 열린 일정에 대한 사실 — React가 렌더마다 갱신한다 */
export type StoryBase = { f0: number; days: number; version: string };

export type StoryHooks = {
  onLand(land: boolean): void;
  onNotice(open: boolean): void;
  onNow(index: number): void;
  base(): StoryBase;
};

type Pose = { x: number; y: number; rx: number; ry: number; rz: number; s: number; e: number };
const KEYS: (keyof Pose)[] = ["x", "y", "rx", "ry", "rz", "s", "e"];
/** 단계마다 폰이 살짝 다른 각도로 기운다 [rotateY, y] */
const DRIFT: [number, number][] = [[-5, 0], [4, -10], [-3, 8], [5, -6], [0, -8]];

export function runStory(els: StoryEls, hooks: StoryHooks): () => void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
  };
  let raf = 0;
  let glideRaf = 0;
  let last = performance.now();
  // init: 자세·S의 첫 프레임 표지(scenes보다 먼저 선다). first: scenes 안의 첫 프레임 표지 — P도 감쇠 없이 맞춘다
  const st = { S: -0.5, prevS: -0.5, P: 0, lastP: 0, hud: 0, step: null as number | null, land: false, notice: false, cur: -1, version: "", init: false, first: true };
  const pose: Pose = { x: 0, y: 0, rx: 0, ry: 0, rz: 0, s: 1, e: 0 };
  const target: Pose = { ...pose };
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  const routeLen = els.route.getTotalLength();
  els.route.style.strokeDasharray = els.routeGlow.style.strokeDasharray = String(routeLen);
  els.eta.textContent = "32분";

  const onPointer = (e: PointerEvent) => {
    pointer.tx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / innerHeight) * 2 - 1;
  };
  addEventListener("pointermove", onPointer);

  // 폰 속 스크롤도 브라우저 기본(짧고 급함) 대신 1.1초에 걸쳐 미끄러지듯 — 자동 시연용
  function glide(top: number, dur = 1100) {
    cancelAnimationFrame(glideRaf);
    const el = els.scroll;
    if (reduce) { el.scrollTop = top; return; }
    const from = el.scrollTop;
    const t0 = performance.now();
    const k = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      el.scrollTop = from + (top - from) * k(t);
      if (t < 1) glideRaf = requestAnimationFrame(tick);
    };
    glideRaf = requestAnimationFrame(tick);
  }

  // 손가락 탭 물결 — 화면 좌표를 폰 화면의 배치 좌표로 되돌려 찍는다(슬롯이 축소·기울어 있어도 맞게)
  function tap(target: Element | null) {
    // 모션 줄이기: 퍼지는 물결은 애니메이션이라 CSS가 멈추면 정지한 동그라미로 남는다 — 아예 찍지 않는다
    if (!target || reduce) return;
    const sc = els.screen;
    const sr = sc.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    const d = document.createElement("span");
    d.className = els.tapClass;
    d.style.left = `${(r.left - sr.left + r.width / 2) / (sr.width / sc.offsetWidth)}px`;
    d.style.top = `${(r.top - sr.top + r.height / 2) / (sr.height / sc.offsetHeight)}px`;
    els.taps.appendChild(d);
    later(() => d.remove(), 800);
  }

  // 가만히 있으면 폰이 스스로 써 보인다: 공지 → 지금 할 일 → 2일차 → 1일차 (명세 §4-5)
  const attract = { on: false, touched: false, i: 0, page: 0, timer: 0 };
  const toNow = (yes: boolean) => {
    const now = els.phone.querySelector<HTMLElement>('[data-day-page="0"] [data-state="current"]');
    glide(yes && now ? offsetY(now, els.scroll) - els.scroll.clientHeight * 0.29 : 0);
  };
  const seq = [
    () => { els.phone.dataset.demo = "notice"; },
    () => {
      els.phone.dataset.demo = "";
      toNow(true);
      later(() => { if (attract.on) els.phone.dataset.demo = "now"; }, 700);
    },
    () => { els.phone.dataset.demo = ""; attract.page = 1; },
    () => { attract.page = 0; toNow(false); },
  ];
  const tick = () => {
    if (!attract.on) return;
    seq[attract.i++ % seq.length]();
    attract.timer = window.setTimeout(tick, 3000);
  };
  const startAttract = () => {
    if (attract.on || reduce || attract.touched) return;
    attract.on = true;
    attract.timer = window.setTimeout(tick, 1800);
  };
  const stopAttract = () => {
    if (!attract.on) return;
    attract.on = false;
    clearTimeout(attract.timer);
    // 진행 중인 폰 속 미끄러짐도 끊는다 — 안 그러면 scenes()와 glide가 둘 다 scrollTop을 쓴다
    cancelAnimationFrame(glideRaf);
    els.phone.dataset.demo = "";
    attract.page = 0;
  };
  // 폰에 커서를 올리면 멈추고 다시 시작하지 않는다 — 들여다보는 사람의 화면을 바꾸지 않게
  const onEnter = () => { attract.touched = true; stopAttract(); };
  els.slot.addEventListener("pointerenter", onEnter);

  // 알림 칩: 2.6초마다 데스크톱 2장·모바일 1장
  const pings = Array.from(els.pings.children) as HTMLElement[];
  let pingI = 0;
  const pingLoop = () => {
    pings.forEach((p) => { delete p.dataset.show; });
    pings[pingI % pings.length].dataset.show = "";
    if (innerWidth >= 960) pings[(pingI + 1) % pings.length].dataset.show = "";
    pingI++;
    later(pingLoop, 2600);
  };
  if (pings.length) {
    if (reduce) pings[0].dataset.show = "";
    else later(pingLoop, 1400);
  }

  function setStep(i: number) {
    if (i === st.step) return;
    st.step = i;
    els.steps.forEach((s, k) => { s.dataset.active = String(k === i); });
    els.phone.dataset.step = String(i);
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const kp = 1 - Math.exp(-dt * 5);
    pointer.x += (pointer.tx - pointer.x) * kp;
    pointer.y += (pointer.ty - pointer.y) * kp;

    const vh = innerHeight;
    const vw = innerWidth;
    const wide = vw >= 960;
    const jr = els.journey.getBoundingClientRect();
    const p = clamp(-jr.top / (vh * 1.3));
    const e = reduce ? (p > 0.5 ? 1 : 0) : ease(p);

    const rawS = storyPosition(els.steps, vh);
    setStep(rawS >= 0 ? Math.floor(rawS) : -1);
    if (rawS < -0.25) startAttract();
    else stopAttract();

    // 착지(데스크톱): 만들어 보기 폰 중심이 화면 1.35vh → 0.5vh로 오는 동안 0 → 1
    let q = 0;
    let tr: DOMRect | null = null;
    if (wide && els.tryPhone) {
      tr = els.tryPhone.getBoundingClientRect();
      q = smooth(vh * 1.35, vh * 0.5, tr.top + tr.height / 2);
    }

    const k = reduce || !st.init ? 1 : 1 - Math.exp(-dt * 3.2);
    st.S += (rawS - st.S) * k;

    const A = wide ? { x: vw * 0.25, y: 10, ry: -16, rz: 4, s: 0.92 } : { x: 0, y: vh * 0.36, ry: 0, rz: 0, s: 0.66 };
    const B = wide ? { x: vw * 0.17, y: 0, ry: 0, rz: 0, s: 1.04 } : { x: 0, y: vh * 0.2, ry: 0, rz: 0, s: 0.74 };
    const d = wide && st.step !== null && st.step >= 0 ? DRIFT[st.step] ?? [0, 0] : [0, 0];
    const tilt = reduce ? 0 : (1 - e) * (wide ? 1 : 0); // 모션 줄이기: 커서 기울기 없음(명세 §9)
    target.x = lerp(A.x, B.x, e) + pointer.x * 10 * tilt;
    target.y = lerp(A.y, B.y, e) + pointer.y * 8 * tilt + d[1] * e;
    target.ry = lerp(A.ry, B.ry, e) + pointer.x * 8 * tilt + d[0] * e;
    target.rx = -pointer.y * 6 * tilt;
    target.rz = lerp(A.rz, B.rz, e);
    target.s = lerp(A.s, B.s, e) + 0.05 * smooth(4.1, 4.32, st.S); // 지도가 올라올 때 살짝 다가온다
    target.e = e;
    for (const key of KEYS) pose[key] += (target[key] - pose[key]) * k;
    st.init = true;

    let o: Pose = pose;
    if (q > 0 && tr) {
      // 옆으로 먼저 비켜난 뒤(가로는 앞 45%에 끝난다) 내려앉는다 — 만들기 패널과 겹치지 않게
      const qe = ease(q);
      const qx = ease(smooth(0, 0.45, q));
      const R: Pose = { x: tr.left + tr.width / 2 - vw / 2, y: tr.top + tr.height / 2 - vh / 2, rx: 0, ry: 0, rz: 0, s: tr.width / 300, e: pose.e };
      o = { ...pose };
      for (const key of KEYS) o[key] = lerp(pose[key], R[key], key === "x" ? qx : qe);
    }
    const landed = q >= 0.999;
    // 모바일은 무대와 함께 움직여 여정이 끝나면 위로 빠진다(착지 없음 — 명세 §4-1)
    const stageTop = wide ? 0 : els.stage.getBoundingClientRect().top;

    const sl = els.slot.style;
    sl.visibility = landed ? "hidden" : "";
    sl.zIndex = q > 0 ? "6" : ""; // 날아가는 동안엔 만들기 패널 위로
    if (els.tryPhone) els.tryPhone.style.opacity = wide && !landed ? "0" : "";
    sl.setProperty("--px", `${o.x.toFixed(2)}px`);
    sl.setProperty("--py", `${(o.y + stageTop).toFixed(2)}px`);
    sl.setProperty("--rx", `${o.rx.toFixed(3)}deg`);
    sl.setProperty("--ry", `${o.ry.toFixed(3)}deg`);
    sl.setProperty("--rz", `${o.rz.toFixed(3)}deg`);
    sl.setProperty("--ps", o.s.toFixed(4));
    els.stage.style.setProperty("--vid", (1 - pose.e * 0.88).toFixed(3));
    els.stage.style.setProperty("--aura", pose.e.toFixed(3));
    els.pings.style.opacity = (1 - smooth(0, 0.3, pose.e)).toFixed(3); // 단톡방이 뜨기 전에 비킨다
    els.cue.style.opacity = String(1 - Math.min(1, p * 4));

    scenes(dt, q);
    raf = requestAnimationFrame(frame);
  }

  function scenes(dt: number, q: number) {
    const S = st.S;
    const cross = (th: number, fn: () => void) => { if (st.prevS < th && S >= th && S - st.prevS < 0.5) fn(); };

    // 착지가 시작되면(지도가 덮고 있을 때) 폰 속을 만들어 보기 초안으로 바꿔 둔다
    const land = q > 0.01;
    if (land !== st.land) { st.land = land; hooks.onLand(land); }
    const base = hooks.base();
    if (base.version !== st.version) {
      // 다른 일정이 열렸다 — 흐름·넘기기·폰 속 스크롤을 처음부터
      st.version = base.version;
      st.cur = -1;
      st.P = st.lastP = 0;
      els.scroll.scrollTop = 0;
    }

    // 1) 단톡방에 링크가 온다 → 탭 → 뷰어가 아래에서 올라온다
    let vy = 0;
    let vo = 1;
    if (!land) {
      if (S < -0.1) vo = 1 - smooth(-0.35, -0.1, S);
      else vy = 1 - smooth(0.32, 0.62, S);
    }
    els.vwrap.style.transform = vy > 0.0005 ? `translateY(${(vy * 100).toFixed(2)}%)` : "";
    els.vwrap.style.opacity = vo < 0.9995 ? vo.toFixed(3) : "";
    els.msgs.forEach((m, i) => {
      const t = smooth(-0.3 + i * 0.13, -0.17 + i * 0.13, S);
      m.style.opacity = t.toFixed(3);
      m.style.transform = `translateY(${((1 - t) * 10).toFixed(1)}px)`;
    });
    cross(0.27, () => {
      tap(els.lcard);
      els.lcard.dataset.press = "";
      later(() => { delete els.lcard.dataset.press; }, 280);
    });

    // 2) 공지가 펼쳐졌다 접힌다
    const notice = !land && S >= 1.08 && S < 1.92;
    if (notice !== st.notice) { st.notice = notice; hooks.onNotice(notice); }

    // 3) 시간이 흐른다: '지금' 점이 레일을 타고 내려가며 일정이 차례로 지나간다
    const tl = els.phone.querySelector<HTMLElement>('[data-day-page="0"] [data-testid="timeline"]');
    const dot = tl?.querySelector<HTMLElement>("[data-now-dot]");
    let dotY = 0;
    if (tl && dot) {
      const c = dotCenters(tl);
      const f0 = base.f0;
      dot.style.display = f0 < 0 || c.length === 0 ? "none" : "";
      if (f0 >= 0 && c.length) {
        const f = land ? f0 : f0 + smooth(2.05, 2.85, S) * (c.length - 1 - f0);
        const cur = Math.min(c.length - 1, Math.floor(f + 0.04)); // 점이 줄에 닿는 순간 그 줄이 '지금'
        if (cur !== st.cur) { st.cur = cur; hooks.onNow(cur); }
        const a = Math.min(Math.floor(f), c.length - 1);
        const b = Math.min(a + 1, c.length - 1);
        dotY = lerp(c[a], c[b], f - a);
        dot.style.transform = `translateY(${dotY.toFixed(1)}px)`;
        tl.style.setProperty("--fill-h", `${(dotY - c[0]).toFixed(1)}px`); // 코랄 선은 언제나 점 중심에서 끝난다
      }
    }

    // 폰 속 스크롤은 이야기 위치를 따라간다(히어로 자동 시연 중엔 손대지 않는다)
    if (S >= -0.1 && !land && tl) {
      const h = els.scroll.clientHeight;
      const pager = els.phone.querySelector<HTMLElement>('[data-testid="day-pager"]');
      let top = lerp(0, offsetY(tl, els.scroll) + dotY - h * 0.42, smooth(1.95, 2.2, S));
      if (pager) top = lerp(top, offsetY(pager, els.scroll) - h * 0.14, smooth(2.9, 3.15, S));
      els.scroll.scrollTop = top;
    }

    // 4) 일차 넘기기 — 트랙을 직접 민다. 머리줄·HUD는 DayPager가 scroll 이벤트로 따라온다
    const nd = base.days;
    const Pt = clamp(S < -0.1 ? attract.page : land ? 0 : smooth(3.12, 3.42, S) + smooth(3.55, 3.85, S), 0, Math.max(0, nd - 1));
    // 첫 프레임(새로고침·앵커 이동으로 여정 한가운데서 시작)은 감쇠 없이 바로 — 명세 §9.
    // lastP도 같이 맞춰, 그 점프가 넘기는 방향(dir)·손가락 표시로 읽히지 않게 한다
    st.P += (Pt - st.P) * (reduce || st.first ? 1 : 1 - Math.exp(-dt * 5));
    if (st.first) st.lastP = st.P;
    st.first = false;
    const P = st.P;
    const dir = P - st.lastP;
    st.lastP = P;
    const track = els.phone.querySelector<HTMLElement>('[data-testid="day-track"]');
    if (track) {
      const x = Math.round(P * track.clientWidth);
      if (Math.abs(track.scrollLeft - x) >= 1) track.scrollLeft = x;
    }
    st.hud = Math.abs(dir) > 0.0015 ? 1 : Math.max(0, st.hud - dt * 1.3);
    const fr = P - Math.floor(P);
    els.finger.style.opacity = smooth(0.55, 1, st.hud).toFixed(3);
    els.finger.style.left = `${(dir >= 0 ? 80 - 60 * fr : 20 + 60 * (1 - fr)).toFixed(1)}%`;

    // 5) 길찾기: 버튼을 누르면 지도가 올라오고, 경로가 그려지며 남은 시간이 줄어든다
    cross(4.06, () => tap(els.phone.querySelector('[data-part="cta"] span')));
    const mv = smooth(4.1, 4.32, S) * (1 - smooth(0.02, 0.3, q));
    els.map.style.transform = `translateY(${((1 - mv) * 100).toFixed(2)}%)`;
    const r = smooth(4.34, 4.82, S);
    els.route.style.strokeDashoffset = els.routeGlow.style.strokeDashoffset = (routeLen * (1 - r)).toFixed(1);
    const pt = els.route.getPointAtLength(routeLen * r);
    els.car.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    els.car.style.opacity = r > 0.002 && r < 0.995 ? "1" : "0";
    els.arrive.style.opacity = smooth(4.8, 4.88, S).toFixed(3);
    els.sheet.style.transform = `translateY(${((1 - smooth(4.26, 4.42, S)) * 105).toFixed(1)}%)`;
    const eta = r >= 0.995 ? "도착" : `${Math.max(1, Math.round(32 * (1 - r)))}분`;
    if (els.eta.textContent !== eta) els.eta.textContent = eta;

    st.prevS = S;
  }

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(glideRaf);
    clearTimeout(attract.timer);
    timers.forEach(clearTimeout);
    removeEventListener("pointermove", onPointer);
    els.slot.removeEventListener("pointerenter", onEnter);
  };
}
