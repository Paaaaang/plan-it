/**
 * @file 랜딩 이야기 수학
 * @description 스크롤 이야기(run-story.ts)와 테스트가 같은 정의를 쓰도록 한 곳에 둔다(명세 §4-2).
 */

export const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => t * t * (3 - 2 * t);

/** 이야기 위치 S: 화면 55% 선이 몇 번째 단계의 어디쯤을 지나는지. 히어로는 음수, 끝은 단계 수 − 0.001 */
export function storyPosition(steps: HTMLElement[], vh: number): number {
  const c = vh * 0.55;
  const s0 = steps[0].getBoundingClientRect();
  if (c < s0.top) return (c - s0.top) / vh;
  for (let k = 0; k < steps.length; k++) {
    const b = steps[k].getBoundingClientRect();
    if (c < b.bottom) return k + (c - b.top) / b.height;
  }
  return steps.length - 0.001;
}
