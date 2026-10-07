"use client";

import { Button } from "@/client/components/ui/button";
import { Loader } from "@/client/components/ui/loader";
import { ToastProvider, useToast } from "@/client/components/ui/toast";

function Triggers() {
  const { show } = useToast();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-testid="toast-trigger" variant="secondary" onClick={() => show("주소를 복사했어요")}>
        토스트
      </Button>
      <Button
        data-testid="toast-error"
        variant="secondary"
        onClick={() => show("링크를 복사하지 못했어요. 다시 시도해 주세요.", "danger")}
      >
        오류 토스트
      </Button>
      <Loader data-testid="loader-inline" />
    </div>
  );
}

export function FeedbackDemo() {
  return (
    <ToastProvider>
      <Triggers />
    </ToastProvider>
  );
}
