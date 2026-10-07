/**
 * @file DB 행 → ViewerPlan
 * @description 조립을 한 자리에 둔다. 이 변환이 여러 파일로 흩어지면
 *              공개 DTO의 모양이 조용히 갈라진다.
 *
 * null 규약: DB의 NULL이 곧 ViewerPlan의 null이다. 빈 문자열로 바꾸지 않는다 —
 * partyLabel·memo·coverImageUrl이 전부 "없음"을 null로 표현한다.
 */
import type { ViewerDay, ViewerItem, ViewerPlace, ViewerPlan } from "@/shared/types/viewer";

export type PlanRow = {
  slug: string; title: string; plan_type: string; party_label: string | null;
  start_date: string; end_date: string; cover_image_url: string | null;
};
export type PlaceRow = {
  id: string; name: string; address: string; lat: number | null; lng: number | null;
  memo: string | null; tags: string[]; is_pinned: boolean;
};
export type NoticeRow = { id: string; title: string; body: string };
export type DayRow = { id: string; day_number: number; date: string };
export type ItemRow = {
  id: string; day_id: string; start_time: string; duration_min: number | null;
  activity_name: string; memo: string | null; place_id: string | null;
};
export type TransportRow = {
  id: string; place_id: string | null; mode: string; from_label: string;
  to_label: string; duration_label: string; note: string | null;
};

export type PlanRowSet = {
  plan: PlanRow; places: PlaceRow[]; notices: NoticeRow[];
  days: DayRow[]; items: ItemRow[]; transport: TransportRow[];
};

function toPlace(r: PlaceRow): ViewerPlace {
  return {
    id: r.id, name: r.name, address: r.address, lat: r.lat, lng: r.lng,
    memo: r.memo, tags: r.tags, isPinned: r.is_pinned,
  };
}

export function assemblePlan(set: PlanRowSet): ViewerPlan {
  const places = set.places.map(toPlace);
  // 항목이 장소를 **참조**한다. 사본을 만들던 시절의 syncEmbedded가 필요 없어진 자리다.
  const byPlaceId = new Map(places.map((p) => [p.id, p]));

  const days: ViewerDay[] = set.days.map((d) => ({
    dayNumber: d.day_number,
    date: d.date,
    items: set.items
      .filter((it) => it.day_id === d.id)
      .map(
        (it): ViewerItem => ({
          id: it.id,
          // Postgres time은 "10:30:00"으로 온다. ViewerItem.startTime은 "HH:MM"이다.
          startTime: it.start_time.slice(0, 5),
          durationMin: it.duration_min,
          activityName: it.activity_name,
          memo: it.memo,
          place: it.place_id ? byPlaceId.get(it.place_id) ?? null : null,
        }),
      ),
  }));

  return {
    slug: set.plan.slug,
    title: set.plan.title,
    planType: set.plan.plan_type,
    partyLabel: set.plan.party_label,
    startDate: set.plan.start_date,
    endDate: set.plan.end_date,
    coverImageUrl: set.plan.cover_image_url,
    notices: set.notices.map((n) => ({ id: n.id, title: n.title, body: n.body })),
    days,
    places,
    transport: set.transport.map((t) => ({
      id: t.id, placeId: t.place_id, mode: t.mode, fromLabel: t.from_label,
      toLabel: t.to_label, durationLabel: t.duration_label, note: t.note,
    })),
  };
}
