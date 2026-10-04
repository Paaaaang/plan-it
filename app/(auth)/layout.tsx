/**
 * @file 인증 페이지 공통 레이아웃
 * @description 로그인 페이지에 적용되는 레이아웃. 중앙 정렬 카드 + 로고 표시.
 *              카카오 통합 로그인이라 가입 페이지가 없다 — 로그인 한 화면뿐이다.
 *
 * 1단계에서 --surface-page·--surface-card·--border-secondary·--radius-2xl이
 * 사라졌을 때 이 파일은 손대지 않아 죽은 토큰을 그대로 들고 있었다(콘솔 레이아웃의
 * 사이드바와 같은 문제). 여기선 코드가 계속 필요해서 지우는 대신 현재 토큰으로
 * 바꿔 썼다 — bg(페이지 배경)·surface(카드 배경)·border-default·radius-dialog.
 *
 * @connects
 *  - app/(auth)/login/page.tsx
 */

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg p-6">
      <Link href="/" className="mb-8">
        <Image
          src="/logos/Logo_Black.png"
          alt="플랜잇"
          width={48}
          height={48}
          priority
        />
      </Link>
      <div className="w-full max-w-sm rounded-dialog border border-default bg-surface p-8">
        {children}
      </div>
    </div>
  );
}
