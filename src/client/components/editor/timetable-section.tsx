"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, MapPin, Plus, Trash2 } from "lucide-react";
import { BottomSheet } from "@/client/components/ui/bottom-sheet";
import { Chip } from "@/client/components/ui/chip";
import { Dialog } from "@/client/components/ui/dialog";
import { SectionShell } from "@/client/components/editor/section-shell";
import { SortableList } from "@/client/components/editor/sortable-list";
import { useEditor } from "@/client/components/editor/editor-shell";
import { useEditorAction } from "@/client/hooks/use-editor-action";
import { addItem, deleteItem, linkPlace, reorderItems, updateItem } from "@/server/actions/schedule-actions";
import type { ViewerDay, ViewerItem, ViewerPlace } from "@/shared/types/viewer";

/** 추가 버튼이 넣는 항목. 활동명이 비면 서버가 거부하므로 이름을 하나 주고 시작한다. */
const NEW_NAME = "새 일정";
/** 첫 항목의 기본 시각. 뒤에 붙일 때는 마지막 항목의 시각을 물려받는다. */
const FIRST_TIME = "09:00";

type Draft = { startTime: string; activityName: string };

/**
 * 한 줄 = 한 일정 항목. 시각·활동명이 **늘 입력**이다(공지 행과 같은 규칙 —
 * 편집기에서 이 줄은 읽을 것이 아니라 고칠 것이다).
 *
 * 시각은 `type="time"`이 아니라 텍스트다. 형식 검증은 서버(`validateTime`)가 하는데,
 * 브라우저 시각 입력은 잘못된 값을 애초에 담지 못해 **그 검증이 죽어도 화면에서 알 수 없다**
 * (공지 제목에 `maxLength`를 안 거는 것과 같은 이유). 스피너·로캘 표기도 시안과 다르다.
 */
function ItemRow({
  item,
  onSave,
  onDelete,
  onLink,
}: {
  item: ViewerItem;
  onSave: (item: ViewerItem, draft: Draft) => Promise<boolean>;
  onDelete: (item: ViewerItem) => void;
  onLink: (item: ViewerItem) => void;
}) {
  const [draft, setDraft] = useState<Draft>({ startTime: item.startTime, activityName: item.activityName });
  const saved = useRef(draft);

  const commit = async () => {
    if (draft.startTime === saved.current.startTime && draft.activityName === saved.current.activityName) return;
    if (await onSave(item, draft)) saved.current = draft;
    else setDraft(saved.current);
  };

  return (
    <>
      <input
        aria-label="시작 시간"
        value={draft.startTime}
        inputMode="numeric"
        onChange={(e) => setDraft((prev) => ({ ...prev, startTime: e.target.value }))}
        onBlur={commit}
        /* 시안 `.ttime`: 13px·800·tabular-nums, 표면 배경 + 테두리. 폭은 "10:30"에 맞춘다. */
        className="w-[52px] flex-none rounded-xs border border-default bg-surface py-1.5 text-center text-label font-extrabold tabular-nums text-primary"
      />
      <input
        aria-label="일정 이름"
        value={draft.activityName}
        onChange={(e) => setDraft((prev) => ({ ...prev, activityName: e.target.value }))}
        onBlur={commit}
        className="min-w-0 flex-1 truncate bg-transparent text-label font-semibold text-primary"
      />
      <button
        type="button"
        /*
          이름에 보이는 텍스트가 들어 있어야 한다(WCAG 2.5.3) — 미연결이면 "장소 연결",
          연결됐으면 장소 이름이 보인다. 거기에 어느 줄인지를 덧붙인다: 목록에 같은 이름의
          버튼이 여럿이면 무엇을 바꾸는지 알 수 없다.
        */
        aria-label={item.place ? `장소 바꾸기 — ${item.place.name}` : `장소 연결 — ${item.activityName}`}
        onClick={() => onLink(item)}
        /*
          시안 `.tplace`: 연결됐으면 coral-50 배경 + coral-700 글자, 미연결이면 회색 칩.
          Chip 프리미티브를 쓰지 않는다 — Chip은 선택/미선택 두 가지뿐이고 여기 필요한
          "약한 코랄"은 세 번째 모양이다. 프리미티브에 변형을 더하면 갤러리·시각 회귀까지
          따라 움직이는데, 그 값은 이 칩 하나가 쓰기엔 크다.
        */
        className={[
          "flex flex-none items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold",
          "transition-colors duration-fast ease-planit",
          item.place ? "bg-brand-weak text-on-brand-weak" : "bg-neutral-fill text-tertiary",
        ].join(" ")}
      >
        {item.place ? <MapPin size={11} strokeWidth={2.4} aria-hidden /> : <Plus size={11} strokeWidth={2.4} aria-hidden />}
        {item.place ? item.place.name : "장소 연결"}
      </button>
      <button
        type="button"
        aria-label={`삭제 — ${item.activityName}`}
        onClick={() => onDelete(item)}
        /* 히트 영역은 그립과 같은 방법으로 넓힌다(::before) — 패딩은 행 높이를 밀어 시안을 흔든다. */
        className="relative flex flex-none text-tertiary before:absolute before:-inset-1.5 hover:text-danger"
      >
        <Trash2 size={15} strokeWidth={2.2} aria-hidden />
      </button>
    </>
  );
}

