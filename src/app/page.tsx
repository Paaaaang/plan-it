/**
 * @file 공개 랜딩 — v8 (다크 고정)
 * @description 받는 사람의 하루를 스크롤로 보여 주고(여정), 그 폰이 '만들어 보기'에 내려앉는다.
 *              명세: docs/superpowers/specs/2026-10-20-landing-renewal-design.md
 *
 * @spec F-LAND-1·3·6 (F-LAND-4 공지 배너는 announcements 테이블이 생긴 뒤)
 * @spec F-LAND-6 (로그인 상태면 대시보드로) — CTA는 /login으로 보내고, 로그인 상태면
 *       src/proxy.ts가 /dashboard로 돌려보낸다. 이 페이지는 인증을 읽지 않는다.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nanum_Pen_Script } from "next/font/google";
import { LandingVideo } from "@/client/components/landing/landing-video";
import { LANDING_VIDEOS } from "@/client/components/landing/landing-videos";
import styles from "@/client/components/landing/landing.module.css";

const TITLE = "플랜잇 — 모임을 하나의 링크로";
const DESCRIPTION = "모임 기획자를 위한 일정 공유 도구. 받는 사람은 로그인 없이 링크 하나로 열어요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", locale: "ko_KR", siteName: "플랜잇" },
};

// 손글씨 한 줄만 랜딩에서 쓴다 — 빌드 때 자체 호스팅되어 런타임 외부 요청이 없다
const hand = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], display: "swap", preload: false, variable: "--font-hand" });

function Wordmark() {
  return (
    <span className={styles.wordmark}>
      <Image src="/logos/Logo_White.png" alt="" width={30} height={30} />
      플랜잇
    </span>
  );
}

export default function Home() {
  return (
    <div data-testid="landing" data-landing="" className={`${styles.root} ${hand.variable}`}>
      <div className={styles.texture} aria-hidden="true" />

      <header className={styles.top}>
        <div className={`${styles.wrap} ${styles.topInner}`}>
          <Link href="/" aria-label="플랜잇 홈">
            <Wordmark />
          </Link>
          <nav className={`${styles.nav} ${styles.glass}`} aria-label="주요 메뉴">
            <ul>
              <li><a href="#try">만들어 보기</a></li>
              <li><a href="#tour">둘러보기</a></li>
              <li><a href="#cases">쓰임</a></li>
            </ul>
          </nav>
          <Link href="/login" className={`${styles.login} ${styles.glass}`}>로그인</Link>
        </div>
      </header>

      <main>
        <section className={styles.final} aria-labelledby="h2final">
          <LandingVideo src={LANDING_VIDEOS.final} className={styles.bgVideo} />
          <div className={styles.finalShade} aria-hidden="true" />
          <div className={`${styles.wrap} ${styles.finalInner}`}>
            <span className={`${styles.hand} ${styles.finalHand}`}>같이 가요</span>
            <h2 id="h2final" className={styles.finalTitle}>다음 모임,<br />플랜잇으로.</h2>
            <p className={styles.finalSub}>지금은 무료예요.</p>
            <Link href="/login" className={`${styles.btn} ${styles.btnCoral}`}>
              내 모임 만들기 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className={`${styles.wrap} ${styles.footer}`}>
        <Wordmark />
        <p>© 2026 플랜잇</p>
      </footer>
    </div>
  );
}
