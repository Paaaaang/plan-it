/**
 * @file 일정 행 CRUD + 커버 메모리 스토어
 * @description 조회·쓰기는 이제 전부 Postgres(adminClient)로 간다. 커버 이미지 바이트만
 *              아직 메모리에 남는다 — Supabase Storage가 붙기 전의 임시 자리다.
 */

import { findFixturePlan } from "@/lib/fixtures/viewer";
import { adminClient } from "@/lib/supabase/admin";
import { assemblePlan, type PlanRowSet } from "@/lib/store/rows";
import { planInsertSql } from "@/lib/store/seed-sql";
import { resetAttempts } from "@/lib/viewer/attempts";
import type { PlanStatus } from "@/types/editor";
import type { ViewerPlan } from "@/types/viewer";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 커버 이미지 바이트. `app/api/cover/[slug]/[v]/route.ts`가 여기서 읽어 내보낸다.
 * contentType은 **서버 허용 목록에서 고른 값**이지 업로더가 보낸 문자열이 아니다.
 *
 * 왜 모듈 변수가 아니라 `globalThis`인가.
 *
 * Next는 Route Handler를 페이지·Server Action과 **별도 번들**로 만든다. 같은 파일을
 * import해도 각 번들이 자기 모듈 인스턴스를 들고 돌아서, `let covers`는 경계를 넘지 못한다 —
 * `setCoverBlob`이 쓴 바이트를 커버 라우트가 못 본다(업로드 직후 404). dev의 HMR도 같은
 * 이유로 모듈을 다시 평가해 상태를 날린다.
 *
 * `globalThis`는 그 번들들이 실제로 공유하는 유일한 자리다. 프로세스 메모리를
 * 저장소로 쓰는 동안의 정상적인 Next 관용구다 — Storage가 붙으면 통째로 사라진다.
 */
const g = globalThis as typeof globalThis & {
  __planitCoverStore?: Map<string, { bytes: Uint8Array; contentType: string }>;
};

function covers(): Map<string, { bytes: Uint8Array; contentType: string }> {
  if (!g.__planitCoverStore) g.__planitCoverStore = new Map();
  return g.__planitCoverStore;
}

/**
 * Supabase 결과에서 `error`를 놓치지 않는다.
 *
 * `data ?? []`만 쓰면 "쿼리가 실패했다"와 "행이 원래 없다"가 똑같이 빈 배열이 된다.
 * 그 둘을 구분 못 하고 조립하면 화면은 완전해 **보이지만** 실은 일부만 있는 ViewerPlan을
 * 그대로 내보내게 된다(예: 공지 쿼리가 실패해도 "공지가 없는 일정"과 똑같이 렌더된다).
 * error가 있으면 여기서 던진다 — 부분 결과로 계속 가느니 시끄럽게 죽는 편이 낫다.
 * slug와 테이블/조작만 메시지에 남긴다. 행 데이터나 키 값은 넣지 않는다.
 */
function unwrap<T>(result: { data: T | null; error: { message: string } | null }, label: string): T | null {
  if (result.error) throw new Error(`Supabase 조회 실패 — ${label}: ${result.error.message}`);
  return result.data;
}

/**
 * 일정 하나를 통째로 읽어 ViewerPlan으로 조립한다.
 *
 * 테이블당 한 번씩, 총 6회 쿼리다. 조인 한 방으로 줄이면 부모 컬럼이 자식 행 수만큼
 * 복제돼 오고, 중첩 임베드는 PostgREST가 만드는 모양이 타입과 달라 변환이 더 복잡해진다.
 * 한 일정의 자식 수가 수십 개라 왕복 6회가 더 싸다.
 */
