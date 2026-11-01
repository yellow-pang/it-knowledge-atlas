import { test } from "node:test";
import { strict as assert } from "node:assert";
import { isRating, nextReviewDate, REVIEW_RULE_VERSION, seoulDate } from "../lib/review.ts";

test("고정 간격과 규칙 버전", () => {
  const date = new Date("2026-01-01T12:00:00Z");
  assert.equal(nextReviewDate(date, "again"), "2026-01-02");
  assert.equal(nextReviewDate(date, "hard"), "2026-01-04");
  assert.equal(nextReviewDate(date, "remembered"), "2026-01-08");
  assert.equal(REVIEW_RULE_VERSION, "fixed-1-3-7-v1");
});
test("한국 시간 날짜 경계와 연말", () => {
  assert.equal(seoulDate(new Date("2026-12-31T14:59:59Z")), "2026-12-31");
  assert.equal(nextReviewDate(new Date("2026-12-31T15:00:00Z"), "again"), "2027-01-02");
});
test("잘못된 평가 거부", () => {
  assert.equal(isRating("easy"), false);
  assert.throws(() => nextReviewDate(new Date(), "easy" as never));
});
