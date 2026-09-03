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

/**
 * 비밀번호 게이트 · 오류/만료 화면.
 *
 * 테스트 격리 — 시도 카운터는 프로세스 메모리다(actions/viewer-actions.ts).
 * desktop·mobile 두 프로젝트가 같은 dev 서버를 병렬로 때리고 CI는 재시도까지 한다.
 * 카운터를 건드리는 테스트가 고정 slug를 쓰면 "4번"이 실행 순서에 따라 3번·2번이 된다.
 * → **틀리는 테스트만 매 실행마다 새 slug를 쓴다.** `secret-`로 시작하는 slug는 전부
 *   비공개이고(lib/fixtures/viewer.ts::isLockedSlug), 비밀번호 해시가 없는 slug는
 *   어떤 입력도 틀린 것으로 처리된다(fail-closed). 나머지 테스트는 secret-party를 쓴다 —
 *   읽기만 하거나(게이트 노출) 성공해서 카운터를 지운다. 둘 다 카운터를 올리지 않는다.
 */
const freshLockedSlug = () => `secret-${crypto.randomUUID()}`;

test.describe('비밀번호 게이트 · 오류', () => {
  test('비공개 일정은 게이트를 먼저 보여준다', async ({ page }) => {
    await page.goto('/p/secret-party');
    await expect(page.getByRole('heading', { name: /비밀번호/ })).toBeVisible();
    // 막다른 길에 닿기 전에 남은 시도를 미리 알려준다
    await expect(page.getByText(/5번/)).toBeVisible();
    await expect(page.getByTestId('timeline')).toHaveCount(0);
  });

  test('틀리면 남은 시도가 줄어든다', async ({ page }) => {
    await page.goto(`/p/${freshLockedSlug()}`);
    await page.getByLabel('비밀번호').fill('0000');
    await page.getByRole('button', { name: '확인' }).click();
    await expect(page.getByText(/4번/)).toBeVisible();
  });

  test('맞으면 일정이 열린다', async ({ page }) => {
    await page.goto('/p/secret-party');
    await page.getByLabel('비밀번호').fill('1234');
    await page.getByRole('button', { name: '확인' }).click();
    await expect(page.getByTestId('timeline')).toBeVisible();
  });

  test('만료된 링크는 빨강을 쓰지 않고 나갈 길을 하나 준다', async ({ page }) => {
    await page.goto('/p/gone');
    await expect(page.getByText(/만료/)).toBeVisible();
    await expect(page.getByRole('link', { name: '플랜잇 둘러보기' })).toBeVisible();
    // 링크 만료는 사용자 잘못이 아니다 — 빨강을 쓰지 않는다 (스펙 §5.1)
    const glyph = page.getByTestId('status-glyph');
    const color = await glyph.evaluate((el) => getComputedStyle(el).color);
    expect(color).not.toMatch(/rgb\(217, 45, 78\)/);
  });
});

/** 스펙 §9-6 — 하루 22개 항목에서 레일과 스크롤이 견디는지 */
test.describe('긴 일정', () => {
  test('하루 22개 항목에서도 레일이 첫 점부터 마지막 점까지 이어진다', async ({ page }) => {
    await page.goto('/p/long-day');
    await expect(page.getByTestId('timeline-row')).toHaveCount(22);

    const rail = await page.getByTestId('progress-rail').boundingBox();
    const first = await page.getByTestId('timeline-dot').first().boundingBox();
    const last = await page.getByTestId('timeline-dot').last().boundingBox();

    // 레일이 첫 점 위에서 시작해 마지막 점 아래에서 끝나야 한다 — 도중에 끊기면 안 된다.
    expect(rail!.y).toBeLessThanOrEqual(first!.y + first!.height);
    expect(rail!.y + rail!.height).toBeGreaterThanOrEqual(last!.y);

    // 가로 스크롤이 생기면 안 된다.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });
});

/**
 * 공개 경로 하드닝.
 * slug는 URL 조각 그대로 픽스처 조회 키가 된다. 평범한 객체 리터럴을 그렇게 쓰면
 * `constructor`·`toString` 같은 프로토타입 키가 조회를 뚫고 나와 500이 된다.
 */
test.describe('공개 경로 하드닝', () => {
  for (const slug of ['constructor', '__proto__', 'toString']) {
    test(`프로토타입 키(${slug})는 500이 아니라 404다`, async ({ page }) => {
      const res = await page.goto(`/p/${slug}`);
      expect(res?.status(), `/p/${slug} 상태 코드`).toBe(404);
    });
  }
});

test.describe('메모가 긴 장소', () => {
  // 시트는 모바일 화면(390×844)이 기본이다. 데스크톱에서는 패널이 1280px 폭으로 펼쳐져
  // 같은 메모가 몇 줄에 다 들어가므로 이 회귀가 재현되지 않는다.
  test.skip(({ isMobile }) => !isMobile, '시트 넘침은 모바일 폭에서만 재현돼요.');

  test('시트가 뷰포트를 넘지 않고 제목과 액션에 모두 닿는다', async ({ page }) => {
    // 시트 등장 애니메이션은 아래에서 위로 올라온다. 중간 프레임에서는 제목이 잠깐
    // 화면 안을 지나가므로, 모션을 끄고 최종 위치에서만 판정한다.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/p/team-offsite');
    await page.getByRole('tab', { name: '장소' }).click();
    await page.getByRole('button', { name: '성수 커피 로스터리 상세 보기' }).click();

    const panel = page.getByTestId('sheet-panel');
    await expect(panel).toBeVisible();

    // 1) 제목이 화면 밖으로 밀려 나가면 안 된다. lockBodyScroll 때문에 스크롤로 되돌릴 수 없다.
    const title = panel.getByRole('heading', { name: '성수 커피 로스터리' });
    await expect(title).toBeInViewport({ ratio: 1 });

    // 2) 시트 자체가 스크롤되어 마지막 액션까지 도달할 수 있어야 한다.
    const last = panel.getByRole('link', { name: '네이버 지도에서 보기' });
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport({ ratio: 1 });

    // 3) 패널이 뷰포트보다 높으면 안 된다.
    const box = await panel.boundingBox();
    const vh = page.viewportSize()!.height;
    expect(box!.height, `패널 높이 ${box!.height} ≤ 뷰포트 ${vh}`).toBeLessThanOrEqual(vh);
  });
});
