"use client";

import { useEffect, useState } from "react";

/**
 * 마운트 후의 현재 시각. 서버 렌더와 첫 페인트에서는 null이다.
 *
 * 뷰어는 캐시 우선 경로다 (스펙 §7.4). 서버에서 시각을 굳히면 캐시된 HTML이
 * 몇 시간 전 상태를 들고 다니게 된다. 클라이언트에서 읽으면 캐시와 진행 상태가 둘 다 맞다.
 * null일 때의 화면(전부 회색 레일)은 스펙이 이미 인정한 상태다 — 오늘이 아닌 날의 모습과 같다.
 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // tick을 이름 있는 로컬 함수로 두고 즉시 1회 + setInterval로 구독한다.
    // (effect 본문에서 setState를 직접 동기 호출하면 react-hooks/set-state-in-effect가
    // 캐스케이딩 렌더 경고를 낸다 — 콜백 안에서 호출하는 형태로 우회한다.)
    // 1분마다 갱신한다. 레일이 화면을 보는 동안 조용히 흐른다.
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return now;
}
