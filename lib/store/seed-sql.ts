/**
 * @file 픽스처 → SQL
 * @description seed 생성 스크립트와 reseed 라우트가 **같은 변환**을 쓰게 한다.
 *              갈라지면 "처음 상태"가 두 개가 된다.
 */
import { createHash } from "node:crypto";
import type { ViewerPlan } from "../../types/viewer.ts";
import { hashPassword } from "../viewer/password.ts";

/** 1단계의 고정 소유자. 2단계에서 auth.uid()로 갈아끼운다. */
export const SEED_OWNER_ID = "00000000-0000-4000-8000-000000000001";

/**
 * E2E 전용. 생성된 INSERT 묶음을 한 번에 실행한다.
 *
 * 왜 필요한가: reseed는 seed.sql과 **같은 생성기**가 만든 SQL을 써야 한다(갈라지면
 * "처음 상태"가 두 개가 된다). PostgREST의 insert()로 옮기면 그 생성기를 한 벌 더
 * 만들게 된다.
 *
 * 보안: service_role만 실행할 수 있고, 부르는 곳은 NODE_ENV!=production에서만 사는
 * 라우트 하나다(app/api/test/reseed). 입력은 서버가 든 픽스처에서 생성한 문자열이지
 * 요청 본문이 아니다.
 *
 * 왜 마이그레이션이 아니라 seed 출력인가: `supabase db push`는 `supabase/migrations/`를
 * 그대로 원격(프로덕션 포함)에 적용한다. arbitrary SQL을 실행하는 security definer
 * 함수를 거기 두면 "push를 실수로 돌리지 않는다"는 사람의 기억에만 의존하게 된다.
 * seed는 `supabase db reset`(로컬 전용)에서만 실행되므로, 이 함수가 원격에 닿을 길이
 * 구조적으로 없다(scripts/gen-seed.ts).
 */
export const EXEC_SQL_FUNCTION_SQL = `create or replace function exec_sql(sql text) returns void
language plpgsql security definer as $$
begin
  execute sql;
end;
$$;

revoke all on function exec_sql(text) from public, anon, authenticated;`;

/** 만료 픽스처. 지금은 EXPIRED_SLUGS 하드코딩이던 것이 값이 된다. */
export const EXPIRED_SEED_SLUGS = new Set(["gone"]);
/** 비공개 픽스처의 평문 비밀번호. 해시는 생성 시점에 만든다. */
export const SEED_PASSWORDS = new Map<string, string>([["secret-party", "1234"]]);

/** SQL 문자열 리터럴. 값은 픽스처(우리 소유)지만 이스케이프를 생략하지 않는다. */
function q(v: string | null): string {
  return v === null ? "null" : `'${v.replace(/'/g, "''")}'`;
}

function tagsLiteral(tags: string[]): string {
  return tags.length === 0 ? "'{}'" : `array[${tags.map((t) => q(t)).join(", ")}]::text[]`;
}

/**
 * slug에서 결정적으로 뽑은 16바이트 솔트. **여기서만 쓴다.**
 * `supabase/seed.sql`은 "생성물이지만 커밋한다"는 전제가 재현 가능해야 한다는
 * 뜻인데, `hashPassword`의 기본 무작위 솔트를 그대로 쓰면 `npm run seed:gen`을
 * 두 번 돌릴 때마다 소스 변경 없이 diff가 난다. 여기서 예측 가능한 솔트를 써도
 * 안전한 이유는 셋 다 겹친다: 비밀번호 자체가 이미 소스에 평문으로 있고
 * (`SEED_PASSWORDS`), DB가 로컬이고, 공개된 픽스처 비밀번호는 솔트를 숨겨도
 * 어차피 보호되지 않는다. **실제 사용자 비밀번호에는 이 근거가 적용되지
 * 않는다** — `hashPassword`를 이 인자 없이 부르면 여전히 매번 무작위 솔트다.
 */
function seedSalt(slug: string): Buffer {
  return createHash("sha256").update(slug).digest().subarray(0, 16);
}

