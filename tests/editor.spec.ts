import { test, expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/**
 * 편집기는 데스크톱 서페이스다(스펙 §5.2 — 1024px 미만은 1단으로 접히고 미리보기가
 * 하단 시트로 내려간다). iPhone 14 프로젝트에서 같은 단언을 두 번 돌릴 이유가 없고,
 * 두 프로젝트가 같은 dev 서버의 **같은 Postgres**를 병렬로 때리면 아래 쓰기
 * 테스트가 서로를 오염시킨다.
 */
test.skip(({ isMobile }) => isMobile, '편집기는 데스크톱 서페이스다.');

/**
 * 테스트 격리 — 스토어는 Postgres다(src/server/store/plans.ts). 세 겹으로 막는다:
 *
 *  1. **각 테스트는 시작할 때 자기 slug를 씨앗부터 다시 세운다**(`reseed`). 끝에서
 *     되돌리는 방식으로는 부족했다: 되돌리기에 닿기 전에 넘어지면 그 값이 **다음 실행까지**
 *     살아남아 엉뚱한 테스트의 첫 단언을 깨뜨린다(실제로 그렇게 터졌다).
 *  2. **쓰기는 전용 slug(`editor-*`)에만** 한다. 뷰어 스펙이 쓰는 slug
 *     (jeju-workshop-2026 · team-offsite · long-day · secret-party · gone)를 건드리지 않는다.
 *     읽기만 하는 단언은 시안 값 그대로 jeju를 쓴다.
 *  3. 한 slug를 두 describe가 나눠 쓰는 자리가 있어(`editor-demo` · `editor-basic`)
 *     **serial**로 돌린다 — 병렬이면 한쪽의 씨앗 뿌리기가 다른 쪽 테스트 중간을 지운다.
 *
 * ponytail: describe마다 전용 slug를 주면 serial을 버리고 병렬로 갈 수 있다. 픽스처
 *   두 개를 더 만드는 값이고, 지금 전체 스위트가 1분이라 아직 그 값을 치를 이유가 없다.
 */
test.describe.configure({ mode: 'serial' });

/**
 * slug를 픽스처 씨앗 값으로 되돌린다(`POST /api/test/reseed/[slug]` — 프로덕션엔 없는 문).
 * Playwright는 브라우저 쪽에서 돌아 서버 프로세스의 `reseedPlan()`(src/server/store/plans.ts)을
 * 직접 부를 수 없어 라우트로 뚫었고, DB 전체가 아니라 그 slug 한 행만 되돌리는 이유는
 * mobile 뷰어 스펙이 같은 dev 서버·같은 DB를 병렬로 쓰기 때문이다.
 */
async function reseed(page: Page, slug: string): Promise<void> {
  const res = await page.request.post(`/api/test/reseed/${slug}`);
  expect(res.status(), `픽스처를 다시 세우지 못했다: ${slug}`).toBe(204);
}

const JEJU = '/dashboard/plans/jeju-workshop-2026/edit';
const DEMO = '/dashboard/plans/editor-demo/edit';

test.describe('편집기 상단 바', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-demo'));

  test('제목·저장 상태·상태 세그먼트·공유 링크가 보인다', async ({ page }) => {
    await page.goto(JEJU);
    await expect(page.getByRole('link', { name: '대시보드' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '일정 제목' })).toHaveValue('제주 워크샵 2026');
    await expect(page.getByTestId('save-status')).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: '공개 상태' })).toBeVisible();
    await expect(page.getByText('/p/jeju-workshop-2026')).toBeVisible();
  });

  test('상태 세그먼트를 화살표 키로 옮길 수 있다', async ({ page }) => {
    await page.goto(DEMO);
    const group = page.getByRole('radiogroup', { name: '공개 상태' });
    await group.getByRole('radio', { name: '공개', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(group.getByRole('radio', { name: '비공개' })).toHaveAttribute('aria-checked', 'true');

    // 되돌린다 — 이 slug를 뒤 테스트가 이어 쓴다.
    await group.getByRole('radio', { name: '공개', exact: true }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
  });

  test('제목을 바꾸면 저장 상태가 바뀐다', async ({ page }) => {
    await page.goto(DEMO);
    const title = page.getByRole('textbox', { name: '일정 제목' });
    await title.fill('편집 데모 2027');
    await title.blur();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');

    // 되돌린다.
    await title.fill('편집 데모');
    await title.blur();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
  });

  test('빈 제목은 서버가 거부하고 이유를 보여준다', async ({ page }) => {
    // 거부되므로 스토어가 바뀌지 않는다 — jeju를 그대로 써도 안전하다.
    await page.goto(JEJU);
    const title = page.getByRole('textbox', { name: '일정 제목' });
    await title.fill('   ');
    await title.blur();
    // 같은 문구가 두 곳에 뜬다 — 상단 바 저장 상태와 1번 섹션의 제목 필드.
    // 필드 쪽 배선은 '기본 정보' 스펙이 본다. 여기서는 상단 바만 본다.
    await expect(page.getByTestId('save-status')).toContainText('제목을 입력해 주세요.');
  });

  test('제목 저장 실패 뒤 세그먼트를 옮겨도 입력값이 거짓말하지 않는다', async ({ page }) => {
    // save 슬롯 하나를 모든 액션이 공유한다 — 세그먼트 이동이 "저장됨"으로
    // 덮어써도 제목 입력엔 저장 안 된 공백이 아니라 마지막 저장 값이 남아야 한다.
    await page.goto(DEMO);
    const title = page.getByRole('textbox', { name: '일정 제목' });
    const savedValue = await title.inputValue();

    await title.fill('   ');
    await title.blur();
    await expect(page.getByTestId('save-status')).toContainText('제목을 입력해 주세요.');

    const group = page.getByRole('radiogroup', { name: '공개 상태' });
    await group.getByRole('radio', { name: '비공개' }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');

    await expect(title).toHaveValue(savedValue);

    // 되돌린다.
    await group.getByRole('radio', { name: '공개', exact: true }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
  });
});

/**
 * 상태 세그먼트가 장식이 아니라는 판정.
 * `setStatus`가 스토어에 쓰고, 뷰어(`getBySlug`)가 그 상태를 읽어야 성립한다.
 */
test.describe('상태가 뷰어를 막는다', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-demo'));

  test('임시저장으로 바꾸면 공개 링크가 닫히고, 공개로 되돌리면 다시 열린다', async ({ page }) => {
    await page.goto(DEMO);
    const group = page.getByRole('radiogroup', { name: '공개 상태' });

    await group.getByRole('radio', { name: '임시저장' }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
    expect((await page.goto('/p/editor-demo'))?.status(), '임시저장 = 기획자만 본다').toBe(404);

    await page.goto(DEMO);
    await group.getByRole('radio', { name: '공개', exact: true }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
    expect((await page.goto('/p/editor-demo'))?.status(), '공개로 되돌리면 다시 열린다').toBe(200);
  });
});

/**
 * 기본 정보 섹션. 쓰기 테스트는 **전용 slug(`editor-basic`)** 에만 한다 —
 * `editor-demo`는 상단 바 테스트가 쓰고 있고, 한 slug에 계속 얹으면 serial 체인이 길어진다.
 * 거부되는 입력은 스토어를 바꾸지 않으므로 읽기 전용 slug(jeju)에 그대로 써도 안전하다.
 */
const BASIC = '/dashboard/plans/editor-basic/edit';

/** "YYYY-MM-DD"에 n일을 더한다. UTC 산술이라 타임존이 끼어들지 않는다. */
function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** 뷰어 날짜 줄이 쓰는 "M.DD" 조각. */
function shortDate(date: string): string {
  const [, m, d] = date.split('-');
  return `${Number(m)}.${d}`;
}

/**
 * 값을 고치고 blur한 뒤 **Server Action 응답이 닿을 때까지** 기다린다.
 *
 * 저장 상태 문구로 기다리면 안 된다: 직전 저장의 "저장됨"이 그대로 남아 있어 조건이
 * 이미 참이고, 다음 단계가 아직 떠나지도 않은 저장을 앞질러 간다. 응답을 기다리면
 * dev 서버가 라우트를 처음 컴파일하느라 느린 순간에도 흔들리지 않는다.
 */
async function saveField(page: Page, field: Locator, value: string): Promise<void> {
  await field.fill(value);
  const landed = page.waitForResponse((r) => r.request().method() === 'POST');
  await field.blur();
  await landed;
}

test.describe('기본 정보', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-basic'));

  test('필드 다섯 개가 현재 값으로 채워져 있다', async ({ page }) => {
    await page.goto(JEJU);
    const section = page.getByTestId('basic-info');
    await expect(section.getByRole('textbox', { name: '제목', exact: true })).toHaveValue('제주 워크샵 2026');
    await expect(page.getByLabel('시작일')).not.toHaveValue('');
    await expect(page.getByLabel('종료일')).not.toHaveValue('');
    await expect(page.getByLabel('유형')).toHaveValue('여행');
    await expect(page.getByLabel('인원')).toHaveValue('디자인팀 12명');
  });

  test('종료일이 시작일보다 빠르면 서버가 거부한다', async ({ page }) => {
    await page.goto(JEJU);
    await page.getByLabel('종료일').fill('2020-01-01');
    await page.getByLabel('종료일').blur();
    // 오류는 그 필드에 붙는다 — 다섯 필드 중 어느 것이 틀렸는지 보여야 한다.
    await expect(page.getByLabel('종료일')).toHaveAttribute('aria-invalid', 'true');
    await expect(
      page.getByTestId('basic-info').getByText('종료일이 시작일보다 빠를 수 없어요.'),
    ).toBeVisible();
  });

  // Task 7(미리보기)이 붙어야 통과한다. 표시만 하고 지우지 않는다.
  test('유형을 바꾸면 미리보기 커버 뱃지가 따라 바뀐다', async ({ page }) => {
    await page.goto(BASIC);
    await page.getByLabel('유형').fill('워크샵');
    await page.getByLabel('유형').blur();
    await expect(page.getByTestId('editor-preview').getByText('워크샵')).toBeVisible();
  });

  /**
   * 상단 바와 폼이 같은 액션을 **서로 다른 스냅샷**으로 부르면, 나중에 저장한 쪽이
   * 먼저 저장한 값을 되돌린다. 두 화면이 하나의 편집 상태를 봐야 한다는 판정이다.
   */
  test('폼에서 날짜를 저장한 뒤 제목을 저장해도 날짜가 되돌아가지 않는다', async ({ page }) => {
    await page.goto(BASIC);
    const start = await page.getByLabel('시작일').inputValue();
    const grown = addDays(start, 2);

    await page.getByLabel('종료일').fill(grown);
    await page.getByLabel('종료일').blur();
    // 일부러 기다리지 않는다. 첫 저장이 돌아오기 전에 두 번째가 떠나는 순간이
    // 정확히 덮어쓰기가 나던 자리다 — RSC가 새 props를 내려주는 것으로는 못 막는다.
    const title = page.getByRole('textbox', { name: '일정 제목' });
    await title.fill('기본 정보 데모 2');
    await title.blur();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');

    await page.reload();
    await expect(page.getByLabel('종료일'), '제목 저장이 날짜를 덮으면 안 된다').toHaveValue(grown);
    await expect(page.getByRole('textbox', { name: '일정 제목' })).toHaveValue('기본 정보 데모 2');

    // 되돌린다.
    await saveField(page, page.getByLabel('종료일'), addDays(start, 1));
    await saveField(page, page.getByRole('textbox', { name: '일정 제목' }), '기본 정보 데모');
  });

  /**
   * 기간과 일차는 한 몸이다. 늘리면 빈 날이 생기고, 시작일을 옮기면 모든 날짜가 밀린다.
   * 빈 날만 사라지는 축소는 허용한다.
   */
  test('기간을 늘리면 일차가 따라 늘고 날짜도 다시 계산된다', async ({ page }) => {
    await page.goto(BASIC);
    const start = await page.getByLabel('시작일').inputValue();

    await saveField(page, page.getByLabel('종료일'), addDays(start, 2));
    await expect(page.getByTestId('save-status')).toContainText('저장됨');

    await page.goto('/p/editor-basic');
    await expect(page.getByRole('button', { name: '3일차', exact: true })).toBeVisible();

    // 시작일을 하루 밀면 (3일 → 2일 축소, 3일차는 비어 있어 허용) 남은 날의 날짜가 밀린다.
    await page.goto(BASIC);
    await saveField(page, page.getByLabel('시작일'), addDays(start, 1));

    await page.goto('/p/editor-basic');
    await expect(page.getByRole('button', { name: '3일차', exact: true })).toHaveCount(0);
    await expect(page.getByText(shortDate(addDays(start, 1)), { exact: false }).first()).toBeVisible();

    // 되돌린다. 시작일을 먼저 당겨 기간을 늘린 뒤 종료일을 줄인다 —
    // 반대 순서면 중간에 일정이 든 날이 잘려 서버가 거부한다.
    await page.goto(BASIC);
    await saveField(page, page.getByLabel('시작일'), start);
    await saveField(page, page.getByLabel('종료일'), addDays(start, 1));
  });

  test('일정이 든 날이 사라지는 축소는 서버가 거부한다', async ({ page }) => {
    await page.goto(BASIC);
    const start = await page.getByLabel('시작일').inputValue();

    await saveField(page, page.getByLabel('종료일'), start);
    await expect(page.getByTestId('basic-info')).toContainText('2일차에 일정이 있어요');

    // 조용히 지우지 않는다 — 스토어는 그대로다.
    await page.goto('/p/editor-basic');
    await expect(page.getByRole('button', { name: '2일차', exact: true })).toBeVisible();
  });
});

test.describe('커버 업로더', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-basic'));

  /** 1×1 PNG. 파일을 저장소에 남기지 않으려고 바이트를 여기서 만든다. */
  const PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );

  /**
   * 16×16 PNG. **뷰어 판정에는 1×1을 쓸 수 없다** — 뷰어 커버는 `next/image`를 지나는데,
   * 1픽셀 원본을 최적화하면 브라우저가 디코딩하지 못하는 결과가 나온다(naturalWidth 0).
   * 업로드 경로만 보는 위 테스트들은 원본 바이트를 그대로 받으므로 1×1로 충분하다.
   */
  const PNG16 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIElEQVR42mP8z8BQz0AEYBxVSF+FjKOhSF+F/xlHfUmSQgCZ9Qz9dEG0IQAAAABJRU5ErkJggg==',
    'base64',
  );

  test('허용 목록 밖 형식은 서버가 거부한다', async ({ page }) => {
    // 클라이언트는 `image/*`까지만 거른다(accept 속성과 같은 기준). GIF는 그 문을
    // 통과하지만 서버 허용 목록(JPG·PNG·WebP)에 없다 — 서버 거부가 화면에 떠야 한다.
    await page.goto(BASIC);
    await page.getByTestId('cover-input').setInputFiles({
      name: 'x.gif',
      mimeType: 'image/gif',
      buffer: Buffer.from('GIF89a'),
    });
    await expect(page.getByTestId('basic-info')).toContainText('JPG·PNG·WebP만 올릴 수 있어요.');
  });

  test('고른 사진이 바로 뜨고 새로고침해도 남는다', async ({ page }) => {
    await page.goto(BASIC);
    await page.getByTestId('cover-input').setInputFiles({
      name: 'cover.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    // 고르는 즉시 로컬 미리보기(objectURL) — 서버 왕복을 기다리지 않는다.
    await expect(page.getByTestId('cover-image')).toHaveAttribute('src', /^blob:/);
    await expect(page.getByTestId('save-status')).toContainText('저장됨');

    await page.reload();
    const image = page.getByTestId('cover-image');
    await expect(image).toHaveAttribute('src', /\/api\/cover\/editor-basic/);
    // **src 문자열은 아무것도 증명하지 않는다.** 서빙 경로가 404여도 속성 값은 그대로다.
    // 브라우저가 실제로 바이트를 받아 디코딩했는지만 본다 — 깨진 이미지면 0이다.
    await expect
      .poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth), {
        message: '커버가 실제로 로드돼야 한다',
      })
      .toBeGreaterThan(0);
  });

  /**
   * 올린 커버를 **공개 뷰어가 실제로 그리는지** 본다. 편집기 미리보기(Task 7)를 붙이기
   * 전까지 이 URL을 `next/image`로 그리는 화면이 없어서 아무도 몰랐다 — 커버를 올린
   * 일정의 공개 링크가 **500**이었다(로컬 이미지의 쿼리 문자열을 Next가 막는다).
   * 편집기가 아니라 뷰어에서 판정한다: 링크를 받은 참가자가 보는 것이 그 화면이다.
   */
  test('올린 커버를 든 공개 뷰어가 열리고 사진이 그려진다', async ({ page }) => {
    await page.goto(BASIC);
    await page.getByTestId('cover-input').setInputFiles({
      name: 'cover.png',
      mimeType: 'image/png',
      buffer: PNG16,
    });
    await expect(page.getByTestId('save-status')).toContainText('저장됨');

    const res = await page.goto('/p/editor-basic');
    expect(res?.status(), '공개 링크가 열려야 한다').toBe(200);
    await expect(page.getByTestId('cover')).toHaveAttribute('data-cover', 'photo');

    // src 문자열은 아무것도 증명하지 않는다 — 브라우저가 바이트를 디코딩했는지만 본다.
    const cover = page.getByTestId('cover').locator('img');
    await expect
      .poll(() => cover.evaluate((el) => (el as HTMLImageElement).naturalWidth), {
        message: '뷰어 커버가 실제로 로드돼야 한다',
      })
      .toBeGreaterThan(0);
  });

  /**
   * 커버는 공개 경로다 — 뷰어와 **같은 규칙**을 따라야 한다.
   * 임시저장은 없는 것으로 답하고(뷰어 404), 비공개는 잠금 뒤에 있다.
   */
  test('공개가 아닌 일정의 커버는 404다', async ({ page }) => {
    await page.goto(BASIC);
    await page.getByTestId('cover-input').setInputFiles({
      name: 'cover.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
    await page.reload();

    const url = (await page.getByTestId('cover-image').getAttribute('src'))!;
    expect(url).toContain('/api/cover/');
    expect((await page.request.get(url)).status(), '공개 일정은 커버가 나간다').toBe(200);

    const group = page.getByRole('radiogroup', { name: '공개 상태' });
    for (const name of ['임시저장', '비공개']) {
      await group.getByRole('radio', { name }).click();
      await expect(page.getByTestId('save-status')).toContainText('저장됨');
      expect((await page.request.get(url)).status(), `${name}은 커버도 막는다`).toBe(404);
    }

    // 되돌린다 — 이 slug를 뒤 테스트가 이어 쓴다.
    await group.getByRole('radio', { name: '공개', exact: true }).click();
    await expect(page.getByTestId('save-status')).toContainText('저장됨');
    expect((await page.request.get(url)).status()).toBe(200);
  });
});

/**
 * 정렬. 쓰기 테스트는 **전용 slug(`editor-sort`)** 에만 한다 — 순서를 바꾸는 테스트가
 * 다른 편집기 slug의 serial 체인에 얹히면 앞 테스트의 되돌리기와 뒤엉킨다.
 *
 * 키보드가 기준선이다: 정렬을 마우스로만 할 수 있으면 접근성 위반이고, 포인터 드래그는
 * Playwright에서 다루기 까다롭다. 그래서 판정은 전부 키보드 경로로 한다.
 */
const SORT = '/dashboard/plans/editor-sort/edit';

/** 그립 버튼. 접근 가능한 이름에 **무엇을** 옮기는지가 들어간다. */
function grip(row: Locator): Locator {
  return row.getByRole('button', { name: /순서 바꾸기/ });
}

/**
 * 공지 행의 제목. **인라인 입력이라 텍스트가 아니라 값이다** — `toContainText`로는 안 보인다.
 * 정렬 판정도 이걸 쓴다(순서를 보는 데 필요한 것은 각 행이 무엇이냐다).
 */
function noticeTitle(row: Locator): Locator {
  return row.getByRole('textbox', { name: '공지 제목' });
}

/** 행의 삭제 버튼. 이름에 어느 공지인지가 들어간다. */
function noticeDelete(row: Locator): Locator {
  return row.getByRole('button', { name: /삭제/ });
}

test.describe('정렬', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-sort'));

  test('그립에 초점을 두고 화살표로 순서를 바꾼다', async ({ page }) => {
    await page.goto(SORT);
    const rows = page.getByTestId('notice-row');
    await expect(noticeTitle(rows.first())).toHaveValue('집결 시간을 꼭 지켜주세요');

    const landed = page.waitForResponse((r) => r.request().method() === 'POST');
    await grip(rows.first()).focus();
    await page.keyboard.press('ArrowDown');

    // 응답을 **일부러 기다리지 않는다** — 낙관적 갱신이 실제로 먼저 도는지 보는 자리다.
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue('준비물');
    // 옮긴 뒤에도 초점이 그 행의 그립에 남아야 한다 — 연속으로 여러 칸 옮길 수 있어야 하므로.
    await expect(grip(page.getByTestId('notice-row').nth(1))).toBeFocused();
    // 목록마다 알림 영역이 하나씩 있다(타임테이블·장소도 같은 컴포넌트를 쓴다) — 섹션 안에서 본다.
    await expect(page.getByTestId('notice-section').getByTestId('sort-status')).toContainText(
      '집결 시간을 꼭 지켜주세요, 2번째로 옮겼어요',
    );
    await landed;

    // 새로고침해도 남는다 = 화면만 바뀐 게 아니라 서버에도 갔다.
    await page.reload();
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue('준비물');

    // 되돌린다.
    const back = page.waitForResponse((r) => r.request().method() === 'POST');
    await grip(page.getByTestId('notice-row').nth(1)).focus();
    await page.keyboard.press('ArrowUp');
    await back;
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue('집결 시간을 꼭 지켜주세요');
  });

  test('맨 위에서 위로는 움직이지 않는다', async ({ page }) => {
    await page.goto(SORT);
    const first = page.getByTestId('notice-row').first();
    const text = await noticeTitle(first).inputValue();
    await grip(first).focus();
    await page.keyboard.press('ArrowUp');
    // 순환하지 않는다 — 정렬은 탭 이동과 달라서 끝에서 감기면 실수하기 쉽다.
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue(text);
    await expect(grip(page.getByTestId('notice-row').first())).toBeFocused();
  });

  /**
   * 서버 거부. 낡은 목록을 들고 있는 클라이언트를 흉내낸다 — 보내는 id 하나를 없는 id로
   * 바꾸면 `reorderByIds`가 집합 불일치로 거부한다(src/shared/editor/validate.ts).
   * 화면은 낙관적으로 이미 바뀌어 있으므로 **되돌리고 이유를 보여줘야** 한다.
   */
  test('서버가 거부하면 순서를 되돌리고 이유를 보여준다', async ({ page }) => {
    await page.goto(SORT);
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue('집결 시간을 꼭 지켜주세요');

    await page.route('**/dashboard/plans/editor-sort/edit', async (route) => {
      const request = route.request();
      const body = request.method() === 'POST' ? request.postData() : null;
      if (!body?.includes('s-n3')) return route.continue();
      // 길이를 맞춰 바꾼다 — 본문 길이가 달라지면 요청 자체가 깨져 판정이 흐려진다.
      await route.continue({ postData: body.replace('s-n3', 's-n9') });
    });

    const landed = page.waitForResponse((r) => r.request().method() === 'POST');
    await grip(page.getByTestId('notice-row').first()).focus();
    await page.keyboard.press('ArrowDown');
    await landed;

    await expect(page.getByTestId('toast')).toContainText('목록이 바뀌었어요');
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue('집결 시간을 꼭 지켜주세요');
    // 화면을 못 보는 사람은 토스트를 못 본다 — 알림이 "옮겼어요"에서 멈추면
    // 스크린리더가 일어나지 않은 일을 사실로 말한다.
    await expect(page.getByTestId('notice-section').getByTestId('sort-status')).toContainText(
      '집결 시간을 꼭 지켜주세요, 순서를 되돌렸어요',
    );

    // 스토어는 그대로다 — 거부는 아무것도 쓰지 않는다.
    await page.unroute('**/dashboard/plans/editor-sort/edit');
    await page.reload();
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue('집결 시간을 꼭 지켜주세요');
  });

  /**
   * 롤백 경합. 거부되는 저장 A가 아직 날아가는 중에 사용자가 또 옮기면(B, 성공),
   * A의 롤백이 **B가 만든 순서까지** 되감는다. 아무 오류도 뜨지 않아
   * 화면과 서버가 조용히 어긋난 채로 남는다.
   */
  test('롤백이 그 사이 성공한 이동을 지우지 않는다', async ({ page }) => {
    await page.goto(SORT);
    const rows = page.getByTestId('notice-row');
    await expect(noticeTitle(rows.first())).toHaveValue('집결 시간을 꼭 지켜주세요');

    let seen = 0;
    await page.route('**/dashboard/plans/editor-sort/edit', async (route) => {
      const request = route.request();
      const body = request.method() === 'POST' ? request.postData() : null;
      if (!body?.includes('s-n3')) return route.continue();
      // 첫 저장(A)만 거부시키고 늦게 돌려준다. 그 지연 동안 B가 떠난다.
      if (++seen > 1) return route.continue();
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await route.continue({ postData: body.replace('s-n3', 's-n9') });
    });

    await grip(rows.first()).focus();
    await page.keyboard.press('ArrowDown'); // A — 서버가 거부한다
    await expect(noticeTitle(rows.first())).toHaveValue('준비물');
    await page.keyboard.press('ArrowDown'); // B — 서버가 받아들인다

    await expect(page.getByTestId('toast')).toContainText('목록이 바뀌었어요');

    // B가 만든 순서다. A의 롤백이 이걸 되감으면 안 된다.
    const expected = ['준비물', '회비', '집결 시간을 꼭 지켜주세요'];
    for (const [i, text] of expected.entries()) {
      await expect(noticeTitle(rows.nth(i)), 'B의 성공한 이동이 남아야 한다').toHaveValue(text);
    }

    await page.unroute('**/dashboard/plans/editor-sort/edit');
    await page.reload();
    for (const [i, text] of expected.entries()) {
      await expect(noticeTitle(rows.nth(i)), '화면과 서버 순서가 같아야 한다').toHaveValue(text);
    }

    // 되돌린다 — 집결을 맨 위로 두 칸 올린다.
    for (const at of [2, 1]) {
      const back = page.waitForResponse((r) => r.request().method() === 'POST');
      await grip(rows.nth(at)).focus();
      await page.keyboard.press('ArrowUp');
      await back;
    }
    await expect(noticeTitle(rows.first())).toHaveValue('집결 시간을 꼭 지켜주세요');
  });

  /**
   * 포인터 경로. 키보드 경로가 기준선이고 이건 그 위에 얹은 편의지만, 배선이 죽어도
   * 아무도 모르는 채로 두지 않으려고 한 번은 실제로 끌어 본다.
   */
  test('그립을 끌어 첫 행을 맨 아래로 옮긴다', async ({ page }) => {
    await page.goto(SORT);
    const rows = page.getByTestId('notice-row');
    await expect(noticeTitle(rows.first())).toHaveValue('집결 시간을 꼭 지켜주세요');

    const handle = (await grip(rows.first()).boundingBox())!;
    const last = (await rows.nth(2).boundingBox())!;
    const x = handle.x + handle.width / 2;

    await page.mouse.move(x, handle.y + handle.height / 2);
    await page.mouse.down();
    await page.mouse.move(x, handle.y + 20, { steps: 5 });
    // 끌리는 행은 코랄 배경 + 들린 그림자다 (스펙 §5.2).
    await expect(rows.first()).toHaveClass(/bg-brand-weak/);

    await page.mouse.move(x, last.y + last.height, { steps: 8 });
    const landed = page.waitForResponse((r) => r.request().method() === 'POST');
    await page.mouse.up();
    await landed;

    await page.reload();
    await expect(noticeTitle(rows.nth(2))).toHaveValue('집결 시간을 꼭 지켜주세요');

    // 되돌린다 — 두 칸을 키보드로 올린다.
    for (const at of [2, 1]) {
      const back = page.waitForResponse((r) => r.request().method() === 'POST');
      await grip(rows.nth(at)).focus();
      await page.keyboard.press('ArrowUp');
      await back;
    }
    await expect(noticeTitle(rows.first())).toHaveValue('집결 시간을 꼭 지켜주세요');
  });

  /**
   * 드래그 중 스크롤. 포인터 좌표는 뷰포트 기준인데 행 위치 스냅샷이 pointerdown 시점이면
   * 굴린 만큼 어긋나, 손가락 밑이 아닌 자리에 드롭이 확정된다. 항목이 22개인 타임테이블
   * (Task 6)에서는 굴리지 않고 끝까지 끌 수가 없으니 그때 바로 터진다.
   *
   * 스크롤 주체는 window가 아니라 편집기 본문(editor-shell의 `overflow-y-auto`)이다 —
   * 셸이 `h-dvh`라 창은 애초에 구르지 않는다.
   */
  test('드래그 중에 본문을 굴려도 끌리는 행이 포인터를 따라온다', async ({ page }) => {
    await page.goto(SORT);
    const rows = page.getByTestId('notice-row');
    await expect(noticeTitle(rows.first())).toHaveValue('집결 시간을 꼭 지켜주세요');

    const handle = (await grip(rows.first()).boundingBox())!;
    const x = handle.x + handle.width / 2;
    const y = handle.y + handle.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + 20, { steps: 3 });
    const held = (await rows.first().boundingBox())!.y;

    await page.mouse.wheel(0, 120);
    await expect
      .poll(() => page.evaluate(() => document.querySelector('main')!.scrollTop), {
        message: '본문이 실제로 굴러야 이 판정이 의미가 있다',
      })
      .toBe(120);

    // 손가락은 움직이지 않았다 → 끌리는 행도 화면에서 그 자리에 있어야 한다.
    expect((await rows.first().boundingBox())!.y).toBeCloseTo(held, 0);

    // 그리고 드롭은 손가락 밑 자리에 확정된다: 움직인 거리는 포인터 20 + 스크롤 120 = 140px,
    // 한 칸이 73px(행 65 + 간격 8)이니 한 칸 아래다. 고치기 전에는 20px만 셌으므로 제자리였다.
    const landed = page.waitForResponse((r) => r.request().method() === 'POST');
    await page.mouse.up();
    await landed;
    await expect(noticeTitle(rows.nth(1))).toHaveValue('집결 시간을 꼭 지켜주세요');
    // 되돌리지 않는다 — 다음 테스트가 beforeEach에서 씨앗부터 다시 세운다.
  });

  test('순서 변경이 미리보기에 반영된다', async ({ page }) => {
    await page.goto(SORT);
    await grip(page.getByTestId('notice-row').first()).focus();
    await page.keyboard.press('ArrowDown');
    // 공지 요약은 각 공지의 첫 구절을 · 로 이은 것이다 (스펙 §7.6)
    await expect(page.getByTestId('editor-preview')).toContainText('준비물 · 집결 시간을 꼭 지켜주세요');
  });
});

