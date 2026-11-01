import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePasswordHash } from "../lib/password-hash.ts";

test("환경 변수용 해시와 이전 해시를 같은 값으로 읽는다", () => {
  const salt = "ab".repeat(16);
  const hash = "cd".repeat(64);
  const current = parsePasswordHash(`scrypt:${salt}:${hash}`);
  const legacy = parsePasswordHash(`scrypt$${salt}$${hash}`);
  assert.deepEqual(current, legacy);
  assert.equal(current?.salt.toString("hex"), salt);
  assert.equal(current?.hash.toString("hex"), hash);
});

test("형식이 잘못된 해시는 거부한다", () => {
  assert.equal(parsePasswordHash("scrypt:short:short"), null);
  assert.equal(parsePasswordHash(`scrypt:${"ab".repeat(16)}$${"cd".repeat(64)}`), null);
  assert.equal(parsePasswordHash(`scrypt:${"zz".repeat(16)}:${"cd".repeat(64)}`), null);
});
