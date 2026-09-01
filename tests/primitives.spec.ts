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
    // 구조(data-testid)로 찾는다 — 갤러리에는 role="status"인 다른 요소(로딩 버튼, Loader)도 있어
    // role만으로는 모호하다. role="status" 계약 자체는 아래에서 별도로 검증한다.
    const toast = page.getByTestId('toast');
    await expect(toast).toHaveAttribute('role', 'status');
    await expect(toast).toContainText('주소를 복사했어요');
  });

  test('토스트가 스스로 사라져요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('toast-trigger').click();
    const toast = page.getByTestId('toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveCount(0, { timeout: 6000 });
  });

  test('오류 토스트는 아이콘을 함께 내요', async ({ page }) => {
    await page.goto('/ui');
    await page.getByTestId('toast-error').click();
    const toast = page.getByTestId('toast');
    await expect(toast).toContainText('링크를 복사하지 못했어요');
    await expect(toast.locator('svg')).toHaveCount(1);
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
});
