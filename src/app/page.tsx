/**
 * @file 공개 랜딩 — 미드나잇 블루 오로라 (다크 전용)
 * @description 뷰어 링크로 들어온 사람을 기획자로 전환시키는 페이지.
 *              명세: docs/landing-tone-and-manner.md
 *
 * @spec F-LAND-1~3·5·6 (F-LAND-4 공지 배너는 announcements 테이블이 생긴 뒤)
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { CtaSection } from "@/client/components/landing/cta-section";
import { Features } from "@/client/components/landing/features";
import { Hero } from "@/client/components/landing/hero";
import { HowItWorks } from "@/client/components/landing/how-it-works";
import { UseCases } from "@/client/components/landing/use-cases";
import styles from "@/client/components/landing/landing.module.css";
import { countLivePlans } from "@/server/store/plans";
import { adminClient } from "@/server/supabase/admin";

const TITLE = "플랜잇 — 모임을 하나의 링크로";
const DESCRIPTION = "모임 기획자를 위한 일정 공유 도구. 받는 사람은 로그인 없이 링크 하나로 열어요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", locale: "ko_KR", siteName: "플랜잇" },
};

/**
 * 숫자는 5분에 한 번만 센다. 루트 레이아웃이 테마 쿠키를 읽어 이 페이지는 요청마다
 * 렌더되므로(F-LAND-5는 루트 레이아웃 분리 후속), DB 왕복만이라도 캐시한다.
 * catch를 캐시 **바깥**에 둔다 — 안에서 잡으면 실패(null)가 5분 동안 캐시된다.
 */
const cachedLiveCount = unstable_cache(() => countLivePlans(adminClient()), ["landing-live-count"], {
  revalidate: 300,
});

async function liveCount(): Promise<number | null> {
  try {
    return await cachedLiveCount();
  } catch {
    return null; // env·DB 없는 빌드(CI는 Supabase 기동 전에 build한다)·장애 — 숫자 없이 그린다
  }
}

function Wordmark() {
  return (
    <span className="flex items-center gap-2 text-title-2 font-extrabold tracking-tight text-landing-starlight">
      <Image src="/logos/Logo_White.png" alt="" width={44} height={44} />
      플랜잇
    </span>
  );
}

export default async function Home() {
  const count = await liveCount();

  return (
    <div data-testid="landing" className={styles.root}>
      <nav className={`sticky top-0 z-50 py-4 ${styles.nav}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" aria-label="플랜잇 홈">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-7 text-label font-medium text-landing-moonlight">
            <a href="#how" className="hidden hover:text-landing-starlight md:inline">작동 방식</a>
            <a href="#cases" className="hidden hover:text-landing-starlight md:inline">예시</a>
            <Link href="/login" className={`px-4 py-2 font-semibold ${styles.navLogin}`}>로그인</Link>
          </div>
        </div>
      </nav>

      <main>
        <Hero liveCount={count} />
        <Features />
        <HowItWorks />
        <UseCases />
        <CtaSection />
      </main>

      <footer className="border-t border-landing-border pb-15 pt-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6">
          <Wordmark />
          <p className="text-label text-landing-dust">© 2026 플랜잇</p>
        </div>
      </footer>
    </div>
  );
}