export async function getPlan(slug: string): Promise<ViewerPlan | undefined> {
  const db = adminClient();
  const planResult = await db
    .from("plans")
    .select("slug, title, plan_type, party_label, start_date, end_date, cover_image_url")
    .eq("slug", slug)
    .maybeSingle();
  const plan = unwrap(planResult, `plans(slug=${slug})`);
  if (!plan) return undefined;

  // Promise.all은 네 쿼리를 동시에 보낸다. Supabase 쿼리는 실패해도 reject하지 않고
  // {data:null, error}를 반환하므로, 무엇이 실패했는지는 all이 끝난 뒤 각 결과를
  // unwrap해서 판정한다 — .then 안에서 던지면 나머지 쿼리 결과를 못 본다.
  const [placesResult, noticesResult, daysResult, transportResult] = await Promise.all([
    db.from("places").select("id, name, address, lat, lng, memo, tags, is_pinned").eq("plan_id", slug),
    db.from("notices").select("id, title, body").eq("plan_id", slug).order("display_order"),
    db.from("days").select("id, day_number, date").eq("plan_id", slug).order("day_number"),
    db.from("transport_info").select("id, place_id, mode, from_label, to_label, duration_label, note").eq("plan_id", slug).order("display_order"),
  ]);
  const places = unwrap(placesResult, `places(plan_id=${slug})`);
  const notices = unwrap(noticesResult, `notices(plan_id=${slug})`);
  const days = unwrap(daysResult, `days(plan_id=${slug})`);
  const transport = unwrap(transportResult, `transport_info(plan_id=${slug})`);

  const dayIds = (days ?? []).map((d) => d.id);
  const itemsResult = dayIds.length
    ? await db
        .from("schedule_items")
        .select("id, day_id, start_time, duration_min, activity_name, memo, place_id")
        .in("day_id", dayIds)
        .order("display_order")
    : { data: [], error: null };
  const items = unwrap(itemsResult, `schedule_items(day_id in plans(slug=${slug}))`);

  return assemblePlan({
    plan, places: places ?? [], notices: notices ?? [],
    days: days ?? [], items: items ?? [], transport: transport ?? [],
  } as PlanRowSet);
}

export type ChildTable = "notices" | "places" | "transport_info" | "schedule_items";

/**
 * day_number로 day의 id를 찾는다. `addItem`이 쓴다 — schedule_items는 plan_id가
 * 없어서(days를 거쳐야 소유가 정해진다) 저장하기 전에 day_id를 먼저 알아야 한다.
 *
 * 원래 actions/schedule-actions.ts가 이 조회를 `adminClient()`로 직접 했다. 이 파일
 * 안의 다른 쿼리는 전부 unwrap을 거쳐 DB 장애와 "그런 날짜가 없다"를 구분하는데,
 * 액션 파일로 새 나간 이 하나만 error를 버리고 있었다 — 스토어가 유일한 DB 경계라는
 * 규약과도 맞지 않았다. 여기로 옮겨 둘 다 고친다.
 */
export async function findDayId(slug: string, dayNumber: number): Promise<string | undefined> {
  const result = await adminClient()
    .from("days")
    .select("id")
    .eq("plan_id", slug)
    .eq("day_number", dayNumber)
    .maybeSingle();
  return unwrap(result, `days(plan_id=${slug}, day_number=${dayNumber})`)?.id;
}

/** 이 slug 소유의 장소인지. `linkPlace`가 "존재하는 장소"까지만 보장하는 FK를 보강한다. */
export async function placeExists(slug: string, placeId: string): Promise<boolean> {
  const result = await adminClient()
    .from("places")
    .select("id")
    .eq("plan_id", slug)
    .eq("id", placeId)
    .maybeSingle();
  return unwrap(result, `places(plan_id=${slug}, id=${placeId})`) !== null;
}

/**
 * 소유 범위 검사를 한 자리에 둔다.
 *
 * `schedule_items`는 plan_id가 없다(days를 거친다). 그래서 이 함수가 테이블마다
 * 다른 조건을 만든다 — 부르는 쪽이 그걸 알면 한 군데서 빠뜨리는 순간 남의 일정 행을
 * 고칠 수 있다. 2단계에서 여기에 `AND owner_id = auth.uid()`가 붙는다.
 */
