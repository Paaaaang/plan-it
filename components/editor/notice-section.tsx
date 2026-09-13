"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { SortableList } from "@/components/editor/sortable-list";
import { useEditor } from "@/components/editor/editor-shell";
import { useEditorAction } from "@/hooks/use-editor-action";
import { addNotice, deleteNotice, reorderNotices, updateNotice } from "@/actions/notice-actions";
import type { ViewerNotice } from "@/types/viewer";

/** 추가 버튼이 넣는 공지. 제목이 비면 서버가 거부하므로(검증) 이름을 하나 주고 시작한다. */
const NEW_TITLE = "새 공지";

/**
 * 한 줄 = 한 공지. 제목·내용이 **늘 입력**이다(클릭해서 편집 모드로 들어가지 않는다).
 *
 * 왜 토글이 없나: 편집기에서 이 줄은 읽을 것이 아니라 고칠 것이다. 토글을 두면 상태와
 * "편집" 버튼이 늘고, 키보드로는 버튼 → 입력 두 걸음이 된다. 배경 없는 입력은 시안의
 * 텍스트와 같은 그림이면서 탭 한 번으로 고칠 수 있다.
 *
 * 값은 로컬에 둔다. 저장은 blur에 한 번. 서버가 거부하면 **마지막 저장 값으로 되돌린다** —
 * 저장 안 된 값을 화면에 남기면 다음 저장이 사용자가 본 적 없는 값을 밀어 넣는다
 * (기본 정보 섹션과 같은 규칙, editor-shell.tsx::commit).
 */
function NoticeRow({
  notice,
  onSave,
  onDelete,
}: {
  notice: ViewerNotice;
  onSave: (id: string, input: { title: string; body: string }) => Promise<boolean>;
  onDelete: (notice: ViewerNotice) => void;
}) {
  const [draft, setDraft] = useState({ title: notice.title, body: notice.body });
  const saved = useRef(draft);

  const commit = async () => {
    if (draft.title === saved.current.title && draft.body === saved.current.body) return;
    if (await onSave(notice.id, draft)) saved.current = draft;
    else setDraft(saved.current);
  };

  // 시안(`.nrow h5`/`p`)은 13px·12px이다. `text-micro`(11px)는 대문자 라벨용이라
  // 트래킹 .06em이 붙어 있어 한글 본문에 쓰면 자간이 벌어진다 — 본문에는 안 쓴다.
  const shared = "w-full truncate bg-transparent";

  return (
    <>
      <div className="min-w-0 flex-1">
        <input
          aria-label="공지 제목"
          value={draft.title}
          /* maxLength를 걸지 않는다 — 길이는 서버가 본다(validateTitle). 클라이언트에서
             잘라 버리면 그 검증이 죽어도 화면에서 알 수 없다. */
          onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
          onBlur={commit}
          className={`${shared} text-label font-bold text-primary`}
        />
        <input
          aria-label="공지 내용"
          value={draft.body}
          placeholder="참가자에게 알릴 내용"
          onChange={(e) => setDraft((prev) => ({ ...prev, body: e.target.value }))}
          onBlur={commit}
          className={`${shared} text-caption text-tertiary placeholder:text-tertiary`}
        />
      </div>
      <button
        type="button"
        /* 이름에 어느 공지인지가 들어간다 — 목록에 "삭제"만 여럿이면 무엇을 지우는지 모른다. */
        aria-label={`삭제 — ${notice.title}`}
        onClick={() => onDelete(notice)}
        /* 히트 영역은 그립과 같은 방법으로 넓힌다(::before) — 패딩은 행 높이를 밀어 시안을 흔든다. */
        className="relative flex flex-none text-tertiary before:absolute before:-inset-1.5 hover:text-danger"
      >
        <Trash2 size={15} strokeWidth={2.2} aria-hidden />
      </button>
    </>
  );
}

