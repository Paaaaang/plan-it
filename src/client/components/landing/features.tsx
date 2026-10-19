/**
 * @file 가치 제안 · 핵심 기능 소개 섹션
 * @description 핵심 가치 3개 — 명세 §8의 순서(링크 / 로그인 없이 / 저장 버튼 없는 편집).
 *              아이콘 + 제목뿐이다. 제목을 풀어 쓰는 본문은 두지 않는다(명세 §7-1).
 *
 * @spec F-LAND-2 (가치 제안·핵심 기능 소개)
 *
 * @connects
 *  - src/client/components/ui/icon.tsx
 *  - src/client/components/landing/landing.module.css
 */

import { DoorOpen, Link2, PenLine } from "lucide-react";
import { Icon } from "@/client/components/ui/icon";
import styles from "@/client/components/landing/landing.module.css";

const VALUES = [
  { icon: Link2, title: "링크 하나로 공유" },
  { icon: DoorOpen, title: "받는 사람은 로그인 없이" },
  { icon: PenLine, title: "저장 버튼 없는 편집" },
];

export function Features() {
  return (
    <section id="value" className={styles.section}>
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mx-auto mb-15 max-w-2xl text-center text-landing-h2 font-bold text-balance text-landing-starlight">
          모임 기획이, 메모장보다 가볍게.
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <li key={v.title} className={`flex items-center gap-4 px-7 py-8 ${styles.valueCard}`}>
              <span className={`size-11 shrink-0 ${styles.valueIcon}`}>
                <Icon name={v.icon} size={22} strokeWidth={2} />
              </span>
              <h3 className="text-title-2 font-semibold text-landing-starlight">{v.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