async function scopeIds(table: ChildTable, slug: string): Promise<string[] | "all"> {
  if (table !== "schedule_items") return "all"; // plan_id = slug로 충분하다
  const result = await adminClient().from("days").select("id").eq("plan_id", slug);
  const data = unwrap(result, `days(plan_id=${slug})`);
  return (data ?? []).map((d) => d.id);
}

// update()/delete() 둘 다 넘어올 수 있어 union으로 받는다 — from()의 반환형(select 전
// 빌더)은 .update()/.delete() 이후의 필터 빌더와 다른 타입이라 그걸로는 컴파일이 안 된다.
// (select 뒤 필터 빌더까지 구조적 제네릭으로 묶으면 supabase-js의 재귀적 타입 때문에
// "Type instantiation is excessively deep" — 그래서 select는 reorderRows에서 직접 건다.)
// `table`은 안 쓴다 — scopeIds가 이미 스코프(ids)를 결정했고, 여기는 그걸 적용만 한다.
type FilterBuilder =
  | ReturnType<ReturnType<SupabaseClient["from"]>["update"]>
  | ReturnType<ReturnType<SupabaseClient["from"]>["delete"]>;

function scoped(q: FilterBuilder, slug: string, ids: string[] | "all") {
  return ids === "all" ? q.eq("plan_id", slug) : q.in("day_id", ids);
}

export async function insertRow(
  table: ChildTable, slug: string, values: Record<string, unknown>,
): Promise<string> {
  const db = adminClient();
  // display_order는 **그 목록 안에서** 끝이다. schedule_items의 목록 단위는 일정 전체가
  // 아니라 하루다 — 일정 전체로 세면 2일차 첫 항목이 order=4 같은 값을 받아, 그 날
  // 목록의 0..n-1 규약(§3.4)이 깨지고 reorderRows가 덮어쓸 때까지 어긋난 채로 남는다.
  const counted =
    table === "schedule_items"
      ? db.from(table).select("id", { count: "exact", head: true }).eq("day_id", values.day_id as string)
      : db.from(table).select("id", { count: "exact", head: true }).eq("plan_id", slug);
  const countResult = await counted;
  // 개수 조회가 실패하면 무조건 0으로 떨어뜨리지 않는다 — 그러면 이미 있는 첫 행과
  // 같은 order를 갖는 행이 조용히 생긴다. 개수를 못 믿으면 순서를 매길 수 없다.
  unwrap(countResult, `${table} count(insert 준비)`);
  const row = {
    id: crypto.randomUUID(),
    ...(table === "schedule_items" ? {} : { plan_id: slug }),
    ...values,
    display_order: countResult.count ?? 0,
  };
  // 다른 쓰기 함수처럼 unwrap을 거친다 — 예전엔 error를 삼키고 undefined만 돌려줘서,
  // insert 실패(제약 위반·연결 끊김 등)가 액션 쪽에서 "id를 못 찾았다"와 똑같이 보였다.
  unwrap(await db.from(table).insert(row), `${table} insert(slug=${slug})`);
  return row.id as string;
}

export async function updateRow(
  table: ChildTable, slug: string, id: string, values: Record<string, unknown>,
): Promise<boolean> {
  const ids = await scopeIds(table, slug);
  const result = await scoped(adminClient().from(table).update(values), slug, ids)
    .eq("id", id)
    .select("id");
  const data = unwrap(result, `${table} update(id=${id})`);
  // 행이 없으면 빈 배열이 온다 — "없는 id"와 "남의 일정 id"가 같은 답을 준다.
  // 이건 error가 아니다(쿼리는 성공했다) — unwrap을 통과해도 여기서 여전히 조용하다.
  return (data?.length ?? 0) > 0;
}

export async function deleteRow(table: ChildTable, slug: string, id: string): Promise<boolean> {
  const ids = await scopeIds(table, slug);
  const result = await scoped(adminClient().from(table).delete(), slug, ids)
    .eq("id", id)
    .select("id");
  const data = unwrap(result, `${table} delete(id=${id})`);
  return (data?.length ?? 0) > 0;
}