/**
 * 2번 섹션 — 공지 목록 + 인라인 편집 + 추가 + 삭제.
 *
 * 추가·삭제는 **낙관적으로 하지 않는다.** 서버가 목록의 진실이고, 액션이 끝나면 RSC가 새
 * props를 내려준다(섹션 헤더의 개수도 그 값이다). 낙관적으로 세면 화면의 개수와 서버의
 * 개수가 갈라질 수 있는데, 그걸 막느라 붙일 상태가 순서 변경보다 크다.
 * 순서 변경만 낙관적이다 — 거기서는 끌어 놓은 결과가 즉시 보여야 하기 때문이다.
 *
 * 실패 사유는 토스트로 낸다. 저장 상태(상단 바)에도 같은 문구가 뜨지만, 눈은 방금 만진
 * 행에 가 있다.
 */
export function NoticeSection({ notices }: { notices: ViewerNotice[] }) {
  const { slug } = useEditor();
  const call = useEditorAction();
  const [pending, setPending] = useState<ViewerNotice | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  /** 방금 추가했다 = 새 행의 제목으로 초점을 옮겨야 한다. 아래 이펙트가 소비한다. */
  const added = useRef(false);

  const reorder = useCallback(
    (ids: string[]) => call(() => reorderNotices(slug, ids)),
    [call, slug],
  );

  const save = useCallback(
    (id: string, input: { title: string; body: string }) => call(() => updateNotice(slug, id, input)),
    [call, slug],
  );

  const add = useCallback(async () => {
    added.current = await call(() => addNotice(slug, { title: NEW_TITLE, body: "" }));
  }, [call, slug]);

  // 모달 핸들러는 안정적이어야 한다. 인라인 화살표 함수를 onClose로 넘기면 리렌더마다
  // Dialog의 escape 리스너가 재등록되어 모달 스택 순서가 흔들린다.
  const closeDialog = useCallback(() => setPending(null), []);

  const confirmDelete = useCallback(async () => {
    const target = pending;
    // 먼저 닫는다. 실패하면 토스트가 이유를 말한다 — 다이얼로그를 붙잡아 둘 이유가 없다.
    setPending(null);
    if (target) await call(() => deleteNotice(slug, target.id));
  }, [pending, call, slug]);

  /**
   * 추가한 행의 제목으로 초점을 옮긴다. 이름이 "새 공지"인 채로 두라는 화면이 아니고,
   * 추가 버튼은 목록 **아래**에 있어 키보드 사용자는 역방향으로 되짚어 올라와야 한다.
   * 서버 응답이 화면에 붙은 뒤여야 하므로 개수 변화를 기다린다(액션 promise보다 늦다).
   */
  useEffect(() => {
    if (!added.current) return;
    added.current = false;
    rootRef.current
      ?.querySelector<HTMLInputElement>('[data-testid="notice-row"]:last-of-type input')
      ?.focus();
  }, [notices.length]);

  return (
    <div ref={rootRef} data-testid="notice-section">
      {notices.length === 0 ? (
        <p data-testid="notice-empty" className="text-caption text-tertiary">
          아직 공지가 없어요. 집결 시간이나 준비물처럼 꼭 알려야 할 것을 적어 주세요.
        </p>
      ) : (
        <SortableList
          items={notices}
          labelOf={(notice) => notice.title}
          onReorder={reorder}
          rowTestId="notice-row"
          renderItem={(notice) => (
            <NoticeRow notice={notice} onSave={save} onDelete={setPending} />
          )}
        />
      )}

      <button
        type="button"
        onClick={add}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-field border-[1.5px] border-dashed border-strong px-3 py-2.5 text-label font-bold text-tertiary transition-colors duration-fast ease-planit hover:text-secondary"
      >
        <Plus size={15} strokeWidth={2.4} aria-hidden />
        공지 추가
      </button>

      {/* 삭제는 되돌릴 수 없다 — 확인을 받는다. 목록 전체에 다이얼로그는 하나면 된다. */}
      <Dialog
        open={pending !== null}
        onClose={closeDialog}
        onConfirm={confirmDelete}
        title="공지를 삭제할까요?"
        description={pending ? `“${pending.title}”은(는) 되돌릴 수 없어요.` : undefined}
        confirmLabel="삭제"
        tone="danger"
      />
    </div>
  );
}
