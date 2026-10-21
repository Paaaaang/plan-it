/**
 * @file 랜딩 이야기 — 여정 · 폰 슬롯 · 만들어 보기 · 쓰임
 * @description 여정(고정 무대 + 패널 + 단계 5)과 폰 슬롯, 만들어 보기, 쓰임을 한 클라이언트 경계로 묶는다 —
 *              착지(여정 폰 → 만들어 보기 폰 자리)와 쓰임 카드(→ 여정 폰)가 서로의 상태를 쓰기 때문.
 *              폰 슬롯은 무대 **밖**에 position: fixed로 둔다. 무대는 sticky라 쌓임 맥락을 만들어
 *              그 안의 폰은 다음 섹션 위로 내려앉을 수 없다(v6에서 실제로 난 버그 — 명세 §4-1).
 *
 * @connects
 *  - src/app/page.tsx                                  → 배치
 *  - src/client/components/landing/run-story.ts        → 스크롤 이야기
 *  - src/client/components/landing/{story-phone,try-section,case-cards}.tsx
 */

"use client";

import Link from "next/link";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { CaseCards } from "@/client/components/landing/case-cards";
import { LandingVideo } from "@/client/components/landing/landing-video";
import { LANDING_VIDEOS } from "@/client/components/landing/landing-videos";
import { runStory, type StoryBase, type StoryEls } from "@/client/components/landing/run-story";
import { StoryPhone, createStoryPhoneRefs } from "@/client/components/landing/story-phone";
import { TrySection } from "@/client/components/landing/try-section";
import styles from "@/client/components/landing/landing.module.css";
import { DEFAULT_DRAFT, LANDING_CASES, at, draftCase, type CaseKey, type Draft } from "@/shared/fixtures/landing";
import { itemState } from "@/shared/viewer/rail";

const STEPS = [
  ["01", "링크를 열면", "앱도 로그인도 없이, 바로 이 화면이에요."],
  ["02", "공지가 맨 먼저", "집결 시간·준비물·회비를 한눈에."],
  ["03", "지금 어디쯤인지", "지난 일정은 흐려지고, 지금 할 일이 빛나요."],
  ["04", "일차를 넘겨도", "2박 3일도 손가락 한 번이면 돼요."],
  ["05", "다음 장소까지", "카카오맵으로 바로 길찾기."],
] as const;

/** 폰 가장자리에 걸치는 알림 칩 — 데모 이름 */
const PINGS = [
  { av: "--landing-av-1", c: "민", who: "민지님", what: "이 일정을 열었어요", when: "방금" },
  { av: "--landing-av-3", c: "현", who: "현우님", what: "이 2일차를 보고 있어요", when: "" },
  { av: "--landing-av-4", c: "수", who: "수아님", what: "이 공지를 확인했어요", when: "" },
] as const;

function createRefs() {
  return {
    journey: createRef<HTMLElement>(),
    stage: createRef<HTMLDivElement>(),
    slot: createRef<HTMLDivElement>(),
    steps: { current: [] as (HTMLDivElement | null)[] },
    pings: createRef<HTMLDivElement>(),
    cue: createRef<HTMLDivElement>(),
    tryPhone: createRef<HTMLDivElement>(),
    phone: createStoryPhoneRefs(),
  };
}

function need<T>(v: T | null | undefined, name: string): T {
  if (!v) throw new Error(`랜딩 이야기: ${name} 요소가 없다`);
  return v;
}

