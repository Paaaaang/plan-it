"use client";

import { ViewerShell } from "@/client/components/viewer/viewer-shell";
import type { ViewerPlan } from "@/shared/types/viewer";

/**
 * 참가자가 보는 화면. **확정된 뷰어 컴포넌트를 그대로 쓴다**(스펙 §5.2).
 *
 * 미리보기 전용 뷰어를 따로 만들면 두 화면이 반드시 어긋난다 — 뷰어를 고칠 때마다
 * 여기도 고쳐야 하는데, 안 고쳐도 아무 테스트가 깨지지 않는다(그게 어긋나는 방식이다).
 *
 * 셸을 고치지 않아도 이게 되는 이유는 2단계에서 미리 치운 덕이다(`app/p/layout.tsx` 헤더):
 * 셸은 `min-h-dvh`로 브라우저 뷰포트를 재지 않고 부모를 채우기만 하며, `<html>`에 걸던
 * 전역 `<style>`은 뷰어 라우트 레이아웃으로 옮겼다. 그래서 프레임에 높이를 주고 넣으면 된다.
 *
 * 안쪽에 스크롤을 따로 주는 이유: 하단 CTA가 `sticky bottom-0`이라 **스크롤 컨테이너가
 * 있어야** 제자리에 선다. 프레임 자체는 `overflow-hidden`으로 모서리를 자른다.
 *
 * 크기는 **높이를 부모가 주고 폭은 비율이 정한다**(390:844 = 뷰어 기준 뷰포트).
 * 높이를 박아 두면 큰 화면에서 오른쪽 열에 빈 자리가 남고, 반대로 열을 통째로 채우게
 * 두면 폰이 아니라 기둥이 되어 "참가자 화면에 이만큼 들어간다"는 말이 거짓이 된다.
 * 비율을 고정하면 열을 채우면서도 그 말이 계속 참이다.
 */
export function PreviewPane({ plan }: { plan: ViewerPlan }) {
  return (
    <div
      data-testid="editor-preview"
      className="aspect-[390/844] h-full w-auto max-w-full overflow-hidden rounded-sheet border border-default bg-bg shadow-pop"
    >
      <div className="h-full overflow-y-auto">
        <ViewerShell plan={plan} />
      </div>
    </div>
  );
}
