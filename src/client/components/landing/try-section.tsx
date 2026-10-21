/**
 * @file 만들어 보기
 * @description 이름·종류·기간을 바꾸면 오른쪽 폰(실제 뷰어 부품)이 바로 바뀐다(명세 §6).
 *              "링크 복사"는 **복사하지 않는다**(명세 D3) — 숨 쉬는 강조로 누르게 하고, 누르면
 *              참가자 다섯 명이 차례로 합류하는 연출만 한다. 데모라 서버에 아무것도 만들지 않는다.
 *
 * @connects
 *  - src/client/components/landing/landing-story.tsx  → draft 상태·phoneRef(착지 목표)
 *  - src/shared/fixtures/landing.ts                   → draftCase·demoShareKey·KINDS·LENS
 */

"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { LandingVideo } from "@/client/components/landing/landing-video";
import { LANDING_VIDEOS } from "@/client/components/landing/landing-videos";
import { PhoneViewer, ViewerPreview } from "@/client/components/landing/viewer-preview";
import styles from "@/client/components/landing/landing.module.css";
import { KINDS, LENS, NAME_MAX, demoShareKey, draftCase, type Draft } from "@/shared/fixtures/landing";

/** 합류하는 참가자 — 데모 이름 */
const PEOPLE = [
  ["민", "--landing-av-1"],
  ["지", "--landing-av-2"],
  ["현", "--landing-av-3"],
  ["수", "--landing-av-4"],
  ["윤", "--landing-av-5"],
] as const;

function Chips<T extends string>({
  label,
  id,
  options,
  value,
  onPick,
}: {
  label: string;
  id: string;
  options: readonly T[];
  value: T;
  onPick: (v: T) => void;
}) {
  return (
    <div className={styles.field}>
      <span className={styles.lab} id={id}>{label}</span>
      <div className={styles.chips} role="group" aria-labelledby={id}>
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={o === value} onClick={() => onPick(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TrySection({
  draft,
  onDraft,
  phoneRef,
}: {
  draft: Draft;
  onDraft: (d: Draft) => void;
  phoneRef: RefObject<HTMLDivElement | null>;
}) {
  const shown = useMemo(() => draftCase(draft), [draft]);
  const [nudge, setNudge] = useState(true);
  /** null = 아직 안 누름, 0 = 보내는 중, n = n명 합류 */
  const [joined, setJoined] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function send() {
    setNudge(false); // 한 번 누르면 강조는 영원히 멈춘다
    timers.current.forEach(clearTimeout);
    setJoined(0);
    timers.current = PEOPLE.map((_, i) => window.setTimeout(() => setJoined(i + 1), 700 + i * 550));
  }

  return (
    <section className={styles.try} id="try" aria-labelledby="h2try">
      <LandingVideo src={LANDING_VIDEOS.try} className={styles.bgVideo} />
      <div className={styles.tryShade} aria-hidden="true" />
      <div className={`${styles.wrap} ${styles.tryInner}`}>
        <div className={styles.sechead}>
          <span className={styles.hand}>한번 해 볼래요?</span>
          <h2 id="h2try">이름을 쓰면, 링크가 생겨요.</h2>
        </div>
        <div className={styles.tryGrid}>
          <div className={`${styles.maker} ${styles.glass}`}>
            <div className={styles.field}>
              <label htmlFor="try-name">모임 이름</label>
              <input
                id="try-name"
                value={draft.title}
                maxLength={NAME_MAX}
                autoComplete="off"
                onChange={(e) => onDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <Chips label="어떤 모임이에요?" id="try-kind" options={KINDS} value={draft.kind} onPick={(kind) => onDraft({ ...draft, kind })} />
            <Chips label="며칠이에요?" id="try-len" options={LENS} value={draft.len} onPick={(len) => onDraft({ ...draft, len })} />
            <div className={styles.field}>
              <span className={styles.lab}>공유 링크</span>
              <div className={styles.linkbox}>
                <code data-testid="try-link">/p/{demoShareKey(draft)}</code>
                <button type="button" className={`${styles.btn} ${styles.btnCoral} ${styles.copy}`} data-nudge={nudge} onClick={send}>
                  링크 복사
                </button>
              </div>
            </div>
            <div className={styles.joined}>
              <div className={styles.stars} aria-hidden="true">
                {joined !== null &&
                  PEOPLE.map(([c, av], i) => (
                    <i key={c} data-in={i < joined ? "" : undefined} style={{ background: `var(${av})` }}>{c}</i>
                  ))}
              </div>
              <span role="status">
                {joined === null ? "링크를 복사해 보세요." : joined === 0 ? "보내는 중…" : <><b>{joined}명</b>이 로그인 없이 열었어요</>}
              </span>
            </div>
          </div>

          <div ref={phoneRef} className={`${styles.phone} ${styles.glass}`} data-testid="try-phone" role="img" aria-label="만들고 있는 일정 미리보기">
            <div className={styles.screen} aria-hidden="true" inert>
              <PhoneViewer>
                <ViewerPreview plan={shown.plan} now={shown.now} />
              </PhoneViewer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
