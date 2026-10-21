/**
 * @file 여정 폰 — 단톡방 · 뷰어 · 지도 세 겹
 * @description 받는 사람의 하루(명세 §4-4): 단톡방에서 링크를 받고(아래 겹), 누르면 뷰어가 올라오고(가운데),
 *              길찾기를 누르면 지도가 올라온다(위 겹). 움직임은 전부 run-story.ts가 ref로 준다.
 *              장식 미리보기라 화면 전체가 inert + aria-hidden, 바깥에 짧은 이름 하나(명세 §9).
 *
 * @connects
 *  - src/client/components/landing/landing-story.tsx  → refs·plan·now·noticeOpen
 *  - src/client/components/landing/viewer-preview.tsx → 가운데 겹
 */

"use client";

import { createRef, type RefObject } from "react";
import { PhoneViewer, ViewerPreview } from "@/client/components/landing/viewer-preview";
import styles from "@/client/components/landing/landing.module.css";
import type { ViewerPlan } from "@/shared/types/viewer";

export type StoryPhoneRefs = {
  phone: RefObject<HTMLDivElement | null>;
  screen: RefObject<HTMLDivElement | null>;
  vwrap: RefObject<HTMLDivElement | null>;
  scroll: RefObject<HTMLDivElement | null>;
  msgs: RefObject<HTMLDivElement | null>[];
  lcard: RefObject<HTMLSpanElement | null>;
  taps: RefObject<HTMLDivElement | null>;
  finger: RefObject<HTMLSpanElement | null>;
  map: RefObject<HTMLDivElement | null>;
  route: RefObject<SVGPathElement | null>;
  routeGlow: RefObject<SVGPathElement | null>;
  car: RefObject<SVGCircleElement | null>;
  arrive: RefObject<SVGCircleElement | null>;
  sheet: RefObject<HTMLDivElement | null>;
  eta: RefObject<HTMLElement | null>;
};

export function createStoryPhoneRefs(): StoryPhoneRefs {
  return {
    phone: createRef(), screen: createRef(), vwrap: createRef(), scroll: createRef(), msgs: [createRef(), createRef(), createRef()],
    lcard: createRef(), taps: createRef(), finger: createRef(), map: createRef(), route: createRef(),
    routeGlow: createRef(), car: createRef(), arrive: createRef(), sheet: createRef(), eta: createRef(),
  };
}

const ROUTE = "M46 318 C 80 300 112 296 146 284 C 180 272 200 246 226 232 C 240 224 248 214 252 204";

