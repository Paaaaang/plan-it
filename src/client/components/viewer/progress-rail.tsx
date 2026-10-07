import { railGradient } from "@/shared/viewer/rail";

/**
 * 타임라인을 관통하는 3px 세로선. 이 제품에서 가장 특징적인 요소다 (스펙 §4.6).
 * 위치는 부모(.relative)에 대해 절대 배치한다 — 첫 점과 마지막 점 사이를 잇는다.
 */
export function ProgressRail({ progress }: { progress: number | null }) {
  return (
    <div
      aria-hidden="true"
      data-testid="progress-rail"
      // left는 점의 중심에 맞춘다: 시각 열 38px + 행 gap 10px = 48px에서 점(11px)이 시작하니
      // 중심은 53.5px, 레일(3px)의 left는 52px이다. 시안의 55px은 행 gap이 11px일 때의 값이라
      // 그대로 옮기면 오른쪽으로 3px 어긋난다 (스크린샷으로 실측).
      className="pointer-events-none absolute bottom-[18px] left-[52px] top-[18px] w-[3px] rounded-full"
      style={{ background: railGradient(progress) }}
    />
  );
}
