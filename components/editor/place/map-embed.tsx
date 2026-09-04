/**
 * @file 지도 임베드 컴포넌트
 * @description 장소의 좌표(lat/lng)를 기반으로 지도를 임베드 표시.
 *              편집기(좌표 확인)와 뷰어(오시는 길) 양쪽에서 재사용 가능.
 *
 * @spec F-VIEW-5 (오시는 길: 지도 임베드)
 * @spec F-EDIT-PLACE-4 (좌표 입력/검색)
 *
 * @connects
 *  - components/editor/place/place-form.tsx       → 편집 시 좌표 미리보기
 *  - types/place.ts                                → Place.lat, Place.lng
 *
 * @notes 지도 provider: 네이버 지도 API 또는 카카오맵 API 사용 예정
 */