/**
 * 공지. 쓰기 테스트는 **전용 slug(`editor-notice`)** 에만 한다 — 추가·삭제는 목록 자체를
 * 바꾸므로 정렬 데모(editor-sort)에 얹으면 거기 순서 판정이 무너진다.
 *
 * 각 테스트는 끝나기 전에 되돌린다. serial 블록은 재시도할 때 처음부터 다시 도는데,
 * 앞 테스트가 행을 하나 남기면 그 재시도가 자기 첫 단언에서 넘어진다.
 */
const NOTICE = '/dashboard/plans/editor-notice/edit';
/** 공지 0개 픽스처(스펙 §9-6). 뷰어만이 아니라 편집기에서도 빈 상태가 보여야 한다. */
const NO_NOTICE = '/dashboard/plans/long-day/edit';

/** 2번 섹션 통째. 헤더의 개수("3개")가 여기 들어 있다 — 알맹이가 아니라 서버가 센 값이다. */
function noticeSection(page: Page): Locator {
  return page.locator('section').filter({ has: page.getByTestId('notice-section') });
}

/** Server Action 한 번이 돌아오길 기다린다. 저장 상태 문구로 기다리면 직전 저장의 문구에 속는다. */
function posted(page: Page): Promise<unknown> {
  return page.waitForResponse((r) => r.request().method() === 'POST');
}

