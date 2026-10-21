/**
 * @file 랜딩 배경 영상
 * @description 장식이라 aria-hidden. 안 뜨면(오류) 치우고, 화면 밖이거나 모션 줄이기면 멈춘다(랜딩 명세 §9).
 *              src를 <video>에 바로 둔다 — <source>로 감싸면 로드 실패가 <video>의 error로 오지 않는다.
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
    const io = new IntersectionObserver(([e]) => {
      // 자동 재생 거부(저전력 모드 등)는 첫 프레임 정지 화면으로 둔다
      if (e?.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (broken) return null;
  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onError={() => setBroken(true)}
    />
  );
}
