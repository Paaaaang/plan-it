import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // I5(spec §12): 콘솔 액션(RLS로 소유권을 지키는 경로)은 service-role 클라이언트를
  // 쓰면 안 된다 — adminClient()는 RLS를 통째로 우회한다. 지금은 import 한 줄이면
  // 누구나 조용히 뚫을 수 있는데 그걸 잡는 테스트·타입에러·lint가 전부 없었다. 정당한
  // 호출부(공개 뷰어 src/server/actions/viewer-actions.ts, 커버 라우트, 테스트 라우트,
  // src/server/store/plans.ts의 reseedPlan)는 이 다섯 파일 밖이라 그대로 통과한다.
  //
  // src/ 레이아웃 이전: 경로가 "actions/*.ts"에서 "src/server/actions/*.ts"로,
  // import 대상이 "@/lib/supabase/admin"에서 "@/server/supabase/admin"으로 바뀌었다.
  // 여길 안 고치면 글롭이 조용히 매칭을 멈춘다 — no-error, no-warning, 그냥 안 걸린다.
  {
    files: [
      "src/server/actions/plan-actions.ts",
      "src/server/actions/notice-actions.ts",
      "src/server/actions/place-actions.ts",
      "src/server/actions/schedule-actions.ts",
      "src/server/actions/transport-actions.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/server/supabase/admin",
              message:
                "콘솔 액션은 service-role 클라이언트(RLS 우회)를 쓰면 안 된다 — createServerClient()(사용자 JWT)를 쓴다.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 디자인 시스템 핸드오프 번들 — 원본 프로토타입이라 린트 대상 아님.
    "planit-design-system/**",
  ]),
]);

export default eslintConfig;
