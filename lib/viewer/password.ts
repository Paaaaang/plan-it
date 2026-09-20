/**
 * @file 뷰어 비밀번호 해시
 *
 * 픽스처 시절엔 무솔트 sha256이었고 그 자리 ponytail 주석이
 * "실제 DB 컬럼이 붙는 순간 salt + scrypt로 바꾼다"고 예고해 뒀다. 지금이 그 순간이다.
 * node:crypto만 쓴다 — 패키지를 더하지 않는다.
 *
 * 저장 형식: `scrypt$<N>$<salt-hex>$<hash-hex>`
 * 파라미터를 값에 같이 넣는다 — 나중에 N을 올려도 옛 해시를 계속 검증할 수 있다.
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const N = 16384;
const KEYLEN = 32;

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, KEYLEN, { N });
  return `scrypt$${N}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPasswordHash(plain: string, stored: string | null): boolean {
  if (!stored) return false;
  const [scheme, nRaw, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt") return false;
  const n = Number(nRaw);
  if (!Number.isInteger(n) || n <= 0) return false;
  const want = Buffer.from(hashHex, "hex");
  const got = scryptSync(plain, Buffer.from(saltHex, "hex"), want.length, { N: n });
  return got.length === want.length && timingSafeEqual(got, want);
}
