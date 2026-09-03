import { test, expect, type Page } from '@playwright/test';

/**
 * 시각 회귀.
 * 토큰이나 프리미티브가 의도치 않게 바뀌면 여기서 걸린다.
 * 의도한 변경이면 `npx playwright test tests/visual.spec.ts --update-snapshots`.
 */
test.skip(
  !!process.env.CI,
  '시각 회귀는 로컬 전용이에요. 플랫폼마다 폰트 렌더링이 달라 CI에서는 기준 이미지가 맞지 않아요.',
);

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

/**
 * 임계값 — **실측으로 정했다.**
 *
 * 2단계에서 다크 `--fill-neutral`이 `--surface-raised`와 같아져 시트 안 컴포넌트가
 * 통째로 사라졌는데 이 파일이 통과시켰다. 그 결함을 그대로 재현해(`--dark-fill-neutral`을
 * `#232833`으로 주입) 재보니 범인은 `maxDiffPixelRatio`가 아니라 **픽셀당 `threshold`의
 * 기본값 0.2**였다. 0.2·0.15·0.1에서는 다른 픽셀이 **0개**로 집계된다 — #333A48과
 * #232833의 YIQ 거리가 그 문턱 아래라 비교기가 아예 차이로 세지 않는다. 갤러리를
 * 섹션별로 쪼개도 결과는 같았다(분모가 아니라 픽셀 판정이 문제였다).
 *
 * `threshold`를 내리면 같은 결함이 전체 갤러리에서 34,542px으로 잡힌다.
 *
 * 값의 근거 — 두 종류의 노이즈를 실측했다(전체 스위트 병렬 실행, 같은 기계):
 *  1. 카드 모서리 안티에일리어싱, 채널당 ≤3/255 — `threshold: 0.03`이 삼킨다.
 *     (pixelmatch YIQ: 균일 편차 d의 거리는 0.5053·d², 문턱은 35215·t².
 *      t=0.03이면 d≤7을 삼키고 d≥8부터 센다.)
 *  2. 카드 그림자 아래 가장자리가 한 스캔라인 통째로 21/255까지 튀는 일이 가끔 있다
 *     (실측 26px, 10회 중 2회). 이건 결함 신호(유효 d≈17.7)보다 **더 큰** 편차라
 *     픽셀당 문턱으로는 못 가른다 — 개수로 가른다.
 *
 * 그래서 `maxDiffPixels: 100`이다. 관측된 흔들림(26px)의 4배, melt 결함(34,542px)의
 * 1/345. **비율(`maxDiffPixelRatio`)이 아니라 절대 개수**를 쓰는 게 핵심이다.
 * 비율은 분모(=이미지 크기)에 희석돼 작은 컴포넌트가 통째로 사라져도 통과하지만,
 * 절대 개수는 분모를 안 본다 — 갤러리를 섹션별로 쪼개 분모를 줄일 이유도 같이 사라진다.
 */
const SHOT = { threshold: 0.03, maxDiffPixels: 100 } as const;

/** 폰트·이미지가 자리잡을 때까지 기다린다 — 안 그러면 스냅샷이 흔들린다. */
async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() =>
    Promise.all(
      [...document.images]
        .filter((img) => !img.complete)
        .map((img) => new Promise((r) => { img.onload = img.onerror = r; })),
    ),
  );
  // Next dev 오버레이는 제품 화면이 아니다. 기준 이미지에서 뺀다.
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important }' });
}

