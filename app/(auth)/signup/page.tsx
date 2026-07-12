/**
 * @file 회원가입 페이지
 * @route /signup
 * @spec F-AUTH-1
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 — 플랜잇",
  description: "플랜잇에 가입하고 일정을 만들어 보세요.",
};

export default function SignupPage() {
  return (
    <>
      <h1
        style={{
          font: "var(--h3-fw) var(--h3-size)/var(--h3-lh) var(--font-sans)",
          letterSpacing: "var(--h3-ls)",
          color: "var(--text-primary)",
          marginBottom: "var(--space-2)",
          textAlign: "center",
        }}
      >
        회원가입
      </h1>
      <p
        style={{
          font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
          color: "var(--text-secondary)",
          textAlign: "center",
          marginBottom: "var(--space-6)",
        }}
      >
        계정을 만들고 일정을 공유해 보세요
      </p>
      {/* TODO: 회원가입 폼 구현 — actions/auth-actions.ts 연동 */}
    </>
  );
}
