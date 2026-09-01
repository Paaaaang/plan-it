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
      <div className="col-span-2" data-testid="field-error-caller-described-by">
        {/*
          aria-describedby는 TextField의 Props 타입에서 Omit돼 있어 타입이 있는 caller는
          애초에 넘길 수 없다 — 이건 의도된 컴파일 타임 방어다. 그래도 스프레드 등으로 타입을
          우회해 런타임에 넘어오는 경우(rest 방어)까지 살아있는지 확인하려고 여기서만 캐스팅한다.
        */}
        <TextField
          label="공개 제목 (caller aria-describedby)"
          error="제목을 입력해 주세요"
          defaultValue=""
          {...({ "aria-describedby": "caller-supplied-id" } as Record<string, string>)}
        />
      </div>
      <div className="col-span-2">
        <TextField label="메모" multiline hint="참가자에게 보여요" />
      </div>
      <DateField label="시작일" />
      <DateField label="종료일" />
    </div>
  );
}