for (const scheme of ['light', 'dark'] as const) {
  test(`UI 갤러리 — ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/ui');
    await settle(page);
    await expect(page).toHaveScreenshot(`gallery-${scheme}.png`, { fullPage: true, ...SHOT });
  });
}

/**
 * 공개 뷰어. 모바일이 기본 뷰포트라 mobile 프로젝트에서만 찍는다.
 *
 * 시각에 따라 변하는 것을 전부 못박는다 — 안 그러면 기준 이미지가 매일 깨진다:
 *  1. `page.clock.setFixedTime` — 오늘(KST) 13:20에 고정. `useNow`가 이 시각을 읽으므로
 *     레일 그라데이션 정지점과 항목 상태(past/current/future)가 결정적이 된다.
 *     브리프의 `--rail-future` 강제 대신 이 방법을 쓴다. 레일을 단색으로 눌러버리면
 *     스냅샷이 레일의 실제 모습을 더는 지키지 못한다 — 시각을 고정하면 둘 다 얻는다.
 *  2. 날짜 문구 — 픽스처 날짜가 "오늘 기준 상대"라 커버 서브라인과 일차 줄의 숫자가
 *     매일 바뀐다. 날짜 조각만 고정 길이 문자열로 치환한다.
 *
 * 그래서 이 스냅샷이 여전히 지키는 것: 커버 높이·스크림·뱃지·타이포, 공지 바의 한 줄
 * 자르기와 펼친 덩어리, 탭 밑줄, 일차 칩, 레일 위치와 그라데이션 모양, 항목 세 상태의
 * 테두리·점·투명도, 카드 표면과 다크 대비, 하단 CTA와 그 위 페이드. 고정한 것은
 * "지금이 몇 시인가"와 "오늘이 며칠인가" 둘뿐이다.
 */
test.describe('공개 뷰어', () => {
  // isMobile은 mobile 프로젝트(iPhone 14, 390×844)에서만 true다.
  test.skip(({ isMobile }) => !isMobile, '뷰어는 모바일이 기본이에요. 390×844에서만 찍어요.');

  /** 오늘(KST) 13:20. jeju 1일차에서 10:30=past · 12:00=current · 나머지 future가 된다. */
  const fixedNow = () => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
    return new Date(`${today}T13:20:00+09:00`);
  };

  /** 타임라인이 하이드레이션까지 끝난 순간 — 레일과 항목 상태가 최종값이 된 뒤다. */
  const RAIL_SETTLED = '[data-testid="timeline-row"][data-state="current"]';

  async function openViewer(
    page: Page,
    path: string,
    opts: { dark?: boolean; settledSelector?: string } = {},
  ) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // 뷰어 기준 뷰포트는 390×844다. iPhone 14 디바이스 기술자의 기본 높이(664)는
    // 브라우저 크롬을 뺀 값이라 기준보다 180px 짧다 — 여기서 못박는다.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.clock.setFixedTime(fixedNow());
    if (opts.dark) {
      // 테마는 쿠키가 단일 소스다(lib/theme.ts). 서버가 <html data-theme="dark">로 그리게 하면
      // 클라이언트에서 속성을 갈아끼울 때 생기는 색 전환 중간값이 스냅샷에 안 잡힌다.
      await page.context().addCookies([{ name: 'planit-theme', value: 'dark', url: BASE_URL }]);
    }
    await page.goto(path);
    // useNow는 마운트 뒤에야 시각을 준다. current 상태가 나타난 뒤가 최종 화면이다.
    // 타임라인이 없는 화면(게이트·만료)은 자기 기준을 넘긴다.
    await page.locator(opts.settledSelector ?? RAIL_SETTLED).first().waitFor();
    await settle(page);
    await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        // "10.24 목" → "00.00 월". 길이가 항상 같아 줄 길이·줄바꿈까지 고정된다.
        if (n.nodeValue) n.nodeValue = n.nodeValue.replace(/\d{1,2}\.\d{2} [일월화수목금토]/g, '00.00 월');
      }
    });
  }

  test('기본 — 라이트 · 공지 접힘', async ({ page }) => {
    await openViewer(page, '/p/jeju-workshop-2026');
    await expect(page).toHaveScreenshot('viewer-light.png', SHOT);
  });

  test('다크', async ({ page }) => {
    await openViewer(page, '/p/jeju-workshop-2026', { dark: true });
    await expect(page).toHaveScreenshot('viewer-dark.png', SHOT);
  });

  test('공지 펼침', async ({ page }) => {
    await openViewer(page, '/p/jeju-workshop-2026');
    const bar = page.getByTestId('notice-bar');
    await bar.getByRole('button').click();
    await expect(bar).toHaveAttribute('data-open', 'true');
    await expect(page).toHaveScreenshot('viewer-notice-open.png', SHOT);
  });

  test('사진 없음 · 하루 일정', async ({ page }) => {
    await openViewer(page, '/p/team-offsite');
    await expect(page).toHaveScreenshot('viewer-nophoto.png', SHOT);
  });

  /*
   * 아래 네 화면은 기준 이미지가 한 장도 없던 곳이다. 하필 이번 단계의 다크 시트
   * 블로커(--fill-neutral == --surface-raised)가 났던 화면이 그 안에 있었다 —
   * 그래서 **시트는 라이트·다크 둘 다** 찍는다.
   */

  test('장소 탭', async ({ page }) => {
    await openViewer(page, '/p/jeju-workshop-2026');
    await page.getByRole('tab', { name: '장소' }).click();
    await expect(page.getByTestId('place-list')).toBeVisible();
    await expect(page).toHaveScreenshot('viewer-places.png', SHOT);
  });

  for (const scheme of ['light', 'dark'] as const) {
    test(`장소 시트 — ${scheme}`, async ({ page }) => {
      await openViewer(page, '/p/jeju-workshop-2026', { dark: scheme === 'dark' });
      await page.getByRole('button', { name: /성산일출봉 트레킹/ }).click();
      // 시트에는 교통 안내가 함께 뜬다(스펙 §5.1).
      await expect(page.getByTestId('sheet-transport')).toBeVisible();
      await expect(page).toHaveScreenshot(`viewer-sheet-${scheme}.png`, SHOT);
    });
  }

  test('비밀번호 게이트', async ({ page }) => {
    // 하이드레이션 전에는 제출 버튼이 잠겨 있다(네이티브 GET 제출 차단). 풀린 뒤가 최종 화면이다.
    await openViewer(page, '/p/secret-party', { settledSelector: 'form button:not([disabled])' });
    await expect(page).toHaveScreenshot('viewer-gate.png', SHOT);
  });

  test('만료된 링크', async ({ page }) => {
    await openViewer(page, '/p/gone', { settledSelector: '[data-testid="status-glyph"]' });
    await expect(page).toHaveScreenshot('viewer-expired.png', SHOT);
  });
});
