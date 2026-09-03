import { test, expect } from '@playwright/test';

test.describe('공개 뷰어', () => {
  test('커버·공지·탭·타임라인이 보인다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await expect(page.getByRole('heading', { name: '제주 워크샵 2026', level: 1 })).toBeVisible();
    await expect(page.getByTestId('cover')).toHaveAttribute('data-cover', 'photo');
    await expect(page.getByTestId('notice-bar')).toBeVisible();
    await expect(page.getByRole('tab', { name: '타임테이블' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('timeline-row')).toHaveCount(4);
  });

  test('공지 바는 접힘이 기본이고 탭하면 목록으로 펼쳐진다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    const bar = page.getByTestId('notice-bar');
    await expect(bar).toHaveAttribute('data-open', 'false');
    // 요약은 각 공지의 첫 구절을 · 로 이은 것이다
    await expect(bar).toContainText('집결 시간을 꼭 지켜주세요 · 준비물 · 회비');
    await bar.getByRole('button').click();
    await expect(bar).toHaveAttribute('data-open', 'true');
    await expect(bar.getByRole('heading', { name: '준비물' })).toBeVisible();
  });

  test('공지 바 버튼의 접근성 이름은 펼쳐도 바뀌지 않는다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    const button = page.getByTestId('notice-bar').getByRole('button', { name: '공지 3개' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await button.click();
    // 이름이 그대로여야 같은 버튼을 다시 잡을 수 있다
    await expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('일차 칩으로 날짜를 바꾸면 타임라인이 바뀐다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await expect(page.getByTestId('timeline-row')).toHaveCount(4);
    await page.getByRole('button', { name: '2일차', exact: true }).click();
    await expect(page.getByTestId('timeline-row')).toHaveCount(3);
  });

  test('하루짜리 일정에는 일차 칩이 없다', async ({ page }) => {
    await page.goto('/p/team-offsite');
    await expect(page.getByTestId('day-chips')).toHaveCount(0);
    await expect(page.getByTestId('cover')).toHaveAttribute('data-cover', 'fallback');
  });

  test('장소 탭으로 넘어가면 레일이 사라진다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await page.getByRole('tab', { name: '장소' }).click();
    await expect(page.getByTestId('progress-rail')).toHaveCount(0);
    await expect(page.getByText('제주국제공항').first()).toBeVisible();
  });

  test('레일은 오늘 날짜에서만 진행 상태를 그린다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    const rail = page.getByTestId('progress-rail');
    // 1일차는 오늘이다 — 코랄이 섞인 그라데이션.
    // useNow가 마운트 후에야 시각을 주므로(첫 페인트는 null = 회색) poll로 기다린다.
    // timeout은 dev 서버 콜드 컴파일까지 감안한 값이다 — 기본 5초는 첫 실행에서 모자란다.
    await expect
      .poll(() => rail.evaluate((el) => getComputedStyle(el).backgroundImage), { timeout: 15_000 })
      .toContain('gradient');
    // 3일차는 미래다 — 진행 없음
    await page.getByRole('button', { name: '3일차', exact: true }).click();
    const future = await page.getByTestId('progress-rail').evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(future).not.toContain('gradient');
  });

  test('없는 slug는 404다', async ({ page }) => {
    const res = await page.goto('/p/nope-not-here');
    expect(res?.status()).toBe(404);
  });

  test('하단 CTA가 마지막 항목을 가리지 않는다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    const cta = page.getByTestId('viewer-cta');
    await expect(cta).toBeVisible();
    await page.getByTestId('timeline-row').last().scrollIntoViewIfNeeded();
    const row = await page.getByTestId('timeline-row').last().boundingBox();
    const bar = await cta.boundingBox();
    expect(row!.y + row!.height).toBeLessThanOrEqual(bar!.y + 1);
  });
});

test.describe('장소 시트', () => {
  test('타임라인 항목을 누르면 장소 시트가 열린다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await page.getByRole('button', { name: /성산일출봉 트레킹/ }).click();
    const sheet = page.getByTestId('sheet-panel');
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('heading', { name: '성산일출봉' })).toBeVisible();
    await expect(sheet).toContainText('일출로 284-12');
    await expect(sheet).toContainText('입장료 5,000원');
  });

  test('액션 셋 중 코랄은 길찾기 하나뿐이다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await page.getByRole('button', { name: /성산일출봉 트레킹/ }).click();
    const actions = page.getByTestId('sheet-panel').getByTestId('sheet-actions');
    await expect(actions.getByRole('link').or(actions.getByRole('button'))).toHaveCount(3);

    // 마커 속성이 아니라 실제로 칠해진 배경색을 센다 — 마커만 세면 bg-brand를 회색으로
    // 바꿔도 통과한다. --fill-brand는 테마마다 값이 다르므로 rgb를 박아 두지 않고
    // 그 자리에서 토큰을 풀어(probe) 비교한다.
    for (const theme of ['light', 'dark'] as const) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      // Button은 transition-colors를 갖는다. 테마를 바꾼 직후에 읽으면 전환 중간값이 잡힌다.
      await page.waitForTimeout(250);
      const { brand, painted } = await actions.evaluate((el) => {
        const probe = document.createElement('span');
        probe.style.backgroundColor = 'var(--fill-brand)';
        el.appendChild(probe);
        const brand = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return { brand, painted: [...el.children].map((k) => getComputedStyle(k).backgroundColor) };
      });
      expect(painted, `${theme}: 액션 3개`).toHaveLength(3);
      const hit = painted.filter((c) => c === brand).length;
      expect(hit, `${theme}: --fill-brand(${brand})로 칠해진 액션 — 실제 ${painted.join(' / ')}`).toBe(1);
    }
  });

  test('장소 미연결 항목은 시트를 열지 않는다', async ({ page }) => {
    await page.goto('/p/jeju-workshop-2026');
    await page.getByRole('button', { name: '2일차', exact: true }).click();
    await page.getByText('팀 세션').click();
    await expect(page.getByTestId('sheet-panel')).toHaveCount(0);
  });

  test('주소 복사를 누르면 토스트가 뜬다', async ({ page, context, browserName }) => {
    // clipboard 권한은 Chromium에서만 grantPermissions로 붙는다. mobile 프로젝트(iPhone 14)는
    // WebKit 엔진이라 권한 이름 자체를 모른다 — 그 엔진에서는 권한 요청 없이 진행하고
    // 판정을 "토스트가 떴는가"로만 좁힌다(클립보드 내용은 읽지 않는다).
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }
    await page.goto('/p/jeju-workshop-2026');
    await page.getByRole('button', { name: /성산일출봉 트레킹/ }).click();
    await page.getByRole('button', { name: '주소 복사' }).click();
    await expect(page.getByText('주소를 복사했어요')).toBeVisible();
  });
});
