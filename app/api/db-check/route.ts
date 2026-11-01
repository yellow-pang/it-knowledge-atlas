import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
    await getDb().query("SELECT 1");
    return Response.json({ connected: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ connected: false }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
