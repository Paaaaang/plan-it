/**
 * @file 뷰어의 막다른 길 화면 — 비밀번호 게이트 · 만료 · 오류가 공유하는 껍데기
 * @spec §5.1 — 빨강을 쓰지 않는다. 링크 만료도 비공개도 사용자 잘못이 아니다.
 *              회색 글리프 + 해요체 안내 + 나갈 길 하나.
 *
 * @connects
 *  - src/client/components/ui/icon.tsx             → 글리프
 *  - src/client/components/viewer/password-gate.tsx, app/p/[slug]/page.tsx → 호출부
 */

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@/client/components/ui/icon";

export function StatusScreen({
  glyph,
  title,
  description,
  children,
}: {
  glyph: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    // 높이는 부모가 준다(app/p/layout.tsx) — 뷰어 셸과 같은 이유다.
    <main className="mx-auto flex w-full grow max-w-[480px] flex-col items-center justify-center gap-3 bg-bg px-8 text-center">
      {/*
        Icon은 data-testid를 통과시키지 않는다(프리미티브는 건드리지 않는다).
        span으로 감싸되 **색을 span에** 둔다 — 글리프는 currentColor로 그려지므로
        테스트가 읽는 색과 실제로 칠해진 색이 같다.
      */}
      <span data-testid="status-glyph" className="text-tertiary">
        <Icon name={glyph} size={40} strokeWidth={1.6} />
      </span>
      <h1 className="text-title-2 font-extrabold tracking-tight text-primary">{title}</h1>
      <p className="text-label text-secondary">{description}</p>
      {children}
    </main>
  );
}
