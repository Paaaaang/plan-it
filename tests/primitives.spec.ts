import { test, expect } from '@playwright/test';

test.describe('Button', () => {
  test('primary는 브랜드 색으로 칠해져요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/ui');
    const bg = await page.getByTestId('btn-primary')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(255, 107, 74)'); // #FF6B4A
  });

  test('다크에서 primary 글자는 흰색이 아니라 어두운 잉크예요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    const color = await page.getByTestId('btn-primary')
      .evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(26, 14, 9)'); // #1A0E09
  });

  test('loading이면 눌리지 않고 상태를 알려줘요', async ({ page }) => {
    await page.goto('/ui');
    const btn = page.getByTestId('btn-loading');
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  test('disabled 버튼은 클릭 핸들러가 돌지 않아요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('btn-disabled').click({ force: true });
    await expect(page.getByTestId('click-count')).toHaveText('0');
  });

  test('활성 버튼은 클릭이 세져요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('btn-counter').click();
    await page.getByTestId('btn-counter').click();
    await expect(page.getByTestId('click-count')).toHaveText('2');
  });

  test('키보드 포커스가 눈에 보여요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('btn-counter').focus();
    const outline = await page.getByTestId('btn-counter')
      .evaluate((el) => getComputedStyle(el).outlineWidth);
    expect(outline).not.toBe('0px');
  });
});

test.describe('TextField', () => {
  test('라벨이 입력과 연결돼요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByLabel('일정 제목').fill('제주 워크샵');
    await expect(page.getByLabel('일정 제목')).toHaveValue('제주 워크샵');
  });

  test('오류가 있으면 문구와 aria-invalid가 함께 나와요', async ({ page }) => {
    await page.goto('/ui');
    const input = page.getByTestId('field-error').getByRole('textbox');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByTestId('field-error')).toContainText('제목을 입력해 주세요');
  });

  test('오류 메시지가 aria-describedby로 연결돼요', async ({ page }) => {
    await page.goto('/ui');
    const input = page.getByTestId('field-error').getByRole('textbox');
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText('제목을 입력해 주세요');
  });

  test('caller가 aria-describedby를 넘겨도 오류 메시지 연결이 깨지지 않아요', async ({ page }) => {
    // TextField는 rest를 펼친 뒤 aria-describedby를 계약 속성으로 뒤에 덧씌운다.
    // caller가 (실수로든 의도로든) aria-describedby를 직접 넘겨도 오류 문구 연결이 이겨야 한다.
    await page.goto('/ui');
    const field = page.getByTestId('field-error-caller-described-by');
    const input = field.getByRole('textbox');
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).not.toBe('caller-supplied-id');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText('제목을 입력해 주세요');
  });

  test('다크에서 입력 표면이 카드보다 어두워요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    const bg = await page.getByLabel('일정 제목')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(19, 23, 32)'); // #131720
  });

  test('multiline은 textarea로 렌더돼요', async ({ page }) => {
    await page.goto('/ui');
    const el = page.getByLabel('메모');
    expect(await el.evaluate((n) => n.tagName)).toBe('TEXTAREA');
  });

  test('오류가 없으면 힌트가 보이고 aria-invalid는 안 붙어요', async ({ page }) => {
    await page.goto('/ui');
    const input = page.getByLabel('메모');
    await expect(input).not.toHaveAttribute('aria-invalid', /.*/);
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText('참가자에게 보여요');
  });

  test('입력 포커스가 눈에 보여요', async ({ page }) => {
    await page.goto('/ui');
    const input = page.getByLabel('일정 제목');
    await input.focus();
    const ring = await input.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(ring).not.toBe('none');
  });
});

test.describe('DateField', () => {
  test('네이티브 날짜 입력을 써요', async ({ page }) => {
    await page.goto('/ui');
    const el = page.getByLabel('시작일');
    expect(await el.getAttribute('type')).toBe('date');
  });

  test('값이 YYYY-MM-DD로 들어가요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByLabel('시작일').fill('2026-10-24');
    await expect(page.getByLabel('시작일')).toHaveValue('2026-10-24');
  });
});

