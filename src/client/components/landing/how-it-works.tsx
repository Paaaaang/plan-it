/**
 * @file 작동 방식 — 만들기 → 공유하기 → 보기
 * @description 단계마다 제목 + 미니 UI뿐이다. 미니 UI가 보여 주는 걸 본문으로 다시 말하지 않는다(명세 §7-1).
 * @connects landing.module.css
 */

import styles from "@/client/components/landing/landing.module.css";

const STEPS = [
  { title: "만들기", key: "새 모임", value: "제주 3일 모임 · 10월 23–25일" },
  { title: "공유하기", key: "링크", value: "/p/jeju3days" },
  { title: "보기", key: "1일차", value: "일정 5개" },
];

export function HowItWorks() {
  return (
    <section id="how" className={`${styles.section} ${styles.how}`}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mx-auto mb-15 max-w-2xl text-center text-landing-h2 font-bold text-balance text-landing-starlight">
          세 단계면 끝나요.
        </h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`relative px-6 py-7 ${styles.step}`}>
              <h3 className="mb-5 flex items-baseline gap-3 text-title-2 font-semibold text-landing-starlight">
                <span className="tnum font-mono text-label font-bold text-aurora-cyan">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h3>
              <p data-mini className={`p-3.5 font-mono text-caption text-landing-moonlight ${styles.mini}`}>
                <span className="text-aurora-mist">{s.key}</span> › {s.value}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
