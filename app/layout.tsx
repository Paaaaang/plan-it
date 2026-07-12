import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
