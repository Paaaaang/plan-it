"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Icon } from "@/client/components/ui/icon";

export function ButtonDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button data-testid="btn-primary">일정 만들기</Button>
        <Button variant="secondary">예시 보기</Button>
        <Button variant="ghost">취소</Button>
        <Button variant="danger">삭제</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">작게</Button>
        <Button size="md">보통</Button>
        <Button size="lg" leadingIcon={<Icon name={MapPin} size={17} />}>
          카카오맵으로 길찾기
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button data-testid="btn-loading" loading>저장 중</Button>
        <Button data-testid="btn-disabled" disabled onClick={() => setCount((c) => c + 1)}>
          비활성
        </Button>
        <Button data-testid="btn-counter" variant="secondary" onClick={() => setCount((c) => c + 1)}>
          눌러보기
        </Button>
        <span className="text-caption text-secondary">
          클릭 <b data-testid="click-count" className="tnum">{count}</b>
        </span>
      </div>
    </div>
  );
}
