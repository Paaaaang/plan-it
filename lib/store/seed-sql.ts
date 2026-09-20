/**
 * @file 픽스처 → SQL
 * @description seed 생성 스크립트와 reseed 라우트가 **같은 변환**을 쓰게 한다.
 *              갈라지면 "처음 상태"가 두 개가 된다.
 */
import type { ViewerPlan } from "../../types/viewer.ts";
import { hashPassword } from "../viewer/password.ts";

/** 1단계의 고정 소유자. 2단계에서 auth.uid()로 갈아끼운다. */
export const SEED_OWNER_ID = "00000000-0000-4000-8000-000000000001";

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
 * 일정 하나를 INSERT 문 묶음으로. **id를 픽스처 값 그대로 쓴다** —
 * E2E가 `s-n1`·`t-i3` 같은 id를 요청 본문에서 바꿔치기하며 거부 경로를 시험하므로
 * 그 값이 DB에도 그대로 있어야 한다(id 컬럼이 text인 이유, Step 2).
 */
export function planInsertSql(plan: ViewerPlan): string {
  const lines: string[] = [];
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
        pw ? q(hashPassword(pw)) : "null",
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
