/**
 * @file 로그인 페이지
 * @route /login
 * @spec F-AUTH-1
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 — 플랜잇",
  description: "플랜잇에 로그인하고 일정을 관리해요.",
};

export default function LoginPage() {
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
        로그인
      </h1>
      <p
        style={{
          font: "var(--body-2-fw) var(--body-2-size)/var(--body-2-lh) var(--font-sans)",
          color: "var(--text-secondary)",
          textAlign: "center",
          marginBottom: "var(--space-6)",
        }}
      >
        이메일과 비밀번호를 입력해 주세요
      </p>
      {/* TODO: 로그인 폼 구현 — actions/auth-actions.ts 연동 */}
    </>
  );
}
