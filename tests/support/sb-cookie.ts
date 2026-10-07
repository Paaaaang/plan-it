/**
 * @file `sb-*` 세션 쿠키 디코딩 — `auth.setup.ts`와 `auth.spec.ts`에 두 벌로 따로
 * 있던 것을 하나로 합친다. 값은 base64 JSON({access_token, ...})이고 토큰 자체는
 * 점(.)으로 나뉜 JWT다.
 */

/** sb-* 쿠키에서 액세스 토큰(JWT 문자열)을 꺼낸다. 쿠키가 없으면 undefined. */
export function accessTokenFromCookies(cookies: { name: string; value: string }[]): string | undefined {
  const sb = cookies.find((c) => c.name.startsWith('sb-'));
  if (!sb) return undefined;
  const raw = decodeURIComponent(sb.value).replace(/^base64-/, '');
  const { access_token } = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  return access_token as string | undefined;
}

/** JWT 페이로드에서 sub(사용자 id)만 꺼낸다. */
export function subFromAccessToken(token: string): string | undefined {
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
  return payload.sub as string | undefined;
}
