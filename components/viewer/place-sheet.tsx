/**
 * @file 장소 상세 시트
 * @description 타임라인·장소 목록에서 장소를 누르면 뜨는 바텀시트.
 *              액션은 셋이고 코랄은 하나뿐이다(스펙 §5.1) — 카카오맵 길찾기만 primary,
 *              주소 복사와 네이버 지도는 회색(secondary)이다. 참가자가 지금 눌러야 할
 *              것 하나만 색을 갖는다.
 *
 * @connects
 *  - components/ui/bottom-sheet.tsx · button.tsx · chip.tsx · icon.tsx
 *  - lib/viewer/links.ts → kakaoDirectionsUrl, naverMapUrl
 */

"use client";

import { useState } from "react";
import { Copy, MapPin, Navigation } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { kakaoDirectionsUrl, naverMapUrl } from "@/lib/viewer/links";
import type { ViewerPlace } from "@/types/viewer";

export function PlaceSheet({ place, onClose }: { place: ViewerPlace | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    if (!place) return;
    try {
      await navigator.clipboard.writeText(place.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드가 막힌 브라우저도 있다. 조용히 넘어간다 — 주소는 화면에 이미 보인다.
    }
  }

  return (
    <BottomSheet open={!!place} onClose={onClose} title={place?.name}>
      {place && (
        <>
          {place.tags.length > 0 && (
            <div className="mt-2 flex gap-1.5">
              {place.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          )}
          <p className="mt-2 flex items-start gap-1.5 text-label text-secondary">
            <Icon name={MapPin} size={15} className="mt-0.5 flex-none text-tertiary" />
            <span>{place.address}</span>
          </p>
          {place.memo && <p className="mt-2.5 text-label text-secondary">{place.memo}</p>}

          <div className="mt-4 flex flex-col gap-2" data-testid="sheet-actions">
            {/* 액션 셋 중 코랄은 이 하나뿐이다 (스펙 §5.1) */}
            <a
              data-emphasis="brand"
              href={kakaoDirectionsUrl(place)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-btn bg-brand text-label font-bold text-on-accent"
            >
              <Icon name={Navigation} size={16} />
              카카오맵으로 길찾기
            </a>
            <Button variant="secondary" block leadingIcon={<Icon name={Copy} size={16} />} onClick={copyAddress}>
              주소 복사
            </Button>
            <a
              href={naverMapUrl(place)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center rounded-btn bg-neutral-fill text-label font-bold text-primary"
            >
              네이버 지도에서 보기
            </a>
          </div>

          {copied && (
            <p role="status" className="mt-2.5 text-center text-caption text-secondary">
              주소를 복사했어요
            </p>
          )}
        </>
      )}
    </BottomSheet>
  );
}