export function LandingStory() {
  const [refs] = useState(createRefs);
  const [heroKey, setHeroKey] = useState<CaseKey>("jeju");
  const [draft, setDraft] = useState<Draft>(DEFAULT_DRAFT);
  const [land, setLand] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [nowPick, setNowPick] = useState<{ version: string; index: number } | null>(null);

  // 착지 중엔 여정 폰이 만들어 보기 초안을 보인다(명세 §5)
  const version = land ? `draft|${draft.kind}|${draft.len}|${draft.title}` : heroKey;
  const shown = useMemo(() => (land ? draftCase(draft) : LANDING_CASES[heroKey]), [land, draft, heroKey]);
  const day0 = shown.plan.days[0];
  const f0 = day0 ? day0.items.findIndex((_, i) => itemState(day0.items, i, shown.now, day0.date) === "current") : -1;
  // 시간 흐름이 고른 '지금' 줄 — 다른 일정이 열리면(version이 다르면) 버린다
  const picked = nowPick && nowPick.version === version && day0 ? day0.items[nowPick.index] : undefined;
  const now = picked && day0 ? at(day0.date, picked.startTime) : shown.now;

  const base = useRef<StoryBase>({ f0, days: shown.plan.days.length, version });
  useEffect(() => {
    base.current = { f0, days: shown.plan.days.length, version };
  });

  useEffect(() => {
    const p = refs.phone;
    const els: StoryEls = {
      journey: need(refs.journey.current, "journey"),
      stage: need(refs.stage.current, "stage"),
      slot: need(refs.slot.current, "slot"),
      steps: refs.steps.current.filter((s): s is HTMLDivElement => !!s),
      pings: need(refs.pings.current, "pings"),
      cue: need(refs.cue.current, "cue"),
      tryPhone: refs.tryPhone.current,
      phone: need(p.phone.current, "phone"),
      screen: need(p.screen.current, "screen"),
      vwrap: need(p.vwrap.current, "vwrap"),
      scroll: need(p.scroll.current, "scroll"),
      msgs: p.msgs.map((m) => m.current).filter((m): m is HTMLDivElement => !!m),
      lcard: need(p.lcard.current, "lcard"),
      taps: need(p.taps.current, "taps"),
      tapClass: styles.tap,
      finger: need(p.finger.current, "finger"),
      map: need(p.map.current, "map"),
      route: need(p.route.current, "route"),
      routeGlow: need(p.routeGlow.current, "routeGlow"),
      car: need(p.car.current, "car"),
      arrive: need(p.arrive.current, "arrive"),
      sheet: need(p.sheet.current, "sheet"),
      eta: need(p.eta.current, "eta"),
    };
    return runStory(els, {
      onLand: setLand,
      onNotice: setNoticeOpen,
      onNow: (index) => setNowPick({ version: base.current.version, index }),
      base: () => base.current,
    });
  }, [refs]);

  function openCase(k: CaseKey) {
    setHeroKey(k);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  // 렌더에서는 펼쳐서 쓴다 — React Compiler 린트는 렌더 중 refs.x 읽기를 ref 접근으로 본다(구조 분해는 통과)
  const { journey, stage, slot, steps, pings, cue, tryPhone, phone } = refs;

  return (
    <>
      <section ref={journey} className={styles.journey} id="tour" aria-label="플랜잇 뷰어 둘러보기">
        <div ref={stage} className={styles.stage}>
          <LandingVideo src={LANDING_VIDEOS.hero} className={styles.bgVideo} />
          <div className={styles.shade} aria-hidden="true" />
          <div className={styles.aura} aria-hidden="true" />
        </div>

        <div className={`${styles.panel} ${styles.wrap}`}>
          <div className={styles.lead}>
            <h1 className={styles.h1}>
              <span className={styles.line}><span>방금 본 그 일정,</span></span>
              <span className={styles.line}>
                <span>10분이면 네 것도.</span>
                <span className={`${styles.hand} ${styles.h1Hand}`}>진짜로!</span>
              </span>
            </h1>
            <div className={styles.ctas}>
              <Link href="/login" className={`${styles.btn} ${styles.btnCoral}`}>
                내 모임 만들기 <span aria-hidden="true">→</span>
              </Link>
              <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.glass}`} onClick={() => setHeroKey("jeju")}>
                예시 일정 열어보기
              </button>
            </div>
          </div>
          <div ref={cue} className={styles.cue} aria-hidden="true">스크롤해서 둘러보기<i /></div>
        </div>

        {STEPS.map(([no, title, line], i) => (
          <div
            key={no}
            ref={(el) => { steps.current[i] = el; }}
            className={`${styles.step} ${styles.wrap}`}
            data-story-step=""
          >
            <div className={styles.txt}>
              <span className={styles.no}>{no}</span>
              <h2>{title}</h2>
              <p>{line}</p>
            </div>
          </div>
        ))}
        <div className={styles.journeyEnd} aria-hidden="true" />
      </section>

      <div ref={slot} className={styles.slot} data-testid="story-slot">
        <div ref={pings} className={styles.pings} aria-hidden="true">
          {PINGS.map((p, i) => (
            <div key={p.c} className={`${styles.ping} ${styles.glass} ${styles[`p${i + 1}`]}`}>
              <i style={{ background: `var(${p.av})` }}>{p.c}</i>
              <span><b>{p.who}</b>{p.what}{p.when && <small>{p.when}</small>}</span>
            </div>
          ))}
        </div>
        <StoryPhone refs={phone} plan={shown.plan} now={now} noticeOpen={noticeOpen} version={version} />
      </div>

      <TrySection draft={draft} onDraft={setDraft} phoneRef={tryPhone} />

      <section className={`${styles.cases} ${styles.wrap}`} id="cases" aria-labelledby="h2cases">
        <div className={styles.sechead}>
          <span className={styles.hand}>여행만 아니에요</span>
          <h2 id="h2cases">이번 주말, 이런 모임들.</h2>
        </div>
        <CaseCards onOpen={openCase} />
      </section>
    </>
  );
}