/**
 * display_order를 0..n-1로 다시 쓴다 — 한 번의 upsert로, 전부 반영되거나 전혀 안 되거나다.
 *
 * 이전 버전은 행마다 update를 걸어, 중간에 하나가 실패하면 앞선 행들만 순서가 바뀐 채
 * false를 돌려줬다 — 편집기의 낙관적 목록은 false를 보고 화면을 되돌리는데 서버는 이미
 * 반쯤 바뀐 상태라 화면과 서버가 어긋난다. 그래서 먼저 대상 행 전체를 한 번에 읽고
 * (동시에 존재·소유 확인도 겸한다) display_order만 바꿔 upsert 한 번으로 보낸다.
 * PostgREST는 다중 행 upsert를 `INSERT ... ON CONFLICT (id) DO UPDATE` 한 문장으로
 * 만들어 보내므로 단일 SQL 문 = 원자적이다. 부분 컬럼(id·display_order)만 넣어 upsert하면
 * INSERT 분기가 나머지 NOT NULL 컬럼 때문에 실패할 수 있어(행이 실제로는 있어도 Postgres는
 * INSERT 문의 값 목록 자체를 먼저 검증한다) select("*")로 전체 컬럼을 들고 온다.
 *
 * 다만 이 select → upsert 사이에도 창이 있다 — 그 사이 다른 요청이 같은 행의 다른
 * 컬럼(예: title)을 고치면 여기서 읽은 옛 값 그대로 upsert되어 그 수정이 덮인다.
 * read-modify-write라 R20(saveBasicInfo 경합)과 같은 족속이고 창은 훨씬 좁다(select
 * 한 번의 왕복 시간). 정직하게 남긴다 — 고치려면 display_order만 건드리는 부분
 * upsert나 버전 컬럼이 필요하고, 둘 다 이 범위의 설계 결정이 아니다.
 */
export async function reorderRows(table: ChildTable, slug: string, ids: string[]): Promise<boolean> {
  const db = adminClient();
  const scope = await scopeIds(table, slug);
  const query = db.from(table).select("*").in("id", ids);
  const selectResult = await (scope === "all" ? query.eq("plan_id", slug) : query.in("day_id", scope));
  const rows = unwrap(selectResult, `${table} select(reorder 대상)`);
  // 요청한 id 개수와 실제로 찾은 행 개수가 다르면 없는 id거나 남의 일정 id다 — 구분하지 않는다.
  if (!rows || rows.length !== ids.length) return false;

  const byId = new Map<string, { id: string }>(rows.map((r: { id: string }) => [r.id, r]));
  const reordered = ids.map((id, order) => ({ ...byId.get(id), display_order: order }));

  const upsertResult = await db.from(table).upsert(reordered);
  unwrap(upsertResult, `${table} upsert(reorder)`);
  return true;
}

export async function updatePlanRow(slug: string, values: Record<string, unknown>): Promise<boolean> {
  const result = await adminClient()
    .from("plans")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select("slug");
  const data = unwrap(result, `plans update(slug=${slug})`);
  return (data?.length ?? 0) > 0;
}

/**
 * 기간이 바뀌면 days를 맞춘다. dates는 1일차부터 순서대로다.
 *
 * 줄이는 쪽은 삭제다 — schedule_items가 CASCADE로 따라간다. **일정이 든 날이
 * 사라지는 축소는 호출부(plan-actions의 syncDays 검증)가 먼저 거부하므로**
 * 여기까지 오는 삭제는 빈 날뿐이다.
 *
 * 각 단계를 unwrap한다 — 예전엔 무조건 true를 돌려줘서, 중간에 하나가 실패해도
 * saveBasicInfo가 "저장됐다"고 말했다(정작 날짜는 안 바뀐 채로).
 */
