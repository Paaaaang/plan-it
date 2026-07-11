/**
 * @file 뷰어 실용 액션 버튼
 * @description 주소 복사, 네이버 지도/카카오맵 열기 등 참가자 실용 액션 버튼 모음.
 *
 * @spec F-VIEW-5 (주소 복사·외부 지도 앱 연결)
 *
 * @connects
 *  - actions/analytics-actions.ts → logEvent (action_click: copy_address, open_map 등)
 *  - hooks/use-toast.ts           → 복사 완료 토스트
 *  - types/place.ts               → Place.address (복사 대상)
 *
 * @analytics action_click 이벤트 발생 → KPI "실용 액션 클릭률" 집계
 */
