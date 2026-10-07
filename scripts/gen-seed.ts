/**
 * @file 픽스처 → supabase/seed.sql
 *
 * `src/shared/fixtures/viewer.ts`가 씨앗의 **유일한 원천**이다. 소비자가 둘인데
 * 경로가 다르다: `reseed` 라우트는 같은 TS 객체를 런타임에 INSERT하고,
 * `supabase db reset`은 Node를 거치지 않고 seed.sql만 읽는다.
 *
 * 출력은 **커밋하지 않는다**(.gitignore). 픽스처가 `dayOffset()`으로 날짜를 "오늘"
 * 기준 상대값으로 찍으므로, 생성물을 커밋해 두면 그 시점의 절대 날짜가 소스에 박혀
 * 하루만 지나도 실제 픽스처(오늘 기준)와 어긋난다 — 뷰어의 "오늘" 레일 로직이 조용히
 * 깨지는 원인이 된다. 대신 `npm run db:reset`이 매번 이 스크립트를 먼저 돌려
 * 그날의 seed.sql을 새로 만든다(package.json).
 *
 * exec_sql 함수도 여기서 같이 낸다(CREATE 문을 fixture INSERT 앞에 둔다) — 이건
 * E2E 전용 함수라 `supabase/migrations/`(= `db push`가 프로덕션에 적용하는 대상)에
 * 두면 실수로 원격에 올라갈 수 있다. `db reset`(로컬 전용)에서만 도는 seed 출력에
 * 있어야 그 경로가 구조적으로 막힌다.
 *
 * 실행: npm run seed:gen
 */
import { writeFileSync } from "node:fs";
// 상대 경로 + .ts 확장자다, `@/`가 아니다 — 이 스크립트 자체가 `node --experimental-strip-types`로
// 직접 실행되고(package.json의 seed:gen), plain node는 tsconfig paths를 못 푼다.
import { allFixturePlans } from "../src/shared/fixtures/viewer.ts";
import { planInsertSql, SEED_OWNER_ID, EXEC_SQL_FUNCTION_SQL, seedOwnerSql } from "../src/server/store/seed-sql.ts";

const sql = [
  "-- 생성물이다. 손으로 고치지 않는다. `npm run db:reset`이 매번 다시 만든다(커밋 대상 아님).",
  "-- 원천: lib/fixtures/viewer.ts",
  "",
  EXEC_SQL_FUNCTION_SQL,
  "",
  seedOwnerSql(),
  "",
  // auth.users insert가 위에서 트리거(on_auth_user_created)를 돌려 profiles 행을 이미 만든다.
  // 여기서 또 넣는 이유는 시드 데이터(display_name 등)가 fixture 쪽 권위를 갖게 하려는 것 —
  // on conflict do update로 트리거가 채운 값을 덮어써서 둘이 겹쳐도 잃는 데이터가 없다.
  `insert into profiles (id, display_name, role) values ('${SEED_OWNER_ID}', '플랜잇 개발 계정', 'member')`,
  `  on conflict (id) do update set display_name = excluded.display_name, role = excluded.role;`,
  "",
  ...allFixturePlans().map(planInsertSql),
].join("\n");

writeFileSync("supabase/seed.sql", sql + "\n");
console.log(`seed.sql: ${allFixturePlans().length}개 일정`);
