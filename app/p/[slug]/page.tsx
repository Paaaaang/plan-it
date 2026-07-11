/**
 * @file 공개 뷰어 페이지
 * @description slug 기반 공유 링크로 접속하는 일정 열람 페이지.
 *              헤더·공지·타임테이블·오시는 길(장소/지도/교통)로 구성.
 *              로그인 불필요. 비공개(private) 일정은 비밀번호 게이트 표시.
 *
 * @route /p/[slug]  (예: /p/abc123)
 * @auth 불필요 (public) / 비밀번호 필요 (private) / 비노출 (draft)
 * @spec F-VIEW-1~7, F-SHARE-3~5
 *
 * @connects
 *  - actions/viewer-actions.ts                → getBySlug (일정 데이터 조회)
 *  - actions/viewer-actions.ts                → verifyPassword (비공개 검증)
 *  - actions/analytics-actions.ts             → logEvent (plan_viewed, action_click)
 *  - components/viewer/viewer-header.tsx      → 헤더 (제목·기간·N박M일)
 *  - components/viewer/viewer-notice.tsx      → 공지 카드
 *  - components/viewer/viewer-timetable.tsx   → 타임테이블 타임라인
 *  - components/viewer/viewer-directions.tsx  → 오시는 길 (지도·주소복사·외부 앱)
 *  - components/viewer/viewer-transport.tsx   → 대중교통 안내
 *  - components/viewer/password-gate.tsx      → 비공개 비밀번호 입력 게이트
 *
 * @seo OG/트위터 메타 서버 렌더 (제목·기간·썸네일) — generateMetadata 사용
 * @cache ISR + CDN 엣지 캐싱. 기획자 저장 시 revalidate 트리거.
 */
