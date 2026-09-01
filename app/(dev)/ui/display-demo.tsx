"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";

export function DisplayDemo() {
  const [day, setDay] = useState(1);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
        <Card data-testid="card-flat">
          <div className="text-item-title font-bold">제주공항 집결</div>
          <div className="mt-1 text-caption text-tertiary">제주국제공항</div>
        </Card>
        <Card data-testid="card-interactive" interactive elevated onClick={() => {}}>
          <div className="text-item-title font-bold">눌리는 카드</div>
          <div className="mt-1 text-caption text-tertiary">Enter나 Space로도 눌려요</div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="neutral">임시저장</Badge>
        <Badge tone="brand">공개</Badge>
        <Badge tone="success">해결됨</Badge>
        <Badge tone="warning">검토 대기</Badge>
        <Badge tone="danger" data-testid="badge-danger">숨김</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip data-testid="chip-day1" interactive selected={day === 1} onClick={() => setDay(1)}>1일차</Chip>
        <Chip data-testid="chip-day2" interactive selected={day === 2} onClick={() => setDay(2)}>2일차</Chip>
        <Chip data-testid="chip-day3" interactive selected={day === 3} onClick={() => setDay(3)}>3일차</Chip>
        <Chip data-testid="chip-info">숙소</Chip>
      </div>
    </div>
  );
}
