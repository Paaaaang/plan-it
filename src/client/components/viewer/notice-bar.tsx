/**
 * @file 뷰어 공지 바
 * @description 접힌 상태는 📢 공지 + 요약 한 줄, 누르면 같은 덩어리 안에서 높이가 자라며
 *              목록이 펼쳐진다. 경고가 아니라 알림판이라 코랄 약색 대신 하늘빛(--notice-*)을 쓴다
 *              (랜딩 명세 §8-1, 사용자: "경고문 같이 생겨서 거부감"). 공지가 0개면 그리지 않는다.
 *              open을 주면 바깥(랜딩 스크롤 이야기)이 제어한다. 안 주면 스스로 상태를 갖는다.
 *
 * @connects
 *  - src/shared/viewer/summary.ts  → noticeSummary
 *  - src/shared/types/viewer.ts        → ViewerNotice
 *  - src/client/components/ui/icon.tsx → 아이콘 렌더링
 *  - src/client/components/landing/viewer-preview.tsx → 랜딩 폰(제어 모드)
 */

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Icon } from "@/client/components/ui/icon";
import { noticeSummary } from "@/shared/viewer/summary";
import type { ViewerNotice } from "@/shared/types/viewer";

export function NoticeBar({
  notices,
  open: openProp,
  onOpenChange,
}: {
  notices: ViewerNotice[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  if (notices.length === 0) return null;

  function toggle() {
    setOpenState(!open);
    onOpenChange?.(!open);
  }

  return (
    <section
      className="mx-5 mt-3 rounded-pop border border-notice-border bg-notice"
      data-testid="notice-bar"
      data-open={open}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        // 접근 가능한 이름을 고정한다. 안 그러면 펼치는 순간 이름이 요약 문구로 통째로 바뀌어,
        // 스크린리더에는 방금 누른 버튼이 다른 버튼으로 바뀐 것처럼 들린다.
        aria-label={`공지 ${notices.length}개`}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <span aria-hidden="true" className="flex-none text-label leading-none">📢</span>
        <span className="flex-none text-label font-extrabold text-notice-label">공지</span>
        <span className="min-w-0 flex-1 truncate text-label text-secondary">{noticeSummary(notices)}</span>
        <Icon
          name={ChevronDown}
          size={15}
          strokeWidth={2.4}
          className={[
            "flex-none text-tertiary transition-transform duration-slow ease-planit",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {/* 높이를 0fr→1fr로 키운다 — display 토글은 자라는 모습을 못 보여 준다.
          접혀 있을 땐 inert + aria-hidden: 보이지 않는 목록이 탭 순서·스크린리더에 남지 않게 */}
      <div
        className={[
          "grid transition-[grid-template-rows] duration-slow ease-planit",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        ].join(" ")}
        inert={!open}
        aria-hidden={!open}
      >
        <ul className="min-h-0 overflow-hidden px-3">
          {notices.map((n, i) => (
            <li
              key={n.id}
              className={["flex gap-2.5 py-2", i > 0 ? "border-t border-notice-border" : "", i === notices.length - 1 ? "mb-1" : ""].join(" ")}
            >
              {/* 제목 칸은 폭의 45%까지만 — 한 줄 너비를 다 가지면 긴 제목(최대 60자)이 본문을 짓누르거나
                  목록(overflow-hidden) 밖으로 밀려 잘린다. 집결·준비물 같은 짧은 라벨(시안의 13자 제목까지)은
                  그대로 한 줄. 넘치면 띄어쓰기에서 줄을 바꾸고(keep-all), 띄어쓰기 없는 긴 낱말만 글자 사이에서 끊는다 */}
              <h2 className="min-w-10 max-w-[45%] shrink-0 break-keep wrap-break-word text-label font-bold text-tertiary">{n.title}</h2>
              <p className="text-label text-primary">{n.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
