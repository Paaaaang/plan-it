/**
 * @file 랜딩 히어로 섹션
 * @description 공유자 → 기획자 전환 선언 + 1차 CTA + 뷰어 목업. 오로라·별 배경을 깐다.
 *
 * @spec F-LAND-1 (히어로: 제품 한 줄 정의 + 주요 CTA)
 * @spec F-LAND-6 (로그인 상태면 대시보드로) — CTA는 /login으로 보내고, 로그인 상태면
 *       src/proxy.ts가 /dashboard로 돌려보낸다. 이 컴포넌트는 인증을 읽지 않는다.
 *
 * @connects
 *  - src/app/page.tsx                                → liveCount 주입
 *  - src/client/components/landing/sample-viewer.tsx → 뷰어 목업
 *  - src/client/components/landing/landing.module.css
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/client/components/ui/icon";
import { SampleViewer } from "@/client/components/landing/sample-viewer";
import styles from "@/client/components/landing/landing.module.css";

/** 이 수 미만이면 라이브 숫자를 숨긴다 — 작은 숫자는 신뢰를 깎는다(명세 §9-5). */
export const LIVE_MIN = 30;

export function Hero({ liveCount }: { liveCount: number | null }) {
  return (
    <section className={`${styles.section} ${styles.hero}`}>
      <div data-testid="aurora" className={styles.aurora} aria-hidden>
        <svg viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none" className="h-full w-full">
          <defs>
            <linearGradient id="landing-aurora-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "var(--aurora-blue)", stopOpacity: 0 }} />
              <stop offset="30%" style={{ stopColor: "var(--aurora-cyan)", stopOpacity: 0.6 }} />
              <stop offset="60%" style={{ stopColor: "var(--aurora-lavender)", stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: "var(--aurora-blue)", stopOpacity: 0 }} />
            </linearGradient>
            <linearGradient id="landing-aurora-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "var(--aurora-lavender)", stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: "var(--aurora-mist)", stopOpacity: 0.4 }} />
              <stop offset="100%" style={{ stopColor: "var(--aurora-blue)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d="M -100 400 Q 200 200, 500 350 T 1100 300 T 1600 380" stroke="url(#landing-aurora-1)" strokeWidth="80" strokeLinecap="round" opacity="0.6" />
          <path d="M -100 500 Q 300 320, 600 450 T 1200 420 T 1600 480" stroke="url(#landing-aurora-2)" strokeWidth="60" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>
      <div className={styles.starfield} aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => <span key={n} className={styles.star} />)}
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-15 px-6 md:grid-cols-[1fr_auto]">
        {/* 서브 카피·메타 줄은 두지 않는다 — 무엇인지는 목업이, 장점은 핵심 가치 카드가 말한다(명세 §7-1) */}
        <div className="max-w-2xl">
          {liveCount !== null && liveCount >= LIVE_MIN && (
            <p
              data-testid="hero-eyebrow"
              className={`mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-micro font-bold text-aurora-cyan ${styles.eyebrow}`}
            >
              <span className={styles.live} aria-hidden />
              지금 <span className="tnum">{liveCount.toLocaleString("ko-KR")}</span>개의 모임이 공유되고 있어요
            </p>
          )}
          <h1 className={`mb-10 text-landing-display font-extrabold text-balance ${styles.title}`}>
            방금 본 그 일정,
            <br />
            10분이면 네 것도.
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/login" className={`gap-2 px-6 py-3.5 text-item-title ${styles.cta} ${styles.ctaPrimary}`}>
              내 모임 만들기
              <Icon name={ArrowRight} size={16} strokeWidth={2.5} />
            </Link>
            <a href="#cases" className={`px-6 py-3.5 text-item-title ${styles.cta} ${styles.ctaGhost}`}>
              예시 보기
            </a>
          </div>
        </div>
        <SampleViewer />
      </div>
    </section>
  );
}
