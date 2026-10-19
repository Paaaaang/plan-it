/**
 * @file 샘플 뷰어 미리보기
 * @description 히어로 오른쪽의 모바일 뷰어 목업. 실제 뷰어 컴포넌트가 아니라 정적 일러스트다 —
 *              뷰어는 기획자 DS 톤(라이트/다크·코랄)이라 랜딩의 오로라 톤과 섞으면 둘 다 깨진다.
 *
 * @spec F-LAND-3 (샘플 뷰어 미리보기 또는 링크) — P1
 *
 * @connects
 *  - src/client/components/landing/hero.tsx         → 배치
 *  - src/client/components/landing/landing.module.css
 */

import styles from "@/client/components/landing/landing.module.css";

const ITEMS = [
  ["10:00", "공항 집결"],
  ["12:30", "흑돼지 점심"],
  ["15:00", "협재 해변"],
  ["18:00", "숙소 체크인"],
  ["20:00", "바비큐 저녁"],
] as const;

export function SampleViewer() {
  return (
    <div
      role="img"
      aria-label="모바일 뷰어 예시 — 제주 3일 모임 1일차 일정"
      className={`mx-auto flex w-70 shrink-0 flex-col gap-2.5 p-3.5 ${styles.phone}`}
    >
      <div className={`mt-3 flex h-32 items-end px-3 pb-2.5 text-label font-bold ${styles.phoneCover}`}>
        제주 3일 모임
      </div>
      <div className="flex gap-1.5">
        {["1일차", "2일차", "3일차"].map((day, i) => (
          <span
            key={day}
            className={`flex-1 py-1.5 text-center text-micro font-semibold ${styles.phoneTab} ${i === 0 ? styles.phoneTabOn : ""}`}
          >
            {day}
          </span>
        ))}
      </div>
      <ul className="flex flex-col gap-1.5">
        {ITEMS.map(([time, name]) => (
          <li key={time} className={`flex items-center justify-between px-2.5 py-2 text-micro ${styles.phoneItem}`}>
            <span className="tnum font-mono text-aurora-cyan">{time}</span>
            <span className="font-medium text-landing-starlight">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
