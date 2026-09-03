import type { Metadata } from "next";
import { getTheme } from "@/lib/theme";
import "./globals.css";

/**
 * metadataBase가 없으면 상대 경로 OG 이미지가 요청 호스트로 절대화된다 —
 * 빌드/렌더 환경에 따라 `http://localhost:3000/...`이 그대로 공유 미리보기로 나간다.
 * 링크 공유가 제품의 전부라 카톡 미리보기가 통째로 깨진다.
 *
 * 우선순위: 직접 설정한 도메인 > Vercel이 주는 배포 도메인 > 개발 폴백.
 * VERCEL_URL은 스킴이 없다(`my-app.vercel.app`) — https를 붙여야 URL로 파싱된다.
 */
const DEV_FALLBACK_SITE_URL = "http://localhost:3000"; // 개발 전용. 프로덕션에서 이 값이 쓰이면 미리보기가 깨진다.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : DEV_FALLBACK_SITE_URL);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "플랜잇 — 일정을 만들고, 링크로 공유해요",
  description:
    "여행·행사·모임의 일정을 컴포넌트 단위로 조립하고, 고유 링크 하나로 공유하는 웹 앱. 참가자는 로그인 없이 바로 열어볼 수 있어요.",
  openGraph: {
    title: "플랜잇 — 일정을 만들고, 링크로 공유해요",
    description:
      "여행·행사·모임의 일정을 하나의 구조화된 페이지로 빠르게 만들고, 링크 하나로 쉽게 공유·열람.",
    type: "website",
    locale: "ko_KR",
    siteName: "플랜잇",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();

  return (
    // theme이 "system"이면 속성을 아예 붙이지 않는다.
    // 붙이지 않아야 prefers-color-scheme이 결정권을 갖는다.
    <html lang="ko" data-theme={theme === "system" ? undefined : theme}>
      <body>{children}</body>
    </html>
  );
}
