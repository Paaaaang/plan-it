"use client";

/**
 * @file 비공개 비밀번호 입력 게이트
 * @spec F-VIEW-1 (private: 암호 통과 후 열람) · §5.1 (빨강 금지 · 남은 시도 미리 안내)
 *
 * 검증은 전부 서버(actions/viewer-actions.ts::verifyPassword)에서 한다.
 * 여기서는 값을 넘기고 결과만 그린다 — 이 컴포넌트는 해시도 비밀도 모른다.
 *
 * @connects
 *  - actions/viewer-actions.ts          → verifyPassword (서버 검증 + httpOnly 쿠키 발급)
 *  - components/viewer/status-screen.tsx → 껍데기
 */

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { verifyPassword } from "@/actions/viewer-actions";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { StatusScreen } from "@/components/viewer/status-screen";

export function PasswordGate({ slug, maxAttempts }: { slug: string; maxAttempts: number }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(maxAttempts);
  const [pending, setPending] = useState(false);
  // 하이드레이션 전까지 제출 버튼을 잠근다. onSubmit이 아직 안 붙은 상태에서 누르면
  // 브라우저가 네이티브 GET으로 제출해 **비밀번호가 URL 쿼리에 실린다**(로그·리퍼러에 남는다).
  // useSyncExternalStore가 React가 주는 "서버/하이드레이션 전=false, 클라이언트=true" 신호다.
  // (입력값은 비제어라 하이드레이션 전에 타이핑해도 사라지지 않는다.)
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = String(new FormData(form).get("password") ?? "");
    setPending(true);
    const res = await verifyPassword(slug, password);
    setPending(false);
    if (res.ok) {
      // 쿠키가 붙었다. 다시 그리면 서버가 스스로 잠금 해제를 판정한다.
      router.refresh();
      return;
    }
    setRemaining(res.remaining);
    form.reset();
  }

  const locked = remaining <= 0;

  return (
    <StatusScreen
      glyph={Lock}
      title="비밀번호가 필요한 일정이에요"
      description={
        locked
          ? "시도 횟수를 다 썼어요. 잠시 뒤에 다시 열어주세요."
          : `공유받은 비밀번호를 넣어주세요. ${remaining}번 더 시도할 수 있어요.`
      }
    >
      <form onSubmit={submit} className="mt-2 flex w-full max-w-[280px] flex-col gap-2.5 text-left">
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          required
          maxLength={64}
          disabled={locked}
        />
        <Button type="submit" block loading={pending} disabled={!ready || locked}>
          확인
        </Button>
      </form>
    </StatusScreen>
  );
}

/** 절대 변하지 않는 스토어 — useSyncExternalStore를 하이드레이션 감지로만 쓴다. */
const subscribeNever = () => () => {};
