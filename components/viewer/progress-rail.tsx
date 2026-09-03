import { railGradient } from "@/lib/viewer/rail";

/**
 * 타임라인을 관통하는 3px 세로선. 이 제품에서 가장 특징적인 요소다 (스펙 §4.6).
 * 위치는 부모(.relative)에 대해 절대 배치한다 — 첫 점과 마지막 점 사이를 잇는다.
 */
export function ProgressRail({ progress }: { progress: number | null }) {
  return (
    <div
      aria-hidden="true"
      data-testid="progress-rail"
      className="pointer-events-none absolute left-[55px] top-[18px] bottom-[18px] w-[3px] rounded-full"
      style={{ background: railGradient(progress) }}
    />
  );
}
