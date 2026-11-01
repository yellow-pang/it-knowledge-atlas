import { logout, sameOrigin } from "@/lib/auth";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try { await logout(); return Response.redirect(new URL("/login", process.env.APP_ORIGIN), 303); }
  catch { return Response.json({ error: "로그아웃하지 못했습니다. 다시 시도해 주세요." }, { status: 503 }); }
}