export function StoryPhone({
  refs,
  plan,
  now,
  noticeOpen,
  version,
}: {
  refs: StoryPhoneRefs;
  plan: ViewerPlan;
  now: Date;
  noticeOpen: boolean;
  /** 일정이 바뀌면 뷰어를 새로 마운트한다(넘기기·흐름 상태를 처음부터) */
  version: string;
}) {
  // 펼쳐 둔다 — React Compiler 린트는 렌더 중 refs.x 읽기를 ref 접근으로 본다(구조 분해는 통과)
  const { phone, screen, vwrap, scroll, msgs, lcard, taps, finger, map, route, routeGlow, car, arrive, sheet, eta } = refs;
  const [m0, m1, m2] = msgs;
  return (
    <div
      ref={phone}
      className={`${styles.phone} ${styles.glass} ${styles.live}`}
      data-testid="story-phone"
      data-step="-1"
      role="img"
      aria-label="플랜잇 뷰어 미리보기"
    >
      <div ref={screen} className={styles.screen} aria-hidden="true" inert>
        <div className={styles.chat}>
          <div className={styles.chead}>
            <span className={styles.back}>‹</span>
            <b>가을 제주 여행</b>
            <small>4</small>
          </div>
          <div className={styles.cbody}>
            <div ref={m0} className={styles.msg}>
              <i className={styles.av} style={{ background: "var(--landing-av-1)" }}>민</i>
              <div><small>민지</small><p className={styles.bubble}>일정 짰어! 여기 👇</p></div>
            </div>
            <div ref={m1} className={styles.msg}>
              <i className={styles.av} style={{ background: "var(--landing-av-1)" }}>민</i>
              <span ref={lcard} className={styles.lcard}>
                <span className={styles.lcover}><span>플랜잇</span></span>
                <span className={styles.lmeta}><b>제주 3일 모임</b><small>11.13 – 11.15 · 친구 4명</small></span>
              </span>
            </div>
            <div ref={m2} className={styles.msg}>
              <i className={styles.av} style={{ background: "var(--landing-av-3)" }}>현</i>
              <div><small>현우</small><p className={styles.bubble}>오 고마워 👍</p></div>
            </div>
          </div>
          <div className={styles.cinput} />
        </div>

        <div ref={vwrap} className={styles.vwrap}>
          <PhoneViewer scrollRef={scroll}>
            <ViewerPreview key={version} plan={plan} now={now} noticeOpen={noticeOpen} live />
          </PhoneViewer>
        </div>

        <div ref={map} className={styles.map}>
          <svg viewBox="0 0 280 590" preserveAspectRatio="xMidYMid slice">
            <path className={styles.mLand} d="M-10 236 C 30 190 96 168 150 170 C 206 172 262 150 296 176 L 296 392 C 250 418 170 426 110 412 C 60 400 10 378 -10 348 Z" />
            <ellipse className={styles.mLand2} cx="140" cy="292" rx="46" ry="30" />
            <ellipse className={styles.mLand3} cx="140" cy="292" rx="24" ry="15" />
            <path className={styles.mRoad} d="M0 330 C 50 322 96 330 140 322 S 236 296 296 300" strokeWidth="3" />
            <path className={styles.mRoad2} d="M30 250 C 70 262 110 240 150 250 S 230 220 290 228" strokeWidth="2" />
            <path className={styles.mRoad2} d="M90 180 C 96 230 100 300 92 400" strokeWidth="2" />
            <path className={styles.mRoad2} d="M210 168 C 204 230 214 300 200 410" strokeWidth="2" />
            <path ref={routeGlow} className={styles.mRouteGlow} d={ROUTE} strokeWidth="11" strokeLinecap="round" />
            <path ref={route} className={styles.mRoute} d={ROUTE} strokeWidth="4" strokeLinecap="round" />
            <circle className={styles.mFromHalo} cx="46" cy="318" r="10" />
            <circle className={styles.mFrom} cx="46" cy="318" r="5.5" strokeWidth="2" />
            <text className={styles.mLabel} x="46" y="342" textAnchor="middle" fontSize="9">흑돼지 명가</text>
            <circle ref={arrive} className={`${styles.mArrive} ${styles.arrive}`} cx="252" cy="184" r="16" strokeWidth="2" />
            <path className={styles.mPin} d="M252 204 C 243 192 241 188 241 183 A 11 11 0 0 1 263 183 C 263 188 261 192 252 204 Z" />
            <circle className={styles.mPinHole} cx="252" cy="183" r="4" />
            <text className={styles.mLabelStrong} x="246" y="162" textAnchor="middle" fontSize="9" fontWeight="700">성산일출봉</text>
            <circle ref={car} className={styles.mCar} r="5.5" strokeWidth="3" />
          </svg>
          <div className={styles.mtop}><i>‹</i>성산일출봉</div>
          <div ref={sheet} className={styles.msheet}>
            <small>다음 장소 · 14:30</small>
            <b>성산일출봉 트레킹</b>
            <div className={styles.eta}><b ref={eta} data-testid="eta" /><span>차로 · 41km</span></div>
            <span className={styles.mgo}>길찾기 시작</span>
          </div>
        </div>

        <span ref={finger} className={styles.finger} />
        <div ref={taps} className={styles.taps} />
      </div>
    </div>
  );
}