/**
 * 3번 섹션 — 일차 칩 + 그 날의 항목 목록 + 장소 연결 시트.
 *
 * ## 왜 이 섹션만 자기 껍데기를 직접 그리나
 *
 * 헤더 카운트가 `1일차 · 3개`다 — **고른 일차**가 들어간다. 그건 클라이언트 상태라
 * 서버에서 그리는 페이지가 알 수 없다. 셸을 안으로 들여오는 쪽이 카운트를 위로 끌어올리는
 * 상태 배선보다 싸다(다른 섹션은 그대로 페이지가 껍데기를 그린다).
 *
 * ## 고른 일차를 상태로 두면서 이펙트를 안 쓴다
 *
 * 기간을 줄여 그 일차가 사라지면(`plan-actions.ts::syncDays`) 렌더할 때 첫 일차로 떨어진다 —
 * props가 바뀔 때 상태를 씻는 이펙트가 필요 없다(SortableList의 `ordered`와 같은 방식).
 */
export function TimetableSection({ days, places }: { days: ViewerDay[]; places: ViewerPlace[] }) {
  const { slug } = useEditor();
  const call = useEditorAction();
  const [selected, setSelected] = useState(days[0]?.dayNumber ?? 1);
  const [pending, setPending] = useState<ViewerItem | null>(null);
  const [linking, setLinking] = useState<ViewerItem | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  /** 방금 추가했다 = 새 행의 이름으로 초점을 옮겨야 한다. 아래 이펙트가 소비한다. */
  const added = useRef(false);

  const day = days.find((d) => d.dayNumber === selected) ?? days[0];
  const items = day?.items ?? [];

  const reorder = useCallback(
    (ids: string[]) =>
      day ? call(() => reorderItems(slug, day.dayNumber, ids)) : Promise.resolve(false),
    [call, slug, day],
  );

  const save = useCallback(
    (item: ViewerItem, draft: Draft) =>
      call(() =>
        updateItem(slug, item.id, {
          ...draft,
          // 이 행이 편집하지 않는 필드는 그대로 돌려보낸다 — 액션이 항목을 한 벌로 받는다.
          memo: item.memo ?? "",
          durationMin: item.durationMin,
        }),
      ),
    [call, slug],
  );

  const add = useCallback(async () => {
    if (!day) return;
    added.current = await call(() =>
      addItem(slug, day.dayNumber, {
        // 마지막 항목의 시각을 물려받는다. 하루의 끝에 붙이는 것이 보통이고, 시각이
        // 비면 서버가 거부한다 — 사용자가 고칠 값을 주는 쪽이 낫다.
        // `items`가 아니라 `day.items`를 읽는다: `items`는 날짜가 없을 때 매 렌더 새
        // 빈 배열이라 이 콜백의 정체성을 흔든다.
        startTime: day.items[day.items.length - 1]?.startTime ?? FIRST_TIME,
        activityName: NEW_NAME,
        memo: "",
        durationMin: null,
      }),
    );
  }, [call, slug, day]);

  // 모달 핸들러는 안정적이어야 한다. 인라인 화살표 함수를 넘기면 리렌더마다 Escape
  // 리스너가 재등록되어 모달 스택 순서가 흔들린다(bottom-sheet.tsx의 modalStack).
  const closeDialog = useCallback(() => setPending(null), []);
  const closeSheet = useCallback(() => setLinking(null), []);

  const confirmDelete = useCallback(async () => {
    const target = pending;
    setPending(null);
    if (target) await call(() => deleteItem(slug, target.id));
  }, [pending, call, slug]);

  const pick = useCallback(
    async (placeId: string | null) => {
      const target = linking;
      setLinking(null);
      if (target) await call(() => linkPlace(slug, target.id, placeId));
    },
    [linking, call, slug],
  );

  useEffect(() => {
    if (!added.current) return;
    added.current = false;
    rootRef.current
      ?.querySelector<HTMLInputElement>('[data-testid="item-row"]:last-of-type input[aria-label="일정 이름"]')
      ?.focus();
  }, [items.length]);

  return (
    <SectionShell
      number={3}
      title="타임테이블"
      count={day ? `${day.dayNumber}일차 · ${items.length}개` : "0개"}
    >
      <div ref={rootRef} data-testid="timetable-section">
        {/* 일차는 기간에서 파생된다 — 여기서 만들거나 지우지 않는다(1번 섹션이 기간을 갖는다). */}
        <div data-testid="editor-day-chips" className="mb-3 flex flex-wrap gap-1.5">
          {days.map((d) => (
            <Chip
              key={d.dayNumber}
              interactive
              selected={d.dayNumber === day?.dayNumber}
              onClick={() => setSelected(d.dayNumber)}
            >
              {d.dayNumber}일차
            </Chip>
          ))}
        </div>

        {items.length === 0 ? (
          <p data-testid="item-empty" className="text-caption text-tertiary">
            이 날은 아직 비어 있어요. 첫 일정을 추가해 주세요.
          </p>
        ) : (
          <SortableList
            items={items}
            labelOf={(item) => item.activityName}
            onReorder={reorder}
            rowTestId="item-row"
            renderItem={(item) => (
              <ItemRow item={item} onSave={save} onDelete={setPending} onLink={setLinking} />
            )}
          />
        )}

        <button
          type="button"
          onClick={add}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-field border-[1.5px] border-dashed border-strong px-3 py-2.5 text-label font-bold text-tertiary transition-colors duration-fast ease-planit hover:text-secondary"
        >
          <Plus size={15} strokeWidth={2.4} aria-hidden />
          일정 추가
        </button>

        <Dialog
          open={pending !== null}
          onClose={closeDialog}
          onConfirm={confirmDelete}
          title="일정을 삭제할까요?"
          description={pending ? `“${pending.activityName}”은(는) 되돌릴 수 없어요.` : undefined}
          confirmLabel="삭제"
          tone="danger"
        />

        {/*
          장소 목록은 4번 섹션의 것 그대로다(F-EDIT-TT-5). 여기서 새 장소를 만들지 않는다 —
          이름만 있고 주소가 빈 장소가 두 섹션에 동시에 생기고, 되돌릴 자리가 없다.
        */}
        <BottomSheet open={linking !== null} onClose={closeSheet} title="장소 연결">
          {places.length === 0 ? (
            <p className="mt-3 text-label text-tertiary">
              아직 등록한 장소가 없어요. 4번 장소 섹션에서 먼저 추가해 주세요.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-1.5">
              {places.map((place) => {
                const current = linking?.place?.id === place.id;
                return (
                  <li key={place.id}>
                    <button
                      type="button"
                      onClick={() => pick(current ? null : place.id)}
                      className="flex w-full items-center gap-2.5 rounded-field bg-sunken px-3 py-2.5 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-label font-bold text-primary">{place.name}</span>
                        {place.address && (
                          <span className="block truncate text-caption text-tertiary">{place.address}</span>
                        )}
                      </span>
                      {/* 지금 연결된 장소를 다시 누르면 연결을 끊는다 — 해제 버튼을 따로 두지 않는다. */}
                      {current && <Check size={15} strokeWidth={2.6} className="flex-none text-brand" aria-label="연결됨" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </BottomSheet>
      </div>
    </SectionShell>
  );
}
