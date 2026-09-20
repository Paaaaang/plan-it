/**
 * @file 픽스처 → supabase/seed.sql
 *
 * `lib/fixtures/viewer.ts`가 씨앗의 **유일한 원천**이다. 소비자가 둘인데
 * 경로가 다르다: `reseed` 라우트는 같은 TS 객체를 런타임에 INSERT하고,
 * `supabase db reset`은 Node를 거치지 않고 seed.sql만 읽는다.
 * 그래서 생성물을 커밋한다 — 손으로 두 벌을 관리하면 "처음 상태"가 갈라진다.
 *
 * 실행: npm run seed:gen
 */
import { writeFileSync } from "node:fs";
import { allFixturePlans } from "../lib/fixtures/viewer.ts";
import { planInsertSql, SEED_OWNER_ID } from "../lib/store/seed-sql.ts";

const sql = [
  "-- 생성물이다. 손으로 고치지 않는다. `npm run seed:gen`으로 다시 만든다.",
  "-- 원천: lib/fixtures/viewer.ts",
  "",
  `insert into profiles (id, display_name, role) values ('${SEED_OWNER_ID}', '플랜잇 개발 계정', 'member');`,
  "",
  ...allFixturePlans().map(planInsertSql),
].join("\n");

writeFileSync("supabase/seed.sql", sql + "\n");
console.log(`seed.sql: ${allFixturePlans().length}개 일정`);
