"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { Dialog } from "@/components/ui/dialog";
import { useEditor } from "@/components/editor/editor-shell";
import { useEditorAction } from "@/hooks/use-editor-action";
import { addPlace, deletePlace, togglePin, updatePlace } from "@/actions/place-actions";
import type { ViewerDay, ViewerPlace } from "@/types/viewer";

/** 추가 버튼이 넣는 장소. 이름이 비면 서버가 거부하므로 이름을 하나 주고 시작한다. */
const NEW_NAME = "새 장소";

type Draft = { name: string; address: string };

/**
 * 한 줄 = 한 장소. 이름·주소가 **늘 입력**이고, 고정 여부는 칩 토글이다.
 *
 * 좌표는 편집하지 않는다 — 지오코딩이 붙기 전이라 사용자가 넣을 수 있는 값이 아니다
 * (액션도 기존 lat/lng를 지킨다, place-actions.ts).
 */
function PlaceRow({
  place,
  onSave,
  onTogglePin,
  onDelete,
}: {
  place: ViewerPlace;
  onSave: (place: ViewerPlace, draft: Draft) => Promise<boolean>;
  onTogglePin: (place: ViewerPlace) => void;
  onDelete: (place: ViewerPlace) => void;
}) {
  const [draft, setDraft] = useState<Draft>({ name: place.name, address: place.address });
  const saved = useRef(draft);

  const commit = async () => {
    if (draft.name === saved.current.name && draft.address === saved.current.address) return;
    if (await onSave(place, draft)) saved.current = draft;
    else setDraft(saved.current);
  };

  const shared = "w-full truncate bg-transparent";

  return (
    <li
      data-testid="place-row"
      className="flex items-center gap-2.5 rounded-field bg-sunken px-2.5 py-2.5"
    >
      <div className="min-w-0 flex-1">
        <input
          aria-label="장소 이름"
          value={draft.name}
          onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
          onBlur={commit}
          className={`${shared} text-label font-bold text-primary`}
        />
        <input
          aria-label="장소 주소"
          value={draft.address}
          placeholder="주소"
          onChange={(e) => setDraft((prev) => ({ ...prev, address: e.target.value }))}
          onBlur={commit}
          className={`${shared} text-caption text-tertiary placeholder:text-tertiary`}
        />
      </div>
      {/*
        시안에 고정 토글의 모양이 없다. 새 프리미티브를 만들지 않고 Chip을 누른 상태로 쓴다 —
        선택형 Chip이 이미 `aria-pressed`로 상태를 알리고(chip.tsx), 켜졌을 때 코랄로 차는
        모양이 "고정됨"에 그대로 맞는다. 이름에 보이는 텍스트("고정")가 들어 있어야 한다(WCAG 2.5.3).
      */}
      <Chip
        interactive
        selected={place.isPinned}
        aria-label={`고정 — ${place.name}`}
        onClick={() => onTogglePin(place)}
        className="flex-none"
      >
        고정
      </Chip>
      <button
        type="button"
        aria-label={`삭제 — ${place.name}`}
        onClick={() => onDelete(place)}
        className="relative flex flex-none text-tertiary before:absolute before:-inset-1.5 hover:text-danger"
      >
        <Trash2 size={15} strokeWidth={2.2} aria-hidden />
      </button>
    </li>
  );
}

/**
 * 4번 섹션 — 장소 목록 + 인라인 편집 + 고정 토글 + 추가 + 삭제.
 *
 * ## 왜 드래그 정렬이 없나
 *
 * 이 목록의 순서는 사람이 정하는 값이 아니다: **고정 장소가 위**로 오고(F-EDIT-PLACE-2),
 * 나머지는 타임테이블 연결 순서대로 뷰어가 그린다(F-EDIT-PLACE-3). 그래서 순서를 저장할
 * 액션도 없다(place-actions.ts). 그립을 달면 끌 수는 있는데 아무것도 남지 않는다.
 *
 * 정렬은 렌더에서만 한다 — 배열 `sort`는 ES2019부터 안정적이라 고정끼리의 상대 순서는
 * 스토어 순서 그대로다(픽스처 순서가 흔들리지 않는다).
 */
export function PlaceSection({ places, days }: { places: ViewerPlace[]; days: ViewerDay[] }) {
  const { slug } = useEditor();
  const call = useEditorAction();
  const [pending, setPending] = useState<ViewerPlace | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const added = useRef(false);

  const ordered = [...places].sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  const save = useCallback(
    (place: ViewerPlace, draft: Draft) =>
      call(() =>
        updatePlace(slug, place.id, {
          ...draft,
          // 이 행이 편집하지 않는 필드는 그대로 돌려보낸다 — 액션이 장소를 한 벌로 받는다.
          memo: place.memo ?? "",
          tags: place.tags,
          isPinned: place.isPinned,
        }),
      ),
    [call, slug],
  );

  const pin = useCallback(
    (place: ViewerPlace) => call(() => togglePin(slug, place.id)),
    [call, slug],
  );

  const add = useCallback(async () => {
    added.current = await call(() =>
      addPlace(slug, { name: NEW_NAME, address: "", memo: "", tags: [], isPinned: false }),
    );
  }, [call, slug]);

  const closeDialog = useCallback(() => setPending(null), []);

  const confirmDelete = useCallback(async () => {
    const target = pending;
    setPending(null);
    if (target) await call(() => deletePlace(slug, target.id));
  }, [pending, call, slug]);

  useEffect(() => {
    if (!added.current) return;
    added.current = false;
    rootRef.current
      ?.querySelector<HTMLInputElement>('[data-testid="place-row"]:last-of-type input')
      ?.focus();
  }, [places.length]);

  /** 이 장소를 쓰는 항목 수. 지우면 그만큼의 연결이 끊긴다(F-EDIT-PLACE-5). */
  const linkedCount = (id: string) =>
    days.reduce((n, d) => n + d.items.filter((item) => item.place?.id === id).length, 0);

  const links = pending ? linkedCount(pending.id) : 0;

  return (
    <div ref={rootRef} data-testid="place-section">
      {places.length === 0 ? (
        <p data-testid="place-empty" className="text-caption text-tertiary">
          아직 장소가 없어요. 집결 장소나 숙소처럼 참가자가 찾아갈 곳을 등록해 주세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ordered.map((place) => (
            <PlaceRow
              key={place.id}
              place={place}
              onSave={save}
              onTogglePin={pin}
              onDelete={setPending}
            />
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={add}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-field border-[1.5px] border-dashed border-strong px-3 py-2.5 text-label font-bold text-tertiary transition-colors duration-fast ease-planit hover:text-secondary"
      >
        <Plus size={15} strokeWidth={2.4} aria-hidden />
        장소 추가
      </button>

      {/*
        삭제는 되돌릴 수 없고, 이 삭제는 **이 섹션 밖도 바꾼다** — 타임테이블 항목의 연결이
        끊긴다. 몇 개가 끊기는지 말하지 않으면 사용자는 3번 섹션을 확인하고 나서야 안다.
      */}
      <Dialog
        open={pending !== null}
        onClose={closeDialog}
        onConfirm={confirmDelete}
        title="장소를 삭제할까요?"
        description={
          pending
            ? links > 0
              ? `“${pending.name}”을(를) 지우면 일정 ${links}개의 장소 연결이 끊겨요. 되돌릴 수 없어요.`
              : `“${pending.name}”은(는) 되돌릴 수 없어요.`
            : undefined
        }
        confirmLabel="삭제"
        tone="danger"
      />
    </div>
  );
}
