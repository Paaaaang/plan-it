/**
 * @file 쓰임 카드
 * @description 여행만이 아니라는 걸 예시 세 장으로. 누르면 그 일정이 여정 폰에 열린다(명세 §7).
 */

"use client";

import { LandingVideo } from "@/client/components/landing/landing-video";
import { LANDING_VIDEOS } from "@/client/components/landing/landing-videos";
import styles from "@/client/components/landing/landing.module.css";
import { CASE_KEYS, LANDING_CASES, type CaseKey } from "@/shared/fixtures/landing";
import { periodLabel } from "@/shared/viewer/summary";

export function CaseCards({ onOpen }: { onOpen: (key: CaseKey) => void }) {
  return (
    <div className={styles.casegrid}>
      {CASE_KEYS.map((k) => {
        const { plan } = LANDING_CASES[k];
        return (
          <button
            key={k}
            type="button"
            className={`${styles.case} ${styles.glass}`}
            onClick={() => onOpen(k)}
            aria-label={`${plan.title} 일정을 위쪽 폰에서 열기`}
          >
            <span className={styles.caseMedia}>
              <LandingVideo src={LANDING_VIDEOS[k]} className={styles.bgVideo} />
              <span className={`${styles.caseBar} ${styles.glass}`}>
                <span className={styles.caseText}>
                  <small>{plan.planType} · {periodLabel(plan.startDate, plan.endDate)}</small>
                  <b>{plan.title}</b>
                </span>
                <span className={styles.go} aria-hidden="true">→</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
