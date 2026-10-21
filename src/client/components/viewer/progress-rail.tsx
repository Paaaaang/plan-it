/**
 * 타임라인을 관통하는 한 줄 레일. 이 제품에서 가장 특징적인 요소다 (스펙 §4.6).
 * 회색은 첫 점 중심 → 마지막 점 중심, 코랄은 첫 점 중심 → '지금'(없으면 마지막 '지남') 점 중심.
 * 위치(--y0 --rail-h --fill-h)는 Timeline이 점을 재서 넣는다(rail-geometry.ts) — 줄 높이가 제각각이라
 * 비율로 계산하면 코랄 끝이 점에서 어긋난다(랜딩 명세 §8-3). 재기 전(서버 렌더)에는 회색만 전체 높이로.
 * left는 점의 중심에 맞춘다: 시각 열 38px + 행 gap 10px = 48px에서 점(11px)이 시작하니
 * 중심은 53.5px, 레일(3px)의 left는 52px이다.
 */
export function ProgressRail() {
  const base = "pointer-events-none absolute left-[52px] w-[3px] rounded-full";
  return (
    <>
      <div
        aria-hidden="true"
        data-testid="progress-rail"
        className={`${base} bg-[var(--rail-future)]`}
        style={{ top: "var(--y0, 18px)", height: "var(--rail-h, calc(100% - 36px))" }}
      />
      <div
        aria-hidden="true"
        data-testid="progress-rail-fill"
        className={`${base} bg-[var(--rail-past)]`}
        style={{ top: "var(--y0, 18px)", height: "var(--fill-h, 0px)" }}
      />
    </>
  );
}
