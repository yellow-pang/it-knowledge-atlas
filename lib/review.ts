export const REVIEW_RULE_VERSION = "fixed-1-3-7-v1";
export const ratings = ["again", "hard", "remembered"] as const;
export type Rating = typeof ratings[number];
export function isRating(value: unknown): value is Rating { return typeof value === "string" && ratings.includes(value as Rating); }
export function seoulDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
export function nextReviewDate(date: Date, rating: Rating): string {
  if (!isRating(rating) || Number.isNaN(date.getTime())) throw new Error("잘못된 평가입니다.");
  const days = { again: 1, hard: 3, remembered: 7 }[rating];
  const day = new Date(`${seoulDate(date)}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + days);
  return day.toISOString().slice(0, 10);
}