test.describe('Card · Badge · Chip', () => {
  test('기본 카드는 표면색에 그림자 하나예요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/ui');
    const s = await page.getByTestId('card-flat').evaluate((el) => {
      const c = getComputedStyle(el);
      return { bg: c.backgroundColor, shadow: c.boxShadow };
    });
    expect(s.bg).toBe('rgb(255, 255, 255)');
    expect(s.shadow).not.toBe('none');
  });

  test('interactive 카드는 버튼 역할을 가져요', async ({ page }) => {
    await page.goto('/ui');
    await expect(page.getByTestId('card-interactive')).toHaveAttribute('role', 'button');
    await expect(page.getByTestId('card-interactive')).toHaveAttribute('tabindex', '0');
  });

  test('interactive 카드는 Enter로도 눌려요', async ({ page }) => {
    await page.goto('/ui');
    const card = page.getByTestId('card-interactive');
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('card-click-count')).toHaveText('1');
  });

  test('danger 뱃지는 점과 문구를 함께 내요 — 색만으로 말하지 않아요', async ({ page }) => {
    await page.goto('/ui');
    const badge = page.getByTestId('badge-danger');
    await expect(badge).toContainText('숨김');
    await expect(badge.locator('[aria-hidden="true"]')).toHaveCount(1);
  });

  test('선택된 칩은 aria-pressed로 상태를 알려줘요', async ({ page }) => {
    await page.goto('/ui');
    await expect(page.getByTestId('chip-day1')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('chip-day2')).toHaveAttribute('aria-pressed', 'false');
  });

  test('칩을 누르면 선택 상태가 옮겨가요', async ({ page }) => {
    // 초기값만 보면 onClick이 아예 빠져도 통과한다 — 실제로 눌러서 상태가 옮겨가는지 본다.
    await page.goto('/ui');
    await page.getByTestId('chip-day2').click();
    await expect(page.getByTestId('chip-day2')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('chip-day1')).toHaveAttribute('aria-pressed', 'false');
  });

  test('정보형 칩은 버튼이 아니에요', async ({ page }) => {
    await page.goto('/ui');
    expect(await page.getByTestId('chip-info').evaluate((n) => n.tagName)).toBe('SPAN');
  });
});

test.describe('Tabs · SegmentedControl', () => {
  test('탭이 ARIA 탭 패턴을 따라요', async ({ page }) => {
    await page.goto('/ui');
    const list = page.getByTestId('tabs-demo');
    await expect(list).toHaveAttribute('role', 'tablist');
    await expect(list.getByRole('tab', { name: '타임테이블' })).toHaveAttribute('aria-selected', 'true');
    await expect(list.getByRole('tab', { name: '장소' })).toHaveAttribute('aria-selected', 'false');
  });

  test('탭을 누르면 선택이 옮겨가요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('tabs-demo').getByRole('tab', { name: '장소' }).click();
    await expect(page.getByTestId('tabs-demo').getByRole('tab', { name: '장소' }))
      .toHaveAttribute('aria-selected', 'true');
  });

  test('좌우 화살표로 탭을 옮길 수 있어요', async ({ page }) => {
    await page.goto('/ui');
    const first = page.getByTestId('tabs-demo').getByRole('tab', { name: '타임테이블' });
    await first.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('tabs-demo').getByRole('tab', { name: '장소' }))
      .toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('tabs-demo').getByRole('tab', { name: '장소' })).toBeFocused();
  });

  test('세그먼트가 라디오 그룹이에요', async ({ page }) => {
    await page.goto('/ui');
    const group = page.getByTestId('segment-demo');
    await expect(group).toHaveAttribute('role', 'radiogroup');
    await expect(group.getByRole('radio', { name: '공개', exact: true })).toHaveAttribute('aria-checked', 'true');
  });

  test('세그먼트를 눌러 상태를 바꿔요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('segment-demo').getByRole('radio', { name: '비공개' }).click();
    await expect(page.getByTestId('segment-demo').getByRole('radio', { name: '비공개' }))
      .toHaveAttribute('aria-checked', 'true');
  });
});

