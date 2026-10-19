/**
 * @file 쓰임 예시 — 여행 · MT · 워크샵 · 주말 모임
 * @description "여행 전용이 아니다"를 태그 4개가 보여 준다 — 설명 문단은 두지 않는다(명세 §7-1).
 *              예시라 링크도 지표도 없다. 시안의 "조회 142회"는 지어낸 지표라 넣지 않는다(D3).
 *              plan_type 표기('워크샵')는 제품 데이터와 맞춘다.
 * @connects landing.module.css
 */

import styles from "@/client/components/landing/landing.module.css";

const CASES = [
  { tag: "여행", title: "제주 3일 — 친구 4명", date: "10월 23–25일", tone: styles.caseBlue },
  { tag: "MT·동아리", title: "가평 1박 MT", date: "11월 2–3일", tone: styles.caseLavender },
  { tag: "워크샵", title: "4분기 팀 워크샵", date: "11월 15일", tone: styles.caseCyan },
  { tag: "주말 모임", title: "북한강 라이딩", date: "10월 26일", tone: styles.caseMist },
];

export function UseCases() {
  return (
    <section id="cases" className={styles.section}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mx-auto mb-15 max-w-2xl text-center text-landing-h2 font-bold text-balance text-landing-starlight">
          이런 모임에 써요.
        </h2>
        <ul className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {CASES.map((c) => (
            <li key={c.title} className={`flex flex-col justify-between p-4 ${styles.case} ${c.tone}`}>
              <span className={`self-start px-2 py-1 font-mono text-micro font-bold text-aurora-cyan ${styles.caseTag}`}>{c.tag}</span>
              <div>
                <h3 className="mb-1 text-item-title font-bold text-landing-starlight">{c.title}</h3>
                <p className="tnum text-caption text-landing-moonlight">{c.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
