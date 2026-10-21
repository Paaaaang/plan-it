/**
 * @file 랜딩 폰 속 뷰어
 * @description 랜딩의 두 폰(여정·만들어 보기)이 그리는 화면. **실제 뷰어 부품**을 그대로 쓴다 —
 *              목업을 따로 그리면 제품이 바뀔 때 랜딩이 거짓말을 한다(명세 D2).
 *              360px 폭으로 그려 280px 화면에 맞게 축소한다(부품 글자 크기가 모바일 기준이라).
 *              .theme-dark로 사용자 테마와 무관하게 제품 다크 토큰을 쓴다.
 *
 * @connects
 *  - src/client/components/viewer/{cover-header,notice-bar,day-pager,timeline}.tsx
 *  - src/client/components/landing/story-phone.tsx · try-section.tsx
 */

"use client";

import type { ReactNode, Ref } from "react";
import { CoverHeader } from "@/client/components/viewer/cover-header";
import { DayPager } from "@/client/components/viewer/day-pager";
import { NoticeBar } from "@/client/components/viewer/notice-bar";
import { Timeline } from "@/client/components/viewer/timeline";
import { Tabs } from "@/client/components/ui/tabs";
import styles from "@/client/components/landing/landing.module.css";
import type { ViewerPlan } from "@/shared/types/viewer";

const TABS = [
  { value: "timetable", label: "타임테이블" },
  { value: "places", label: "장소" },
];
const noop = () => {};

/** 축소 틀 + 스크롤 영역 + 아래 고정 길찾기 버튼. 스크롤 영역은 이야기 루프가 움직이므로 바깥이 ref를 쥔다 */
export function PhoneViewer({ scrollRef, children }: { scrollRef?: Ref<HTMLDivElement>; children: ReactNode }) {
  return (
    <div className={`${styles.vscale} theme-dark`}>
      <div ref={scrollRef} className={styles.vscroll}>
        {children}
      </div>
      <div className={styles.vcta} data-part="cta">
        <span className={styles.vctaBtn}>카카오맵으로 길찾기</span>
      </div>
    </div>
  );
}

/** 커버 · 공지 · 탭 · 일차 넘기기(타임라인). data-part는 단계별 강조(명세 §4-4)가 고르는 이름이다 */
export function ViewerPreview({
  plan,
  now,
  live = false,
  noticeOpen,
}: {
  plan: ViewerPlan;
  now: Date;
  live?: boolean;
  noticeOpen?: boolean;
}) {
  return (
    <>
      <div data-part="cover">
        <CoverHeader plan={plan} />
      </div>
      <div data-part="notice">
        <NoticeBar notices={plan.notices} open={noticeOpen} />
      </div>
      <div data-part="tabs" className="px-5 pt-4">
        <Tabs items={TABS} value="timetable" onChange={noop} />
      </div>
      <DayPager
        days={plan.days}
        live={live}
        renderDay={(day, i) => (
          <Timeline day={day} onOpenPlace={noop} now={now}>
            {live && i === 0 ? <span data-now-dot="" className={styles.nowDot} /> : null}
          </Timeline>
        )}
      />
    </>
  );
}
