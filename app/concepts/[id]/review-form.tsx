"use client";
import { useRef, useState } from "react";
import type { Rating } from "@/lib/review";

function requestId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export function ReviewForm({ conceptId }: { conceptId: string }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState<{ id: string; rating: Rating } | null>(null);
  const busy = useRef(false);
  async function submit(rating: Rating, previous?: { id: string; rating: Rating }) {
    if (busy.current) return;
    busy.current = true; setPending(true); setMessage("");
    const attempt = previous ?? { id: requestId(), rating };
    setRetry(attempt);
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...attempt, conceptId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "저장하지 못했습니다.");
      setRetry(null); setMessage(`저장했습니다. 다음 복습일: ${result.nextReviewDate}`);
    } catch { setMessage("저장 여부를 확인하지 못했습니다. 같은 요청으로 다시 시도해 주세요."); }
    finally { busy.current = false; setPending(false); }
  }
  return <section className="review"><p className="eyebrow">SELF REVIEW</p><h2>기억 상태를 평가해 주세요</h2><p>핵심 키워드나 설명 목차를 떠올리고 비교한 뒤 선택하세요.</p>
    <div className="review-buttons">{([["again", "다시 · 1일"], ["hard", "어려움 · 3일"], ["remembered", "기억남 · 7일"]] as const).map(([value, label]) => <button key={value} disabled={pending || !!retry} onClick={() => submit(value)}>{label}</button>)}</div>
    {retry && <button disabled={pending} onClick={() => submit(retry.rating, retry)}>같은 평가 다시 저장</button>}
    <p role="status" aria-live="polite">{pending ? "저장 중입니다…" : message}</p>
  </section>;
}