test.describe('공지', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-notice'));

  test('공지가 없으면 빈 상태를 보여준다', async ({ page }) => {
    await page.goto(NO_NOTICE);
    await expect(page.getByTestId('notice-row')).toHaveCount(0);
    await expect(page.getByTestId('notice-empty')).toBeVisible();
    // 빈 상태에서도 시작할 길이 있어야 한다.
    await expect(page.getByRole('button', { name: '공지 추가' })).toBeVisible();
  });

  test('공지를 추가하면 목록과 개수가 늘어난다', async ({ page }) => {
    await page.goto(NOTICE);
    const rows = page.getByTestId('notice-row');
    await expect(rows).toHaveCount(3);
    await expect(noticeSection(page)).toContainText('3개');

    let landed = posted(page);
    await page.getByRole('button', { name: '공지 추가' }).click();
    await landed;
    await expect(rows).toHaveCount(4);
    // 개수는 서버가 센다 — 화면만 늘어나고 서버가 그대로면 여기서 잡힌다.
    await expect(noticeSection(page)).toContainText('4개');
    // 새 행의 제목에 초점이 간다. 이름이 "새 공지"인 채로 두라는 화면이 아니다.
    await expect(noticeTitle(rows.nth(3))).toBeFocused();
    await expect(noticeTitle(rows.nth(3))).toHaveValue('새 공지');

    // 되돌린다.
    await noticeDelete(rows.nth(3)).click();
    landed = posted(page);
    await page.getByTestId('dialog-panel').getByRole('button', { name: '삭제' }).click();
    await landed;
    await expect(rows).toHaveCount(3);
  });

  test('공지를 지우면 확인을 먼저 받는다', async ({ page }) => {
    await page.goto(NOTICE);
    const rows = page.getByTestId('notice-row');
    // 픽스처 셋 중 하나를 지우면 되돌릴 때 id가 바뀐다(뒤 테스트가 id를 쓴다).
    // 그래서 지울 행을 하나 만들어 두고 그걸 지운다 — 판정(확인을 먼저 받는가)은 같다.
    let landed = posted(page);
    await page.getByRole('button', { name: '공지 추가' }).click();
    await landed;
    await expect(rows).toHaveCount(4);

    await noticeDelete(rows.nth(3)).click();
    const dialog = page.getByTestId('dialog-panel');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: '취소' }).click();
    await expect(dialog).toHaveCount(0);
    await expect(rows, '취소했으면 아무것도 지워지지 않는다').toHaveCount(4);

    await noticeDelete(rows.nth(3)).click();
    landed = posted(page);
    await page.getByTestId('dialog-panel').getByRole('button', { name: '삭제' }).click();
    await landed;
    await expect(rows).toHaveCount(3);
  });

  test('제목을 고치고 blur하면 저장된다', async ({ page }) => {
    await page.goto(NOTICE);
    await saveField(page, noticeTitle(page.getByTestId('notice-row').first()), '집결 시간 변경');

    await page.reload();
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue('집결 시간 변경');

    // 되돌린다.
    await saveField(
      page,
      noticeTitle(page.getByTestId('notice-row').first()),
      '집결 시간을 꼭 지켜주세요',
    );
  });

  /**
   * 거부 ①. 클라이언트에 maxLength를 걸지 않는다 — 서버 검증이 진짜고, 걸어 두면 이 경로가
   * 화면에서 도달 불가가 되어 검증이 죽어도 아무도 모른다.
   */
  test('60자가 넘는 제목은 서버가 거부하고 값을 되돌린다', async ({ page }) => {
    await page.goto(NOTICE);
    const first = page.getByTestId('notice-row').first();
    const before = await noticeTitle(first).inputValue();

    await saveField(page, noticeTitle(first), '가'.repeat(61));
    await expect(page.getByTestId('toast')).toContainText('제목은 60자까지 쓸 수 있어요.');
    // 저장 안 된 값을 화면에 둔 채로 남기면 다음 저장이 그 값을 밀어 넣는다.
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue(before);

    await page.reload();
    await expect(noticeTitle(page.getByTestId('notice-row').first())).toHaveValue(before);
  });

  /**
   * 거부 ②. 다른 탭이 이미 지운 공지를 지우는 상황을 흉내낸다 — 보내는 id를 없는 id로
   * 바꾼다(길이를 맞춰야 본문이 깨지지 않는다).
   */
  test('없는 공지를 지우면 서버가 거부하고 목록이 그대로다', async ({ page }) => {
    await page.goto(NOTICE);
    const rows = page.getByTestId('notice-row');
    await expect(rows).toHaveCount(3);

    await page.route('**/dashboard/plans/editor-notice/edit', async (route) => {
      const request = route.request();
      const body = request.method() === 'POST' ? request.postData() : null;
      if (!body?.includes('n-n1')) return route.continue();
      await route.continue({ postData: body.replace('n-n1', 'n-n9') });
    });

    await noticeDelete(rows.first()).click();
    const landed = posted(page);
    await page.getByTestId('dialog-panel').getByRole('button', { name: '삭제' }).click();
    await landed;

    await expect(page.getByTestId('toast')).toContainText('공지를 찾을 수 없어요.');
    await expect(rows).toHaveCount(3);

    await page.unroute('**/dashboard/plans/editor-notice/edit');
    await page.reload();
    await expect(rows, '거부는 아무것도 쓰지 않는다').toHaveCount(3);
  });

  /**
   * 액션이 **응답이 아니라 예외로** 끝나는 경우(네트워크 끊김). 결과를 보고 분기하는 코드는
   * 여기서 전부 건너뛴다 — 저장 상태는 "저장 중"에 굳고, 낙관적으로 바꾼 순서는
   * 롤백 가드에 닿지 못한 채 화면에 남는다.
   */
  test('네트워크가 끊기면 오류를 보여주고 낙관적 순서를 되돌린다', async ({ page }) => {
    await page.goto(NOTICE);
    const rows = page.getByTestId('notice-row');
    await expect(noticeTitle(rows.first())).toHaveValue('집결 시간을 꼭 지켜주세요');

    await page.route('**/dashboard/plans/editor-notice/edit', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      await route.abort('failed');
    });

    await grip(rows.first()).focus();
    await page.keyboard.press('ArrowDown');

    await expect(page.getByTestId('save-status')).toContainText('저장하지 못했어요');
    await expect(noticeTitle(rows.first()), '되돌아와야 한다').toHaveValue('집결 시간을 꼭 지켜주세요');
    await expect(page.getByTestId('notice-section').getByTestId('sort-status')).toContainText(
      '순서를 되돌렸어요',
    );

    await page.unroute('**/dashboard/plans/editor-notice/edit');
    await page.reload();
    await expect(noticeTitle(rows.first())).toHaveValue('집결 시간을 꼭 지켜주세요');
  });

  /** 인라인 편집도 같은 자리에서 끊길 수 있다. 값이 저장된 것처럼 남으면 안 된다. */
  test('네트워크가 끊기면 인라인 편집 값을 되돌린다', async ({ page }) => {
    await page.goto(NOTICE);
    const title = noticeTitle(page.getByTestId('notice-row').first());
    const before = await title.inputValue();

    await page.route('**/dashboard/plans/editor-notice/edit', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      await route.abort('failed');
    });

    await title.fill('끊긴 저장');
    await title.blur();
    await expect(page.getByTestId('toast')).toContainText('저장하지 못했어요');
    await expect(title).toHaveValue(before);

    await page.unroute('**/dashboard/plans/editor-notice/edit');
  });
});

