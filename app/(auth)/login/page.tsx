/**
 * @file 로그인 페이지
 * @route /login
 * @spec F-AUTH-1
 */

import type { Metadata } from "next";
import { KakaoButton } from "@/components/auth/kakao-button";

export const metadata: Metadata = {
  title: "로그인 — 플랜잇",
  description: "플랜잇에 로그인하고 일정을 관리해요.",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-center text-title-2 font-extrabold tracking-tight text-primary">
        로그인
      </h1>
      <p className="mt-2 mb-6 text-center text-label text-secondary">
        카카오 계정으로 로그인하고 일정을 관리해요
      </p>
      <KakaoButton />
    </>
  );
}
