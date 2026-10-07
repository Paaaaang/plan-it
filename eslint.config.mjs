import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // I5(spec §12): 콘솔 액션(RLS로 소유권을 지키는 경로)은 service-role 클라이언트를
  // 쓰면 안 된다 — adminClient()는 RLS를 통째로 우회한다. 지금은 import 한 줄이면
  // 누구나 조용히 뚫을 수 있는데 그걸 잡는 테스트·타입에러·lint가 전부 없었다. 정당한
  // 호출부(공개 뷰어 actions/viewer-actions.ts, 커버 라우트, 테스트 라우트, lib/store/plans.ts의
  // reseedPlan)는 이 다섯 파일 밖이라 그대로 통과한다.
  {
    files: [
      "actions/plan-actions.ts",
      "actions/notice-actions.ts",
      "actions/place-actions.ts",
      "actions/schedule-actions.ts",
      "actions/transport-actions.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/supabase/admin",
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