/**
 * 타임테이블(3번) · 장소(4번). 두 섹션이 서로의 데이터를 만지므로(장소를 지우면 그 장소를
 * 쓰던 항목의 연결이 끊긴다) **전용 slug(`editor-tt`)** 하나를 같이 쓴다 — 둘을 갈라 놓으면
 * 정작 그 연결이 끊기는 경로를 볼 수 없다. 각 테스트는 beforeEach에서 씨앗부터 다시 세운다.
 */
const TT = '/dashboard/plans/editor-tt/edit';

/** 타임테이블 행의 활동명. 공지와 같은 이유로 텍스트가 아니라 값이다(인라인 입력). */
function itemName(row: Locator): Locator {
  return row.getByRole('textbox', { name: '일정 이름' });
}

/** 장소 칩. 연결되면 장소 이름, 미연결이면 "장소 연결"이 보인다. */
function placeChip(row: Locator): Locator {
  return row.getByRole('button', { name: /장소 (연결|바꾸기)/ });
}

test.describe('타임테이블', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-tt'));

  test('일차 칩으로 날짜를 바꾸면 행과 카운트가 바뀐다', async ({ page }) => {
    await page.goto(TT);
    const rows = page.getByTestId('item-row');
    await expect(rows).toHaveCount(3);
    await expect(page.getByText('1일차 · 3개')).toBeVisible();

    await page.getByTestId('editor-day-chips').getByRole('button', { name: '2일차' }).click();
    await expect(rows).toHaveCount(2);
    await expect(page.getByText('2일차 · 2개')).toBeVisible();
    await expect(itemName(rows.first())).toHaveValue('회고');
  });

  test('장소 미연결 행은 장소 연결 칩으로 남는다', async ({ page }) => {
    await page.goto(TT);
    const walk = page.getByTestId('item-row').filter({ has: page.getByRole('textbox', { name: '일정 이름' }) }).nth(2);
    await expect(itemName(walk)).toHaveValue('산책');
    await expect(placeChip(walk)).toHaveText('장소 연결');
    // 연결된 행은 장소 이름을 보여준다 — 같은 자리, 다른 값이다.
    await expect(placeChip(page.getByTestId('item-row').first())).toHaveText('연남 카페');
  });

  test('잘못된 시간은 서버가 거부하고 값을 되돌린다', async ({ page }) => {
    await page.goto(TT);
    const time = page.getByTestId('item-row').first().getByRole('textbox', { name: '시작 시간' });
    await time.fill('99:99');
    await time.blur();
    await expect(page.getByTestId('toast')).toContainText('00:00 ~ 23:59');
    // 저장 안 된 값을 화면에 남기면 다음 저장이 사용자가 본 적 없는 값을 밀어 넣는다.
    await expect(time).toHaveValue('10:00');
  });

  test('장소 연결 시트에서 장소를 고르면 칩이 바뀐다', async ({ page }) => {
    await page.goto(TT);
    const walk = page.getByTestId('item-row').nth(2);
    await placeChip(walk).click();

    const sheet = page.getByTestId('sheet-panel');
    await expect(sheet).toBeVisible();
    const landed = posted(page);
    await sheet.getByRole('button', { name: /경의선숲길/ }).click();
    await landed;

    await expect(placeChip(walk)).toHaveText('경의선숲길');
    await expect(sheet).toBeHidden();

    // 서버에 갔는지 본다 — 낙관적 표시만으로는 알 수 없다.
    await page.reload();
    await expect(placeChip(page.getByTestId('item-row').nth(2))).toHaveText('경의선숲길');
  });

  test('일정을 추가하면 행이 늘고 새 행으로 초점이 간다', async ({ page }) => {
    await page.goto(TT);
    const rows = page.getByTestId('item-row');
    const landed = posted(page);
    await page.getByRole('button', { name: '일정 추가' }).click();
    await landed;

    await expect(rows).toHaveCount(4);
    await expect(itemName(rows.nth(3))).toBeFocused();
  });

  test('일정을 지우면 확인을 먼저 받는다', async ({ page }) => {
    await page.goto(TT);
    const rows = page.getByTestId('item-row');
    await rows.first().getByRole('button', { name: /삭제/ }).click();

    await expect(page.getByTestId('dialog-panel')).toContainText('모여서 커피');
    const landed = posted(page);
    await page.getByRole('button', { name: '삭제', exact: true }).click();
    await landed;

    await expect(rows).toHaveCount(2);
    await expect(itemName(rows.first())).toHaveValue('오전 세션');
  });

  test('그립에 초점을 두고 화살표로 순서를 바꾼다', async ({ page }) => {
    await page.goto(TT);
    const rows = page.getByTestId('item-row');
    const landed = posted(page);
    await grip(rows.first()).focus();
    await page.keyboard.press('ArrowDown');
    await landed;

    await expect(itemName(rows.first())).toHaveValue('오전 세션');
    await page.reload();
    await expect(itemName(page.getByTestId('item-row').nth(1))).toHaveValue('모여서 커피');
  });
});

