/**
 * @file 랜딩 배경 영상
 * @description 장식이라 aria-hidden. 안 뜨면(오류) 치우고, 화면 밖이거나 모션 줄이기면 멈춘다(랜딩 명세 §9).
 *              src를 <video>에 바로 둔다 — <source>로 감싸면 로드 실패가 <video>의 error로 오지 않는다.
 *              autoPlay 없이 preload="none" — 화면에 들어올 때만 받는다. WebKit은 autoplay 영상을 preload와
 *              무관하게 통째로 받아, 영상 6개(~73MB)를 페이지를 열자마자 다 받았다.
 */

"use client";

import { useEffect, useRef, useState } from "react";

export function LandingVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // 수화되기 전에 이미 실패했으면 onError는 놓친다(error는 버블링하지 않고 React가 수화 때 붙인다) — 여기서 따로 본다
    if (v.error) {
      setBroken(true);
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        // 한 번에 여러 개가 쌓여 오면 마지막이 지금 상태다
        const e = entries[entries.length - 1];
        // 자동 재생 거부(저전력 모드 등)는 바탕만 남긴다
        if (e?.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px" }, // 스크롤로 들어오기 조금 전에 받기 시작한다
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (broken) return null;
  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onError={() => setBroken(true)}
    />
  );
}
