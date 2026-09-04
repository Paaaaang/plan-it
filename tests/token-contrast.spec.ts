import { test, expect, type Page } from '@playwright/test';

/**
 * 채움(fill) 토큰이 표면(surface) 토큰과 같은 색이 되는 것을 막는다.
 *
 * 두 번 당했다. 1단계에서 `--fill-neutral == --bg`라 컴포넌트가 통째로 안 보였고,
 * 2단계에서 `--dark-fill-neutral == --dark-surface-raised`라 시트 안의 보조 액션과
 * 칩이 사라졌다. 두 번 다 나머지 테스트가 전부 통과했다. 세 번째를 여기서 막는다.
 *
 * 왜 CSS를 파싱하지 않는가: 토큰은 `var()` 체인(의미 별칭 → 원시 스케일)이고
 * 다크는 3상태(시스템·강제 다크·강제 라이트)다. 소스 파싱으로는 어느 값이 실제로
 * 이겼는지 알 수 없다. 실제 렌더된 문서에서 probe 엘리먼트의 계산된
 * `background-color`로 푼다 — 브라우저가 푼 값이 곧 사용자가 보는 값이다.
 */

/** 컴포넌트가 "무언가를 칠하는" 데 쓰는 토큰 전부. */
const FILLS = [
  '--fill-brand',
  '--fill-brand-hover',
  '--fill-brand-weak',
  '--fill-neutral',
  '--success',
  '--success-weak',
  '--warning',
  '--warning-weak',
  '--danger',
  '--danger-weak',
  '--accent-ring',
  '--accent-border',
  '--rail-past',
  '--rail-melt',
  '--rail-future',
];

/** 그 채움이 놓이는 바닥 전부. 페이지·카드·시트/다이얼로그·입력. */
const SURFACES = ['--bg', '--surface', '--surface-raised', '--surface-sunken'];

/**
 * 판정 기준: RGB 유클리드 거리 ≥ 12.
 *
 * 대비(WCAG 상대휘도)를 쓰지 않는 이유 — weak 계열은 휘도가 아니라 **색상**으로
 * 구분되도록 설계됐다. 라이트 `--warning-weak #FDF3DF` vs `--bg #F2F4F8`는 대비가
 * 정확히 1.00인데도 따뜻한 크림 vs 차가운 회색으로 또렷하게 구분된다. 휘도 문턱을
 * 걸면 이런 정상 쌍이 전부 걸려 allowlist가 규칙보다 길어진다.
 *
 * 12를 고른 근거: 현재 팔레트에서 **의도된** 가장 가까운 쌍이 거리 16이다
 * (라이트 `--success-weak` on `--bg`, 다크 `--fill-neutral` on `--surface`).
 * 12는 그 아래에 여유를 두고, 사고인 0(완전 동일)과 그 언저리는 확실히 잡는다.
 * 완전 동일(거리 0)은 어떤 경우에도 실패다.
 *
 * allowlist는 **비어 있다** — 현재 팔레트에 의도적으로 같은 fill×surface 쌍은 없다.
 * (라이트에서 `--surface`와 `--surface-raised`가 둘 다 #FFF로 같지만 이건
 *  surface×surface라 이 행렬에 들어오지 않는다. 흰 종이 위에 뜬 흰 시트는
 *  그림자로 층이 나뉜다 — 정상이다.)
 */
const MIN_DISTANCE = 12;

type Rgb = [number, number, number];

/** probe 엘리먼트로 토큰을 실제 rgb로 푼다. Lightning CSS의 #fff 축약·var() 체인 무관. */
async function resolve(page: Page, names: string[]): Promise<Record<string, Rgb>> {
  return page.evaluate((ns) => {
    const probe = document.createElement('div');
    probe.style.display = 'none';
    document.documentElement.appendChild(probe);
    const out: Record<string, [number, number, number]> = {};
    for (const n of ns) {
      probe.style.backgroundColor = `var(${n})`;
      const m = getComputedStyle(probe).backgroundColor.match(/\d+/g);
      if (!m) throw new Error(`${n}을 색으로 풀 수 없다`);
      out[n] = [Number(m[0]), Number(m[1]), Number(m[2])];
    }
    probe.remove();
    return out;
  }, names);
}

const dist = (a: Rgb, b: Rgb) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const hex = (c: Rgb) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');

async function assertNoCollision(page: Page, label: string) {
  const t = await resolve(page, [...FILLS, ...SURFACES]);
  const collisions: string[] = [];

  for (const f of FILLS) {
    for (const s of SURFACES) {
      const d = dist(t[f], t[s]);
      if (d < MIN_DISTANCE) {
        collisions.push(
          `${label}: ${f}(${hex(t[f])}) 가 ${s}(${hex(t[s])}) 위에서 안 보인다 — 거리 ${d.toFixed(1)} < ${MIN_DISTANCE}`,
        );
      }
    }
  }

  expect(collisions, collisions.join('\n')).toEqual([]);
}

test.describe('토큰 충돌 — 채움이 표면에 녹지 않아요', () => {
  test('라이트에서 모든 fill이 모든 surface와 구분돼요', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/ui');
    await assertNoCollision(page, 'light');
  });

  test('다크에서 모든 fill이 모든 surface와 구분돼요', async ({ page }) => {
    // 시스템 다크와 강제 다크 둘 다 본다. 값은 --dark-* 한 곳에서 오지만
    // 두 선택자 중 하나만 갱신되는 사고를 여기서 같이 잡는다.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/ui');
    await assertNoCollision(page, 'dark(system)');

    await page.emulateMedia({ colorScheme: 'light' });
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await assertNoCollision(page, 'dark(data-theme)');
  });
});
