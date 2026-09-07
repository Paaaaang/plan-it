"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

/** 클라이언트 상한. **서버가 같은 값을 다시 본다**(actions/plan-actions.ts::setCover). */
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * 커버 업로더 — 사진 위 좌하단 라벨, 우하단 버튼.
 *
 * 클라이언트 검증은 **UX용이다**: `accept`와 같은 기준(`image/*`)까지만 걸러 서버 왕복
 * 없이 빨리 알려준다. 형식 허용 목록(JPG·PNG·WebP)·확장자·크기의 진짜 판정은 서버다 —
 * GIF처럼 `image/*`를 통과하는 파일은 서버가 거부하고 그 문구가 화면에 뜬다.
 */
export function CoverUploader({
  initialUrl,
  error,
  onPick,
}: {
  initialUrl: string | null;
  /** 서버가 낸 커버 오류. */
  error?: string;
  /** 고른 파일을 서버로 보낸다. 실패하면 false — 미리보기를 되돌린다. */
  onPick: (file: File) => Promise<boolean>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // objectURL은 문서가 살아 있는 한 회수되지 않는다. 이 cleanup이 **바뀔 때마다**
  // 이전 것을, 언마운트 때 마지막 것을 되돌려준다 — 없으면 사진을 고칠수록 샌다.
  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const pick = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      // 같은 파일을 다시 골라도 change가 나게 비운다.
      e.target.value = "";
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setLocalError("사진 파일만 올릴 수 있어요.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setLocalError("8MB보다 작은 사진을 올려주세요.");
        return;
      }
      setLocalError(null);

      // 서버 왕복을 기다리지 않고 바로 보여준다.
      setObjectUrl(URL.createObjectURL(file));
      const ok = await onPick(file);
      if (!ok) setObjectUrl(null);
    },
    [onPick],
  );

  const src = objectUrl ?? initialUrl;
  const message = localError ?? error;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative h-28 overflow-hidden rounded-btn border border-default bg-sunken">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- blob: URL은 next/image가 최적화할 수 없다.
          <img src={src} alt="" data-testid="cover-image" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-caption font-bold text-tertiary">
            커버 사진을 올려보세요
          </div>
        )}

        {/*
          사진 위 스크림과 흰 글자는 커버 전용 예외다 — 커버는 라이트/다크와 무관하게
          항상 어둡다. components/viewer/cover-header.tsx가 같은 이유로 같은 예외를 쓴다.
          사진이 없을 때는 스크림을 깔지 않는다(글자가 배경색 위에 그냥 앉는다).
        */}
        <div
          className="pointer-events-none absolute inset-0 flex items-end justify-between p-3"
          style={
            src
              ? { background: "linear-gradient(180deg, rgba(8,10,16,.10), rgba(8,10,16,.55))" }
              : undefined
          }
        >
          {/* 사진이 있을 때만 라벨을 얹는다 — 빈 자리에는 가운데 안내 문구가 이미 있다. */}
          <span className={`text-micro font-bold text-white ${src ? "" : "invisible"}`}>커버 사진</span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={[
              "pointer-events-auto rounded-xs px-2.5 py-[5px] text-micro font-bold",
              "transition-colors duration-fast ease-planit",
              src
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-neutral-fill text-secondary hover:text-primary",
            ].join(" ")}
          >
            {src ? "바꾸기" : "사진 고르기"}
          </button>
        </div>

        {/*
          진짜 입력은 감춘다. 노출되는 조작부는 위 버튼 하나뿐이라
          tabIndex/aria-hidden으로 보조기기에 두 번 읽히지 않게 한다.
        */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={pick}
          data-testid="cover-input"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
      </div>

      {message && (
        <p role="alert" className="text-caption font-semibold text-danger">
          {message}
        </p>
      )}
    </div>
  );
}
