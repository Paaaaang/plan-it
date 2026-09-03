/**
 * @file 뷰어 조회의 요청 단위 메모이제이션
 * @description `/p/[slug]`는 한 요청에서 getBySlug를 두 번 부른다 — generateMetadata와 페이지.
 *              지금은 픽스처라 공짜지만 Supabase로 바뀌면 최다 트래픽 경로에서 DB 왕복이 2배가 된다.
 *              React의 cache()는 같은 요청의 렌더 스코프 안에서 첫 호출 결과를 재사용한다.
 *
 * @connects
 *  - actions/viewer-actions.ts    → 실제 조회 (getBySlug)
 *  - app/p/[slug]/page.tsx        → 유일한 호출자 (generateMetadata + 페이지)
 *
 * 왜 actions/viewer-actions.ts 안이 아닌가:
 * 빌드는 통과한다(확인함). 다만 `'use server'` 파일의 **모든 export는 클라이언트가 부를 수 있는
 * Server Action 엔드포인트가 된다.** 캐시 래퍼는 서버 내부 배관인데, 거기 두면 `unlocked`를
 * 그대로 넘기는 공개 엔드포인트가 하나 더 생긴다 — 리뷰가 이미 지적한 인가 우회 면적(finding #3)을
 * 이득 없이 넓힌다. 조회 헬퍼는 lib/viewer/(summary·rail·links)의 이웃이 맞는 자리다.
 */

import { cache } from "react";
import { getBySlug } from "@/actions/viewer-actions";
import type { ViewerResult } from "@/types/viewer";

/**
 * slug로 뷰어 데이터를 조회한다. 같은 요청 안에서는 한 번만 실제로 조회한다.
 *
 * `unlocked`를 일부러 받지 않는다 — 비밀번호 해제 판정은 Task 8이 서버에서 스스로 한다.
 * 여기서 파라미터로 받으면 캐시 키가 갈라지고 인가가 호출자 손에 남는다.
 */
export const getPlan = cache((slug: string): Promise<ViewerResult> => getBySlug(slug));
