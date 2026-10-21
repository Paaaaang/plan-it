import { test, expect, type Page } from '@playwright/test';

// 배경 영상(외부 CDN, 6개 합 ~73MB)은 테스트에서 받지 않는다. WebKit은 autoplay 영상을 preload와 무관하게
// 통째로 받아 load 이벤트가 10초 넘게 늦어지고, 워커가 여럿이면 goto가 30초 제한에 걸린다.
// 영상이 없어도 페이지가 읽히는 것 자체가 명세 §9의 약속이라 이 상태로 재도 된다.
test.beforeEach(async ({ page }) => {
  await page.route('**/*.mp4', (route) => route.abort());
});

test.describe('랜딩 — 비로그인', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('헤더: 로그인은 /login, 내비는 세 섹션으로', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: '로그인' })).toHaveAttribute('href', '/login');
    // 내비는 960px 이상에서만 보인다 — 모바일에서도 DOM의 연결은 확인한다
    for (const href of ['#try', '#tour', '#cases']) {
      await expect(page.locator(`nav[aria-label="주요 메뉴"] a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test('라이트 테마에서도 우주색 다크로 그려진다 — 오버스크롤 바탕까지', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const bg = await page.getByTestId('landing').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(1, 8, 40)'); // --landing-space #010828
    const html = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
    expect(html).toBe('rgb(1, 8, 40)');
  });

  test('마지막 CTA는 로그인으로 간다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 2, name: /다음 모임/ })).toBeAttached();
    await expect(page.getByRole('link', { name: '내 모임 만들기' }).last()).toHaveAttribute('href', '/login');
  });

  test('CTA 글자는 어두운 색이다 — 크림 글자는 코랄 위에서 대비 미달', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: '내 모임 만들기' }).last();
    const { color, ink } = await cta.evaluate((el) => {
      // 토큰은 하드코딩하지 않고 페이지에서 풀어 본다 — 값이 바뀌어도 같은 약속을 잰다
      const probe = document.createElement('i');
      probe.style.color = 'var(--ink-on-coral)';
      document.body.append(probe);
      const ink = getComputedStyle(probe).color;
      probe.remove();
      return { color: getComputedStyle(el).color, ink };
    });
    expect(color).toBe(ink);
  });

  test('가로 스크롤이 생기지 않는다', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('배경 영상이 막혀도 그려지고 에러가 없다', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.route('**/*.mp4', (route) => route.abort());
    await page.goto('/');
    // 영상은 화면에 들어올 때만 받는다 — 끝까지 내려가며 하나씩 불러(막혀서 실패하게) 본다
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 400) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(50);
    }
    await expect(page.locator('video')).toHaveCount(0, { timeout: 10_000 }); // 오류 난 영상은 치운다
    await expect(page.getByRole('heading', { level: 2, name: /다음 모임/ })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('지어낸 지표가 없다 — 조회수 문구 금지', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('landing')).not.toContainText('조회');
  });
});

/** 이야기 위치 S로 스크롤한다(명세 §4-2): 화면 55% 선이 단계 k의 (S − k) 지점을 지나게. 히어로는 음수 */
async function scrollToStory(page: Page, S: number) {
  await page.evaluate((S) => {
    const steps = [...document.querySelectorAll<HTMLElement>('[data-story-step]')];
    const vh = innerHeight;
    let y: number;
    if (S < 0) {
      const r = steps[0].getBoundingClientRect();
      y = scrollY + r.top - vh * 0.55 + S * vh;
    } else {
      const k = Math.floor(S), r = steps[k].getBoundingClientRect();
      y = scrollY + r.top + (S - k) * r.height - vh * 0.55;
    }
    scrollTo(0, y);
  }, S);
}

/** 수화가 끝날 때까지 기다린다 — 이야기 루프가 첫 프레임에 단계마다 data-active를 단다(수화 뒤에만 돈다).
 *  그 전에 넣은 입력·클릭은 React가 받지 못해 사라진다(부하가 큰 병렬 실행에서 실제로 났다) */
async function hydrated(page: Page) {
  await expect(page.locator('[data-story-step][data-active]').first()).toBeAttached({ timeout: 15_000 });
}

test.describe('랜딩 여정', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  const phone = (page: Page) => page.getByTestId('story-phone');

  test('히어로: 제목·CTA·예시 일정 폰', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('10분이면 네 것도.');
    await expect(page.getByRole('link', { name: '내 모임 만들기' }).first()).toHaveAttribute('href', '/login');
    await expect(phone(page).getByTestId('cover')).toContainText('제주 3일 모임');
  });

  test('공지 단계에서 펼쳐졌다가 다음 단계에서 접힌다', async ({ page }) => {
    await page.goto('/');
    await scrollToStory(page, 1.5);
    await expect(phone(page).getByTestId('notice-bar')).toHaveAttribute('data-open', 'true', { timeout: 10_000 });
    await scrollToStory(page, 2.5);
    await expect(phone(page).getByTestId('notice-bar')).toHaveAttribute('data-open', 'false', { timeout: 10_000 });
  });

  test('시간이 흐르면 지금 줄이 차례로 내려가고 코랄은 점 중심에서 끝난다', async ({ page }) => {
    await page.goto('/');
    const current = phone(page).locator('[data-day-page="0"] [data-testid="timeline-row"][data-state="current"]');
    await scrollToStory(page, 1.5);
    await expect(current).toContainText('12:00', { timeout: 10_000 });
    await scrollToStory(page, 2.95);
    await expect(current).toContainText('18:00', { timeout: 10_000 });
    const gap = await phone(page).locator('[data-day-page="0"] [data-testid="timeline"]').evaluate((tl) => {
      const dot = tl.querySelector('[data-now-dot]')!.getBoundingClientRect();
      const fill = tl.querySelector('[data-testid="progress-rail-fill"]')!.getBoundingClientRect();
      return Math.abs(dot.top + dot.height / 2 - fill.bottom);
    });
    expect(gap).toBeLessThanOrEqual(1.5);
  });

  test('일차를 넘기면 머리줄이 3일차가 된다', async ({ page }) => {
    await page.goto('/');
    await scrollToStory(page, 3.95);
    await expect(phone(page).locator('[data-testid="day-dots"] button[aria-current="true"]')).toHaveAttribute('aria-label', '3일차', { timeout: 10_000 });
  });

  test('길찾기 단계 끝에서 도착한다', async ({ page }) => {
    await page.goto('/');
    await scrollToStory(page, 4.95);
    await expect(phone(page).getByTestId('eta')).toHaveText('도착', { timeout: 10_000 });
  });

  test('데스크톱: 여정 폰이 만들어 보기 폰 자리에 내려앉는다', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 960, '착지는 데스크톱만(명세 §5)');
    await page.goto('/');
    await page.getByTestId('try-phone').evaluate((el) => {
      const r = el.getBoundingClientRect();
      scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2);
    });
    await expect(page.getByTestId('story-slot')).toHaveCSS('visibility', 'hidden', { timeout: 10_000 });
    await expect(page.getByTestId('try-phone')).toHaveCSS('opacity', '1');
    // 조금 올리면 다시 떠오르고, 날아가는 폰 속은 만들어 보기 초안이다
    await page.evaluate(() => scrollBy(0, -innerHeight * 0.3));
    await expect(page.getByTestId('story-slot')).toHaveCSS('visibility', 'visible', { timeout: 10_000 });
    await expect(phone(page).getByTestId('cover')).toContainText('가을 제주 3일');
  });

  test('만들어 보기: 입력이 미리보기 폰에 바로 반영된다', async ({ page }) => {
    await page.goto('/#try');
    await hydrated(page);
    const tp = page.getByTestId('try-phone');
    const name = page.getByLabel('모임 이름');
    await name.fill('우리 동아리 MT');
    await expect(tp.getByTestId('cover')).toContainText('우리 동아리 MT');
    await page.getByRole('group', { name: '어떤 모임이에요?' }).getByRole('button', { name: 'MT·동아리' }).click();
    await expect(tp.getByTestId('cover')).toContainText('동아리 18명');
    await page.getByRole('group', { name: '며칠이에요?' }).getByRole('button', { name: '1박 2일' }).click();
    await expect(tp.locator('[data-testid="day-dots"] button')).toHaveCount(2);
    await name.fill('   ');
    await expect(tp.getByTestId('cover')).toContainText('이름 없는 모임');
    await expect(name).toHaveAttribute('maxlength', '24');
    await expect(page.getByTestId('try-link')).toHaveText(/^\/p\/[0-9a-hjkmnp-tv-z]{20}$/);
  });

  test('링크 복사는 클립보드를 건드리지 않고 다섯 명이 합류하는 연출만 한다', async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __copied: boolean };
      w.__copied = false;
      try {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: { writeText: async () => { w.__copied = true; } },
        });
      } catch { /* 이 엔진에선 바꿀 수 없다 — 아래 판정은 그대로 유효하다 */ }
    });
    await page.goto('/#try');
    await hydrated(page);
    const copy = page.getByRole('button', { name: '링크 복사' });
    await expect(copy).toHaveAttribute('data-nudge', 'true');
    await copy.click();
    await expect(copy).toHaveAttribute('data-nudge', 'false');
    await expect(page.getByText('5명이 로그인 없이 열었어요')).toBeVisible({ timeout: 6_000 });
    expect(await page.evaluate(() => (window as unknown as { __copied: boolean }).__copied)).toBe(false);
    await expect(page.getByText('복사했어요')).toHaveCount(0);
  });

  test('모션 줄이기: 링크 복사 강조는 멈춘 고리로 남는다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#try');
    const copy = page.getByRole('button', { name: '링크 복사' });
    expect(await copy.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
    expect(await copy.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
  });

  test('모션 줄이기: 데스크톱 히어로 폰이 커서를 따라 기울지 않는다', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 960, '커서 기울기는 데스크톱 히어로만(명세 §4-3)');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await hydrated(page);
    const slot = page.getByTestId('story-slot');
    for (const [x, y] of [[5, 5], [1275, 715], [640, 10]]) {
      await page.mouse.move(x, y);
      await page.waitForTimeout(300); // 커서 감쇠가 몇 프레임 돌 만큼
      const pose = await slot.evaluate((el) => [el.style.getPropertyValue('--ry'), el.style.getPropertyValue('--rx')]);
      expect(pose).toEqual(['-16.000deg', '0.000deg']); // 히어로 자세 A 그대로
    }
  });

  test('쓰임 카드를 누르면 그 일정이 여정 폰에 열리고 맨 위로 간다', async ({ page }) => {
    await page.goto('/#cases');
    await hydrated(page);
    await page.getByRole('button', { name: '가평 1박 MT 일정을 위쪽 폰에서 열기' }).click();
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 10_000 }).toBeLessThan(5);
    await expect(phone(page).getByTestId('cover')).toContainText('가평 1박 MT');
  });
});