export async function syncDayRows(slug: string, dates: string[]): Promise<boolean> {
  const db = adminClient();
  const existingResult = await db.from("days").select("id, day_number").eq("plan_id", slug);
  const existing = unwrap(existingResult, `days(plan_id=${slug})`);
  const have = new Map((existing ?? []).map((d) => [d.day_number, d.id]));

  for (const [i, date] of dates.entries()) {
    const n = i + 1;
    const id = have.get(n);
    if (id) unwrap(await db.from("days").update({ date }).eq("id", id), `days update(id=${id})`);
    else unwrap(await db.from("days").insert({ id: `${slug}-d${n}`, plan_id: slug, day_number: n, date }), `days insert(plan_id=${slug}, day_number=${n})`);
    have.delete(n);
  }
  // 남은 것 = 기간 밖으로 밀려난 날
  for (const id of have.values()) unwrap(await db.from("days").delete().eq("id", id), `days delete(id=${id})`);
  return true;
}

/**
 * 뷰어 게이트가 보는 값 한 벌. status·만료·해시를 **한 번에** 읽는다 —
 * 세 번 나눠 읽으면 그 사이 상태가 바뀔 수 있고 왕복도 세 배다.
 */
export async function getPlanMeta(
  slug: string,
): Promise<{ status: PlanStatus; expiresAt: string | null; passwordHash: string | null } | undefined> {
  const result = await adminClient()
    .from("plans")
    .select("status, expires_at, password_hash")
    .eq("slug", slug)
    .maybeSingle();
  const data = unwrap(result, `plans meta(slug=${slug})`);
  if (!data) return undefined;
  return { status: data.status as PlanStatus, expiresAt: data.expires_at, passwordHash: data.password_hash };
}

/** 편집기 페이지가 쓰는 상태 조회. 뷰어는 getPlanMeta를 쓴다(만료·해시를 같이 봐야 한다). */
export async function getPlanStatus(slug: string): Promise<PlanStatus | undefined> {
  return (await getPlanMeta(slug))?.status;
}

export function setCoverBlob(slug: string, bytes: Uint8Array, contentType: string): void {
  covers().set(slug, { bytes, contentType });
}

export function getCoverBlob(slug: string): { bytes: Uint8Array; contentType: string } | undefined {
  return covers().get(slug);
}

/**
 * slug 하나를 픽스처 씨앗 값으로 되돌린다. 없는 slug면 아무것도 하지 않고 false.
 *
 * 되돌리기를 **시작 쪽**에서 하는 이유는 그대로다: 끝에서 되돌리면 그 코드에 닿기 전에
 * 넘어진 런이 값을 남기고, 그게 다음 실행의 첫 단언을 깨뜨린다(실제로 그렇게 터졌다).
 *
 * plan 행을 지우면 자식이 CASCADE로 따라간다 — 자식을 하나씩 지우지 않는다.
 * 씨앗 SQL은 seed.sql과 **같은 생성기**를 쓴다. 갈라지면 "처음 상태"가 두 개가 된다.
 */
export async function reseedPlan(slug: string): Promise<boolean> {
  const fixture = findFixturePlan(slug);
  if (!fixture) return false;

  // delete와 insert를 **하나의** exec_sql 호출로 보낸다 — 따로 왕복하면(delete 성공,
  // insert 대기) 그 사이 일정이 없는 순간이 생기고, fullyParallel로 같은 slug를 읽는
  // 다른 스펙(예: visual.spec.ts가 여기서 reseed하는 동안 editor.spec.ts가 읽는 경우)이
  // notFound를 그대로 관측한다. planInsertSql이 delete 문을 이미 앞에 붙여 내보내므로
  // (lib/store/seed-sql.ts) exec_sql 한 번 = 한 트랜잭션 = 동시 리더는 완전한 옛 값이거나
  // 완전한 새 값만 본다. exec_sql은 우리가 마이그레이션에서 만든 함수다(아래 Step 2).
  // 다른 쓰기 함수처럼 unwrap한다 — 예전엔 error를 삼키고 false만 돌려줘서, exec_sql
  // 실패(권한·문법·연결 문제)가 라우트에서 "그런 픽스처가 없다"(404)와 구분이 안 됐다.
  unwrap(await adminClient().rpc("exec_sql", { sql: planInsertSql(fixture) }), `exec_sql(reseed slug=${slug})`);
  // 시도 카운터는 프로세스 메모리라 DB를 되돌려서는 부족하다.
  resetAttempts(slug);
  return true;
}
