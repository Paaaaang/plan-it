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

/**
 * @param salt 호출자가 지정한 솔트(16바이트). **생성된 seed.sql이 바이트 단위로
 *   안정되게 하려는 용도로만 존재한다** — 실제 사용자 비밀번호를 해시하는
 *   프로덕션 호출부는 이 인자를 절대 넘기지 않는다(기본값인 무작위 솔트를 쓴다).
 *   여기 넘기면 같은 입력에 항상 같은 해시가 나와 사전 계산 공격에 취약해진다.
 */
export function hashPassword(plain: string, salt: Buffer = randomBytes(16)): string {
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
