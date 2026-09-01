"use client";

import { TextField } from "@/components/ui/text-field";
import { DateField } from "@/components/ui/date-field";

export function FormDemo() {
  return (
    <div className="grid max-w-xl grid-cols-2 gap-4">
      <div className="col-span-2">
        <TextField label="일정 제목" placeholder="제주 워크샵 2026" />
      </div>
      <div className="col-span-2" data-testid="field-error">
        <TextField label="공개 제목" error="제목을 입력해 주세요" defaultValue="" />
      </div>
      <div className="col-span-2">
        <TextField label="메모" multiline hint="참가자에게 보여요" />
      </div>
      <DateField label="시작일" />
      <DateField label="종료일" />
    </div>
  );
}
