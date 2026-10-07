/**
 * @file 로그인 페이지
 * @route /login
 * @spec F-AUTH-1
 */

import type { Metadata } from "next";
import { KakaoButton } from "@/client/components/auth/kakao-button";

export const metadata: Metadata = {
  title: "로그인 — 플랜잇",
  description: "플랜잇에 로그인하고 일정을 관리해요.",
};

export default async function LoginPage(props: PageProps<"/login">) {
  // app/auth/callback/route.ts가 실패하면 ?error=<사유>로 여기로 돌려보낸다. 그런데
  // 지금까지 이 페이지는 그 쿼리를 읽지 않았다 — 실패해도 로그인 화면이 아무 말 없이
  // 다시 뜨기만 했다. 사유 문자열 자체(exchange_failed 등)는 안 보여준다 — 콜백의 주석이
  // 이미 "실패 사유를 URL에 그대로 싣지 않는다"고 적어 둔 이유(공격자에게 힌트를 주지
  // 않는다)가 여기도 적용된다. 있다/없다만 본다.
  const { error } = await props.searchParams;

  return (
    <>
      <h1 className="text-center text-title-2 font-extrabold tracking-tight text-primary">
        로그인
      </h1>
      <p className="mt-2 mb-6 text-center text-label text-secondary">
        카카오 계정으로 로그인하고 일정을 관리해요
      </p>
      {error && (
        <p role="alert" className="mb-6 text-center text-label text-danger">
          로그인에 실패했어요. 다시 시도해 주세요.
        </p>
      )}
      <KakaoButton />
    </>
  );
}
