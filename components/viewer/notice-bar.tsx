/**
 * @file 뷰어 공지 바
 * @description 접힌 상태에선 공지 요약 한 줄, 탭하면 한 덩어리 안에서 목록으로
 *              펼쳐지는 disclosure. 공지가 0개면 아무것도 렌더하지 않는다.
 *
 * @connects
 *  - lib/viewer/summary.ts  → noticeSummary
 *  - types/viewer.ts        → ViewerNotice
 *  - components/ui/icon.tsx → 아이콘 렌더링
 */

"use client";

import { useState } from "react";
import { ChevronDown, CircleAlert } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { noticeSummary } from "@/lib/viewer/summary";
import type { ViewerNotice } from "@/types/viewer";

export function NoticeBar({ notices }: { notices: ViewerNotice[] }) {
  const [open, setOpen] = useState(false);
  if (notices.length === 0) return null;

  return (
    <section className="mx-5 mt-3 rounded-pop bg-brand-weak" data-testid="notice-bar" data-open={open}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        // 접근 가능한 이름을 고정한다. 안 그러면 펼치는 순간 이름이 요약 문구에서
        // "꼭 확인해요"로 통째로 바뀌어, 스크린리더에는 방금 누른 버튼이 다른
        // 버튼으로 바뀐 것처럼 들린다. 시각 표시는 아래 span이 그대로 담당한다.
        aria-label={`공지 ${notices.length}개`}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
      >
        <Icon name={CircleAlert} size={16} strokeWidth={2.2} className="flex-none text-on-brand-weak" />
        <span className={["min-w-0 flex-1 text-label font-semibold text-on-brand-weak", open ? "" : "truncate"].join(" ")}>
          {open ? "꼭 확인해요" : noticeSummary(notices)}
        </span>
        <span className="flex-none rounded-full bg-brand px-[7px] py-[2px] text-micro font-extrabold text-on-accent">
          {notices.length}
        </span>
        <Icon
          name={ChevronDown}
          size={15}
          strokeWidth={2.4}
          className={[
            "flex-none text-on-brand-weak transition-transform duration-fast ease-planit",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {open && (
        <ul className="px-3 pb-3">
          {notices.map((n, i) => (
            <li key={n.id} className={["flex gap-2.5 py-2.5", i > 0 ? "border-t border-accent-border" : ""].join(" ")}>
              <span aria-hidden="true" className="mt-[7px] h-[5px] w-[5px] flex-none rounded-full bg-brand" />
              <div>
                <h2 className="text-label font-bold text-primary">{n.title}</h2>
                <p className="mt-0.5 text-caption text-secondary">{n.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
