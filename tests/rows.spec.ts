import { test, expect } from '@playwright/test';
import { assemblePlan, type PlanRowSet } from '../lib/store/rows';

/**
 * 조립 변환은 화면 없이 판정할 수 있는 유일한 조각이다. 나머지는 E2E가 본다.
 * 프로젝트 둘(desktop/mobile)에서 같은 단언을 두 번 돌릴 이유가 없다.
 */
test.skip(({ isMobile }) => isMobile, '순수 변환이라 한 번만 돌린다.');

const base: PlanRowSet = {
  plan: {
    slug: 'x', title: '제목', plan_type: '여행', party_label: null,
    start_date: '2026-01-01', end_date: '2026-01-02', cover_image_url: null,
  },
  places: [{ id: 'p1', name: '카페', address: '주소', lat: null, lng: null, memo: null, tags: [], is_pinned: true }],
  notices: [{ id: 'n1', title: '공지', body: '본문' }],
  days: [{ id: 'd1', day_number: 1, date: '2026-01-01' }],
  items: [{ id: 'i1', day_id: 'd1', start_time: '10:30:00', duration_min: 60, activity_name: '집결', memo: null, place_id: 'p1' }],
  transport: [],
};

test('Postgres time을 HH:MM으로 자른다', async () => {
  // "10:30:00"이 그대로 화면에 가면 시안의 시각 칸이 깨진다.
  expect(assemblePlan(base).days[0].items[0].startTime).toBe('10:30');
});

test('항목이 장소 객체를 참조한다 — 사본이 아니다', async () => {
  const plan = assemblePlan(base);
  // 같은 객체여야 한다. 사본이면 장소를 고쳤을 때 둘이 갈라진다(syncEmbedded가 있던 이유).
  expect(plan.days[0].items[0].place).toBe(plan.places[0]);
});

test('없는 장소를 가리키면 연결이 끊긴 것으로 본다', async () => {
  const set = { ...base, items: [{ ...base.items[0], place_id: 'gone' }] };
  // 깨진 객체를 내보내느니 "장소 미연결"이 맞다.
  expect(assemblePlan(set).days[0].items[0].place).toBeNull();
});

test('NULL은 null로 남는다 — 빈 문자열로 바꾸지 않는다', async () => {
  const plan = assemblePlan(base);
  expect(plan.partyLabel).toBeNull();
  expect(plan.coverImageUrl).toBeNull();
});
