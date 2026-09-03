/**
 * @file 지도 앱 딥링크
 * @description 뷰어 CTA와 장소 시트(Task 7)가 함께 쓰는 외부 링크 조립.
 */

import type { ViewerItem, ViewerPlace, ViewerPlan } from "@/types/viewer";

/**
 * CTA가 가리킬 장소. 그날 장소가 연결된 첫 항목 → 고정 장소 → 첫 장소 순으로 고른다.
 *
 * "아직 지나지 않은 첫 항목"을 시각으로 판정하지 않는다. 서버 렌더와 클라이언트의
 * 시각이 다르면(useNow는 마운트 후에야 시각을 준다) 하이드레이션 전후로 링크가
 * 바뀌어 누르는 순간 목적지가 흔들린다. 시각에 의존하지 않는 값이라야 안정적이다.
 */
export function nextPlace(plan: ViewerPlan, items: ViewerItem[]): ViewerPlace | null {
  const fromItems = items.find((it) => it.place)?.place ?? null;
  return fromItems ?? plan.places.find((p) => p.isPinned) ?? plan.places[0] ?? null;
}

/** 카카오맵 길찾기. 좌표가 있으면 좌표로, 없으면 이름 검색으로 보낸다. */
export function kakaoDirectionsUrl(place: ViewerPlace | null): string {
  if (!place) return "https://map.kakao.com/";
  if (place.lat != null && place.lng != null) {
    return `https://map.kakao.com/link/to/${encodeURIComponent(place.name)},${place.lat},${place.lng}`;
  }
  return `https://map.kakao.com/link/search/${encodeURIComponent(place.name)}`;
}

export function naverMapUrl(place: ViewerPlace): string {
  return `https://map.naver.com/p/search/${encodeURIComponent(place.name)}`;
}
