import { authenticated, sameOrigin } from "@/lib/auth";
import { getConcepts } from "@/lib/concepts";
import { RequestConflict, saveReview } from "@/lib/progress";
import { isRating } from "@/lib/review";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "요청을 확인해 주세요." }, { status: 403 });
  if (!await authenticated()) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  let data: unknown;
  try { data = await request.json(); } catch { return Response.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 }); }
  if (!data || typeof data !== "object") return Response.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  const { id, conceptId, rating } = data as Record<string, unknown>;
  if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || typeof conceptId !== "string" || !isRating(rating)) return Response.json({ error: "평가 값을 확인해 주세요." }, { status: 400 });
  try {
    if (!getConcepts().some((concept) => concept.id === conceptId)) return Response.json({ error: "존재하지 않는 개념입니다." }, { status: 404 });
    const nextReviewDate = await saveReview(id, conceptId, rating);
    revalidatePath("/");
    return Response.json({ nextReviewDate });
  } catch (error) {
    if (error instanceof RequestConflict) return Response.json({ error: "이미 사용된 평가 요청입니다." }, { status: 409 });
    return Response.json({ error: "저장하지 못했습니다. 연결을 확인하고 다시 시도해 주세요." }, { status: 503 });
  }
}