test.describe('Toast · Loader', () => {
  test('토스트가 뜨고 문구가 보여요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('toast-trigger').click();
    // role="status"/aria-live는 처음부터 떠 있는 wrapper에 붙어야 스크린리더가 안정적으로 읽는다.
    // 콘텐츠와 함께 나타나는 개별 토스트 항목에 붙이면 일부 스크린리더가 announce하지 않는다.
    const region = page.getByTestId('toast-region');
    await expect(region).toHaveAttribute('role', 'status');
    await expect(region).toHaveAttribute('aria-live', 'polite');
    const toast = page.getByTestId('toast');
    await expect(toast).toContainText('주소를 복사했어요');
  });

  test('토스트가 스스로 사라져요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('toast-trigger').click();
    const toast = page.getByTestId('toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveCount(0, { timeout: 6000 });
  });

  test('오류 토스트는 아이콘을 함께 내고 wrapper가 더 급하게 알려요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('toast-error').click();
    const toast = page.getByTestId('toast');
    await expect(toast).toContainText('링크를 복사하지 못했어요');
    await expect(toast.locator('svg')).toHaveCount(1);
    // 오류 톤이 떠 있는 동안은 wrapper의 aria-live가 assertive로 올라가야 한다.
    await expect(page.getByTestId('toast-region')).toHaveAttribute('aria-live', 'assertive');
  });

  test('로더가 스크린리더에 상태를 알려줘요', async ({ page }) => {
    await page.goto('/ui');
    await expect(page.getByTestId('loader-inline')).toHaveAttribute('role', 'status');
    await expect(page.getByTestId('loader-inline')).toHaveAccessibleName(/불러오는 중/);
  });
});

test.describe('BottomSheet · Dialog', () => {
  test('시트가 열리고 dialog 역할을 가져요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('sheet-open').click();
    const sheet = page.getByRole('dialog', { name: '흑돼지 명가' });
    await expect(sheet).toBeVisible();
  });

  test('Escape로 시트가 닫혀요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('sheet-open').click();
    await expect(page.getByRole('dialog', { name: '흑돼지 명가' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: '흑돼지 명가' })).toHaveCount(0);
  });

  test('스크림을 누르면 시트가 닫혀요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('sheet-open').click();
    await page.getByTestId('sheet-scrim').click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole('dialog', { name: '흑돼지 명가' })).toHaveCount(0);
  });

  test('다크에서 시트 표면이 배경보다 밝아요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    await page.getByTestId('sheet-open').click();
    const s = await page.getByTestId('sheet-panel').evaluate((el) => getComputedStyle(el).backgroundColor);
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const sum = (rgb: string) => rgb.match(/\d+/g)!.slice(0, 3).reduce((a, b) => a + Number(b), 0);
    expect(sum(s)).toBeGreaterThan(sum(bodyBg));
  });

  test('시트를 닫으면 배경 스크롤이 돌아와요', async ({ page }) => {
    await page.goto('/ui');
    const before = await page.evaluate(() => document.body.style.overflow);
    await page.getByTestId('sheet-open').click();
    await expect(page.getByTestId('sheet-panel')).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('sheet-panel')).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(before);
  });

  test('삭제 다이얼로그는 확인을 눌러야 실행돼요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('dialog-open').click();
    await expect(page.getByTestId('delete-result')).toHaveText('안 지웠어요');
    await page.getByRole('button', { name: '삭제할게요' }).click();
    await expect(page.getByTestId('delete-result')).toHaveText('지웠어요');
  });

  test('다이얼로그 취소는 아무것도 안 해요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('dialog-open').click();
    await page.getByRole('button', { name: '그대로 둘게요' }).click();
    await expect(page.getByTestId('delete-result')).toHaveText('안 지웠어요');
  });

  test('Escape로 다이얼로그가 닫혀요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('dialog-open').click();
    await expect(page.getByTestId('dialog-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('dialog-panel')).toHaveCount(0);
    await expect(page.getByTestId('delete-result')).toHaveText('안 지웠어요');
  });

  test('스크림을 눌러도 다이얼로그는 안 닫혀요 — 파괴적 행동이라 명시적 선택이 필요해요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('dialog-open').click();
    await expect(page.getByTestId('dialog-panel')).toBeVisible();
    await page.getByTestId('dialog-scrim').click({ position: { x: 5, y: 5 } });
    await expect(page.getByTestId('dialog-panel')).toBeVisible();
    await expect(page.getByTestId('delete-result')).toHaveText('안 지웠어요');
  });
});
