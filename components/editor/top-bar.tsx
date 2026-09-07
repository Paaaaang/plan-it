"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Link as LinkIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useToast } from "@/components/ui/toast";
import { useNow } from "@/hooks/use-now";
import { type SaveState } from "@/hooks/use-editor-plan";
import { useEditor } from "@/components/editor/editor-shell";
import { setStatus } from "@/actions/plan-actions";
import type { PlanStatus } from "@/types/editor";

const STATUS_ITEMS = [
  { value: "draft", label: "임시저장" },
  { value: "public", label: "공개" },
  { value: "private", label: "비공개" },
];

/**
 * 저장 시각을 상대 표기로. **클라이언트에서만 부른다** — 서버가 "방금"을 계산하면
 * 하이드레이션 불일치가 난다. `now`는 useNow가 마운트 후에 주는 값이고, 그 전에는
 * 방금 저장한 직후이므로 "방금"이 맞다.
 */
function ago(at: number, now: Date | null): string {
  const min = Math.floor(((now?.getTime() ?? at) - at) / 60_000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  return `${Math.floor(min / 60)}시간 전`;
}

/** 점 색과 문구. 오류는 색만으로 말하지 않는다 — 이유를 그대로 쓴다. */
function saveLabel(save: SaveState, now: Date | null): { dot: string; text: string } {
  switch (save.kind) {
    case "saving":
      return { dot: "bg-tertiary", text: "저장 중…" };
    case "saved":
      return { dot: "bg-success", text: `저장됨 · ${ago(save.at, now)}` };
    case "error":
      return { dot: "bg-danger", text: save.message };
    default:
      return { dot: "bg-tertiary", text: "변경 없음" };
  }
}

export function TopBar({ slug, status: initialStatus }: { slug: string; status: PlanStatus }) {
  // 제목은 1번 섹션의 제목 필드와 **같은 상태**를 본다. 각자 스냅샷을 들면 나중에
  // 저장한 쪽이 먼저 저장한 값을 되돌린다 — 근거는 editor-shell.tsx에 적어 뒀다.
  const { basics, edit, commit, save, run } = useEditor();
  const { show } = useToast();
  const now = useNow();
  // 낙관적 상태. 세그먼트는 컨트롤드라 여기서 바로 옮기지 않으면 키 조작이 서버 왕복만큼 밀린다.
  const [status, setLocalStatus] = useState<PlanStatus>(initialStatus);

  const path = `/p/${slug}`;

  const changeStatus = useCallback(
    async (next: string) => {
      const prev = status;
      setLocalStatus(next as PlanStatus);
      const ok = await run(() => setStatus(slug, next));
      if (!ok) setLocalStatus(prev);
    },
    [status, slug, run],
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      show("링크를 복사했어요");
    } catch {
      // 클립보드가 막힌 브라우저도 있다. 주소는 화면에 그대로 보인다.
      show("링크를 복사하지 못했어요", "danger");
    }
  }, [path, show]);

  const { dot, text } = saveLabel(save, now);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-default bg-surface px-4">
      <span aria-hidden className="h-6 w-6 shrink-0 rounded-xs bg-brand" />

      <Link
        href="/dashboard"
        className="border-r border-default pr-3 text-caption font-semibold text-tertiary transition-colors duration-fast ease-planit hover:text-primary"
      >
        대시보드
      </Link>

      {/*
        제목은 인라인 편집 input이다. field-sizing-content로 폭이 글자 수를 따라가
        시안처럼 연필이 제목에 붙는다 — 지원하지 않는 브라우저에서는 기본 폭으로
        떨어질 뿐 배선은 그대로다.
      */}
      <span className="flex min-w-0 items-center gap-1.5">
        <input
          aria-label="일정 제목"
          value={basics.title}
          onChange={(e) => edit({ title: e.target.value })}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="max-w-96 min-w-24 rounded-xs bg-transparent px-1 text-item-title font-bold tracking-tight text-primary field-sizing-content focus:outline-none focus:ring-[3px] focus:ring-accent-ring"
        />
        <Icon name={Pencil} size={13} className="shrink-0 text-tertiary" />
      </span>

      <span
        role={save.kind === "error" ? "alert" : "status"}
        data-testid="save-status"
        className={`flex shrink-0 items-center gap-1.5 text-caption font-medium ${save.kind === "error" ? "text-danger" : "text-tertiary"}`}
      >
        <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {text}
      </span>

      <span className="flex-1" />

      <SegmentedControl
        label="공개 상태"
        items={STATUS_ITEMS}
        value={status}
        onChange={changeStatus}
      />

      <button
        type="button"
        onClick={copyLink}
        className="flex items-center gap-1.5 rounded-control bg-neutral-fill px-3 py-2 text-caption font-semibold text-secondary tabular-nums transition-colors duration-fast ease-planit hover:text-primary"
      >
        <Icon name={LinkIcon} size={14} />
        <span className="sr-only">공유 링크 복사 </span>
        {path}
      </button>

      <Button variant="primary" size="sm" onClick={copyLink}>
        공유하기
      </Button>
    </header>
  );
}
