/**
 * @file 레일 측정
 * @description 타임라인 점의 중심을 재서 레일 위치를 CSS 변수로 넣는다(랜딩 명세 §8-3).
 *              getBoundingClientRect 대신 offsetTop 사슬로 잰다 — 랜딩 폰은 축소·기울기(transform)
 *              안에 있어서 화면 좌표로 재면 축소된 값이 나온다.
 *
 * @connects
 *  - src/client/components/viewer/timeline.tsx     → 렌더 뒤 measureRail
 *  - src/client/components/landing/run-story.ts    → 움직이는 '지금' 점(dotCenters·offsetY)
 */

/** el의 root 기준 세로 위치. root는 position이 있는 조상이어야 한다(offsetParent 사슬이 root에서 멈춘다). */
export function offsetY(el: HTMLElement, root: HTMLElement): number {
  let y = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

/** 타임라인 점들의 중심(root 기준) */
export function dotCenters(root: HTMLElement): number[] {
  return [...root.querySelectorAll<HTMLElement>('[data-testid="timeline-dot"]')].map(
    (d) => offsetY(d, root) + d.offsetHeight / 2,
  );
}

/**
 * 회색은 첫 점~마지막 점, 코랄은 첫 점~마지막 '지남/지금' 점. 그런 점이 없으면 코랄 길이 0.
 * 결과: --y0(시작), --rail-h(회색 길이), --fill-h(코랄 길이)
 */
export function measureRail(root: HTMLElement): void {
  const c = dotCenters(root);
  if (c.length === 0) return;
  let f = -1;
  root.querySelectorAll<HTMLElement>('[data-testid="timeline-row"]').forEach((r, i) => {
    if (r.dataset.state === "past" || r.dataset.state === "current") f = i;
  });
  root.style.setProperty("--y0", `${c[0]}px`);
  root.style.setProperty("--rail-h", `${c[c.length - 1] - c[0]}px`);
  root.style.setProperty("--fill-h", `${f < 0 ? 0 : c[f] - c[0]}px`);
}
