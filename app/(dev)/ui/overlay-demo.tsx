"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Dialog } from "@/components/ui/dialog";

export function OverlayDemo() {
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button data-testid="sheet-open" variant="secondary" onClick={() => setSheet(true)}>
        시트 열기
      </Button>
      <Button data-testid="dialog-open" variant="secondary" onClick={() => setDialog(true)}>
        삭제 확인
      </Button>
      <span className="text-caption text-secondary">
        <b data-testid="delete-result">{deleted ? "지웠어요" : "안 지웠어요"}</b>
      </span>

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="흑돼지 명가">
        <p className="mt-1 text-label text-secondary">제주 서귀포시 중앙로 45</p>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" block>주소 복사</Button>
          <Button block>카카오맵으로 길찾기</Button>
        </div>
      </BottomSheet>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        onConfirm={() => { setDeleted(true); setDialog(false); }}
        tone="danger"
        title="이 일정을 지울까요?"
        description="지우면 공유한 링크도 함께 사라져요. 되돌릴 수 없어요."
        confirmLabel="삭제할게요"
        cancelLabel="그대로 둘게요"
      />
    </div>
  );
}