/**
 * 일정 하나를 DELETE + INSERT 문 묶음으로. **id를 픽스처 값 그대로 쓴다** —
 * E2E가 `s-n1`·`t-i3` 같은 id를 요청 본문에서 바꿔치기하며 거부 경로를 시험하므로
 * 그 값이 DB에도 그대로 있어야 한다(id 컬럼이 text인 이유, Step 2).
 *
 * 맨 앞에 그 slug의 DELETE를 넣는 이유: 이 출력 전체가 `exec_sql` 한 번(=한 트랜잭션)으로
 * 실행된다(lib/store/plans.ts의 reseedPlan). delete와 insert를 별도 왕복으로 나누면
 * 그 사이 "일정이 없는" 순간이 생기고, 병렬로 도는 다른 스펙이 그 순간을 그대로 읽어
 * notFound를 받는다 — 한 문자열 안에 넣어야 동시 리더가 항상 완전한 옛 값이거나
 * 완전한 새 값만 본다(reseed는 같은 씨앗으로 되돌리므로 둘은 같은 값이다).
 * `seed.sql`에서는 빈 DB에 대한 DELETE라 아무 일도 안 한다.
 */
export function planInsertSql(plan: ViewerPlan): string {
  const lines: string[] = [`delete from plans where slug = ${q(plan.slug)};`];
  const expired = EXPIRED_SEED_SLUGS.has(plan.slug);
  const pw = SEED_PASSWORDS.get(plan.slug);
  const status = pw ? "private" : "public";

  lines.push(
    `insert into plans (id, owner_id, slug, title, plan_type, party_label, start_date, end_date, status, password_hash, cover_image_url, expires_at) values (` +
      [
        q(plan.slug),
        q(SEED_OWNER_ID),
        q(plan.slug),
        q(plan.title),
        q(plan.planType),
        q(plan.partyLabel),
        q(plan.startDate),
        q(plan.endDate),
        q(status),
        pw ? q(hashPassword(pw, seedSalt(plan.slug))) : "null",
        q(plan.coverImageUrl),
        expired ? "now() - interval '1 day'" : "null",
      ].join(", ") +
      `);`,
  );

  plan.places.forEach((p) => {
    lines.push(
      `insert into places (id, plan_id, name, address, lat, lng, memo, tags, is_pinned) values (` +
        [q(p.id), q(plan.slug), q(p.name), q(p.address), p.lat ?? "null", p.lng ?? "null", q(p.memo), tagsLiteral(p.tags), String(p.isPinned)].join(", ") +
        `);`,
    );
  });

  plan.notices.forEach((n, i) => {
    lines.push(
      `insert into notices (id, plan_id, title, body, display_order) values (${q(n.id)}, ${q(plan.slug)}, ${q(n.title)}, ${q(n.body)}, ${i});`,
    );
  });

  plan.days.forEach((d) => {
    const dayId = `${plan.slug}-d${d.dayNumber}`;
    lines.push(
      `insert into days (id, plan_id, day_number, date) values (${q(dayId)}, ${q(plan.slug)}, ${d.dayNumber}, ${q(d.date)});`,
    );
    d.items.forEach((it, i) => {
      lines.push(
        `insert into schedule_items (id, day_id, start_time, duration_min, activity_name, memo, place_id, display_order) values (` +
          [q(it.id), q(dayId), q(it.startTime), it.durationMin ?? "null", q(it.activityName), q(it.memo), q(it.place?.id ?? null), i].join(", ") +
          `);`,
      );
    });
  });

  plan.transport.forEach((t, i) => {
    lines.push(
      `insert into transport_info (id, plan_id, place_id, mode, from_label, to_label, duration_label, note, display_order) values (` +
        [q(t.id), q(plan.slug), q(t.placeId), q(t.mode), q(t.fromLabel), q(t.toLabel), q(t.durationLabel), q(t.note), i].join(", ") +
        `);`,
    );
  });

  return lines.join("\n");
}