test.describe('장소', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-tt'));

  test('고정 장소가 먼저 나오고 토글할 수 있다', async ({ page }) => {
    await page.goto(TT);
    const rows = page.getByTestId('place-row');
    // 픽스처 순서는 카페 · 세미나실(고정) · 숲길이다. 고정이 위로 올라와야 한다.
    await expect(rows.first().getByRole('textbox', { name: '장소 이름' })).toHaveValue('합정 세미나실');

    const pin = rows.first().getByRole('button', { name: /고정/ });
    await expect(pin).toHaveAttribute('aria-pressed', 'true');
    const landed = posted(page);
    await pin.click();
    await landed;

    // 고정을 풀면 픽스처 순서로 돌아간다 — 이제 카페가 맨 위다.
    await expect(rows.first().getByRole('textbox', { name: '장소 이름' })).toHaveValue('연남 카페');
  });

  test('장소를 지우면 끊기는 연결이 몇 개인지 알려준다', async ({ page }) => {
    await page.goto(TT);
    const hall = page.getByTestId('place-row').first();
    await hall.getByRole('button', { name: /삭제/ }).click();

    // 세미나실은 1일차 오전 세션과 2일차 회고가 쓰고 있다.
    const dialog = page.getByTestId('dialog-panel');
    await expect(dialog).toContainText('합정 세미나실');
    await expect(dialog).toContainText('2개');

    const landed = posted(page);
    await page.getByRole('button', { name: '삭제', exact: true }).click();
    await landed;

    await expect(page.getByTestId('place-row')).toHaveCount(2);
    // 그 장소를 쓰던 항목은 "장소 연결"로 돌아간다(F-EDIT-PLACE-5).
    await expect(placeChip(page.getByTestId('item-row').nth(1))).toHaveText('장소 연결');
  });

  test('이름을 고치고 blur하면 저장되고 타임테이블 칩도 따라온다', async ({ page }) => {
    await page.goto(TT);
    const name = page.getByTestId('place-row').first().getByRole('textbox', { name: '장소 이름' });
    const landed = posted(page);
    await name.fill('합정 대회의실');
    await name.blur();
    await landed;

    // 항목은 장소를 참조로 들고 있다(schedule_items.place_id 외래키) — 사본이 아니라서
    // 장소 이름을 고치면 그 장소를 가리키는 항목도 다시 읽을 때 최신 이름으로 조인된다.
    await expect(placeChip(page.getByTestId('item-row').nth(1))).toHaveText('합정 대회의실');
  });
});

