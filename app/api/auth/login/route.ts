import { login, sameOrigin } from "@/lib/auth";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "요청을 확인해 주세요." }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "요청을 확인해 주세요." }, { status: 400 });
  try {
    const data = await request.json();
    if (typeof data?.username !== "string" || typeof data?.password !== "string" || data.username.length > 128 || data.password.length > 1024 || !data.username || !data.password) return Response.json({ error: "계정과 비밀번호를 확인해 주세요." }, { status: 400 });
    const result = await login(data.username, data.password);
    if (result.status === "limited") return Response.json({ error: "로그인 시도가 너무 많습니다. 15분 뒤 다시 시도해 주세요." }, { status: 429 });
    if (result.status === "invalid") return Response.json({ error: "계정 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "로그인할 수 없습니다. 잠시 후 다시 시도해 주세요." }, { status: 503 }); }
}
