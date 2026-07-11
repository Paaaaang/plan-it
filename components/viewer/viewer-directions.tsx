/**
 * @file 뷰어 오시는 길
 * @description 고정 장소의 이름·주소(복사)·지도 임베드·외부 지도 앱(네이버/카카오) 연결.
 *
 * @spec F-VIEW-5 (오시는 길: 고정 장소 + 주소 복사 + 지도 임베드 + 외부 앱)
 *
 * @connects
 *  - app/p/[slug]/page.tsx                    → 뷰어 페이지에서 렌더링
 *  - components/editor/place/map-embed.tsx    → 지도 임베드 컴포넌트 재사용
 *  - components/viewer/action-buttons.tsx     → 주소 복사, 지도 앱 열기 버튼
 *  - types/place.ts                           → Place 타입 (is_pinned=true인 장소)
 */