/**
 * 미리보기. **확정된 뷰어 컴포넌트를 그대로 쓴다**(스펙 §5.2) — 미리보기 전용 뷰어를 따로
 * 만들면 두 화면이 반드시 어긋난다. 그래서 여기 판정은 "뷰어가 그려졌나"가 아니라
 * "편집 중인 값이 뷰어에 닿았나"다.
 */
test.describe('미리보기', () => {
  test.beforeEach(({ page }) => reseed(page, 'editor-tt'));

  test('폰 프레임에 참가자 화면이 뜬다', async ({ page }) => {
    await page.goto(TT);
    const pv = page.getByTestId('editor-preview');
    await expect(pv.getByRole('heading', { name: '타임테이블 데모' })).toBeVisible();
    // 1일차 3개 — 편집기 목록과 같은 데이터를 뷰어 모양으로 그린다.
    await expect(pv.getByTestId('timeline-row')).toHaveCount(3);
    await expect(pv.getByTestId('viewer-cta')).toBeVisible();
  });

  test('제목을 바꾸면 미리보기가 즉시 따라온다', async ({ page }) => {
    await page.goto(TT);
    const title = page.getByRole('textbox', { name: '일정 제목' });
    const pv = page.getByTestId('editor-preview');

    // 저장 전이다 — 입력만 했는데도 따라와야 한다(둘이 한 편집 상태를 본다).
    await title.fill('타임테이블 데모 2027');
    await expect(pv.getByRole('heading', { name: '타임테이블 데모 2027' })).toBeVisible();
  });

  test('1024px 미만에서는 미리보기가 하단 시트로 내려간다', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto(TT);
    // 오른쪽 열은 CSS로 접힌다 — 미디어 쿼리를 JS로 재지 않는다(브레이크포인트 하나면 된다).
    await expect(page.getByTestId('editor-preview')).toBeHidden();

    await page.getByRole('button', { name: '미리보기' }).click();
    const sheet = page.getByTestId('sheet-panel');
    await expect(sheet.getByTestId('editor-preview')).toBeVisible();
    await expect(sheet.getByRole('heading', { name: '타임테이블 데모' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
  });

  test('편집기 미리보기에는 랜딩 링크가 없다 — 기획자 클릭이 바이럴 지표를 오염시키지 않는다', async ({ page }) => {
    await page.goto(TT);
    const pv = page.getByTestId('editor-preview');
    // 링크 부재만 보면 미리보기가 아직 안 뜬 순간에도 0이라 통과한다. 먼저 뷰어가 그려졌는지 확인한다.
    await expect(pv.getByRole('heading', { name: '타임테이블 데모' })).toBeVisible();
    await expect(pv.getByRole('link', { name: '나도 플랜잇으로 모임 만들기' })).toHaveCount(0);
  });
});

/**
 * 접근성. 편집기는 폼이 많고, 화면을 못 보는 사람에게는 이 화면이 **이름과 알림으로만**
 * 존재한다. 아래 넷은 이번 브랜치에서 실제로 고쳤거나(초점 복원·정렬 알림) 고치는 김에
 * 굳혀 둘 것들이라, 회귀하면 여기서 걸린다.
 */
test.describe('접근성', () => {
  test.beforeEach(async ({ page }) => {
    await reseed(page, 'editor-notice');
    await reseed(page, 'editor-sort');
  });

  test('모든 입력·버튼에 접근 가능한 이름이 있다', async ({ page }) => {
    await page.goto(JEJU);
    await page.getByTestId('editor-preview').waitFor();

    const unnamed = await page.locator('input, textarea, select, button, a').evaluateAll((els) =>
      els
        .filter((el) => {
          // 보조기술에서 감춘 것은 이름이 필요 없다 — 커버 파일 입력이 그렇다(보이는
          // "사진 고르기" 버튼이 대신 눌린다). 감춘 채로 두는 것이 옳은 처리다.
          if (el.getAttribute('aria-hidden') === 'true') return false;
          const e = el as HTMLInputElement;
          return !(
            (e.labels && e.labels.length > 0) ||
            e.getAttribute('aria-label')?.trim() ||
            e.getAttribute('aria-labelledby') ||
            (e.textContent ?? '').trim() ||
            e.getAttribute('title')
          );
        })
        .map((el) => el.outerHTML.slice(0, 120)),
    );

    expect(unnamed, '이름 없는 컨트롤은 스크린리더에 "빈 편집창"·"버튼"으로만 읽힌다').toEqual([]);
  });

  test('서버가 거부한 필드에 오류가 aria로 붙는다', async ({ page }) => {
    // 거부되므로 스토어가 바뀌지 않는다 — 읽기 전용 slug를 그대로 쓴다.
    await page.goto(JEJU);
    const title = page.getByTestId('basic-info').getByRole('textbox', { name: '제목' });
    await title.fill('   ');
    await title.blur();

    await expect(title).toHaveAttribute('aria-invalid', 'true');
    // 색만으로 말하지 않는다: 문구가 있고, 그 문구가 필드와 연결돼 있어야 한다.
    const describedBy = await title.getAttribute('aria-describedby');
    expect(describedBy, '오류 문구가 필드에 연결돼야 한다').toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText('제목을 입력해 주세요.');
  });

  test('삭제 다이얼로그가 초점을 가져가고 닫을 때 돌려준다', async ({ page }) => {
    await page.goto(NOTICE);
    const trash = page.getByTestId('notice-row').first().getByRole('button', { name: /삭제/ });
    await trash.click();

    const dialog = page.getByTestId('dialog-panel');
    await expect(dialog).toBeVisible();
    // 초점이 다이얼로그 안에 들어와야 한다 — 밖에 남으면 탭이 배경을 돌아다닌다.
    await expect
      .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    // 닫으면 누른 자리로 돌아온다 — 안 그러면 키보드 사용자가 목록 처음부터 되짚는다.
    await expect(trash).toBeFocused();
  });

  test('정렬 결과가 aria-live로 읽힌다', async ({ page }) => {
    await page.goto(SORT);
    // 알림 영역은 정렬 목록마다 하나다(공지·타임테이블이 각자 SortableList를 쓴다) —
    // 하나로 합치면 두 목록의 알림이 서로를 지운다. 여기서는 공지 쪽을 본다.
    const status = page.getByTestId('notice-section').getByTestId('sort-status');
    await expect(status).toHaveAttribute('aria-live', 'polite');

    const landed = posted(page);
    await grip(page.getByTestId('notice-row').first()).focus();
    await page.keyboard.press('ArrowDown');
    await landed;

    // 무엇이 몇 번째로 갔는지까지 말한다 — "옮겼습니다"만으로는 확인이 안 된다.
    await expect(status).toContainText('집결 시간을 꼭 지켜주세요, 2번째로 옮겼어요');
  });
});
