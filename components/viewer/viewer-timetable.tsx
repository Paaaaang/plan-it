/**
 * @file 뷰어 타임테이블 타임라인
 * @description Day 전환 + 시간·소요·활동명·메모·연결 장소를 타임라인 형태로 렌더링.
 *
 * @spec F-VIEW-4 (타임테이블: Day 전환, 시간·소요·활동명·메모·장소 타임라인)
 *
 * @connects
 *  - app/p/[slug]/page.tsx                → 뷰어 페이지에서 렌더링
 *  - components/viewer/day-switcher.tsx   → Day 전환 UI
 *  - types/schedule.ts                    → Day, ScheduleItem 타입
 *  - types/place.ts                       → 연결된 Place 정보
 */
