/**
 * @file 하단 CTA 섹션 — 코랄 CTA
 * @description 랜딩에서 코랄이 등장하는 자리(명세 §2-4). 비용은 새 정보라 한 줄 남긴다.
 *              Pro가 생기면 이 자리에 가격을 둔다(명세 §9-4) — 없는 Pro를 미리 알리지 않는다.
 *
 * @connects
 *  - app/(auth)/login/page.tsx → 시작하기·로그인 둘 다 같은 카카오 로그인. 로그인 상태면
 *                                src/proxy.ts가 /dashboard로 보낸다(F-LAND-6)
 *  - src/client/components/landing/landing.module.css
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/client/components/ui/icon";
import styles from "@/client/components/landing/landing.module.css";

export function CtaSection() {
  return (
    <section className={`text-center ${styles.section} ${styles.finalCta}`}>
      <div className="relative mx-auto max-w-7xl px-6">
        <h2 className="mb-4 text-landing-h2 font-bold text-balance text-landing-starlight">다음 모임, 플랜잇으로.</h2>
        <p className="mb-8 text-landing-body text-landing-moonlight">지금은 무료예요.</p>
        <Link href="/login" className={`gap-2 px-8 py-4 text-title-3 ${styles.cta} ${styles.ctaCoral}`}>
          내 모임 만들기
          <Icon name={ArrowRight} size={18} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
