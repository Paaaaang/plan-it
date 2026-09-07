"use client";

import { useCallback } from "react";
import { DateField } from "@/components/ui/date-field";
import { TextField } from "@/components/ui/text-field";
import { CoverUploader } from "@/components/editor/cover-uploader";
import { useEditor } from "@/components/editor/editor-shell";
import { setCover } from "@/actions/plan-actions";
import type { ViewerPlan } from "@/types/viewer";

/** 필드에 붙는 오류 이름들. 여기 없는 field는 섹션 단위 오류로 낸다. */
const FIELD_NAMES = new Set(["title", "startDate", "endDate", "planType", "partyLabel"]);

/**
 * 1번 섹션 — 커버(전폭) → 제목(전폭) → 시작일 | 종료일 → 유형 | 인원.
 *
 * 편집 상태는 여기 있지 않다. 상단 바의 제목 입력과 한 벌을 공유한다(editor-shell.tsx).
 *
 * 오류는 **그 필드에** 붙인다 — 다섯 개 중 어느 것이 틀렸는지 보여야 하기 때문이다.
 * `ActionResult.field`가 그 연결이고, `TextField`·`DateField`가 `aria-invalid`와
 * `aria-describedby` 배선을 이미 갖고 있다. 기간 축소 거부처럼 한 필드로 좁힐 수 없는
 * 오류(시작일을 밀어도 꼬리가 잘린다)만 섹션 아래 한 줄로 낸다.
 */
export function BasicInfoSection({ plan }: { plan: ViewerPlan }) {
  const { slug, basics, edit, commit, save, run } = useEditor();

  const upload = useCallback(
    async (file: File) => {
      const form = new FormData();
      form.set("file", file);
      return run(() => setCover(slug, form));
    },
    [slug, run],
  );

  const error = save.kind === "error" ? save : null;
  const err = (field: string) => (error?.field === field ? error.message : undefined);

  return (
    <div data-testid="basic-info" className="flex flex-col gap-2.5">
      <CoverUploader
        initialUrl={plan.coverImageUrl}
        error={err("coverImageUrl")}
        onPick={upload}
      />

      <div className="grid grid-cols-2 gap-2.5">
        <div className="col-span-2">
          <TextField
            label="제목"
            value={basics.title}
            error={err("title")}
            maxLength={60}
            onChange={(e) => edit({ title: e.target.value })}
            onBlur={commit}
          />
        </div>
        <DateField
          label="시작일"
          value={basics.startDate}
          error={err("startDate")}
          onChange={(e) => edit({ startDate: e.target.value })}
          onBlur={commit}
        />
        <DateField
          label="종료일"
          value={basics.endDate}
          error={err("endDate")}
          onChange={(e) => edit({ endDate: e.target.value })}
          onBlur={commit}
        />
        <TextField
          label="유형"
          value={basics.planType}
          error={err("planType")}
          maxLength={20}
          onChange={(e) => edit({ planType: e.target.value })}
          onBlur={commit}
        />
        <TextField
          label="인원"
          value={basics.partyLabel}
          error={err("partyLabel")}
          maxLength={40}
          placeholder="디자인팀 12명"
          onChange={(e) => edit({ partyLabel: e.target.value })}
          onBlur={commit}
        />
      </div>

      {error && !FIELD_NAMES.has(error.field ?? "") && error.field !== "coverImageUrl" && (
        <p role="alert" className="text-caption font-semibold text-danger">
          {error.message}
        </p>
      )}
    </div>
  );
}
