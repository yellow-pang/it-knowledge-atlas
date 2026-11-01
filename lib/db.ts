import "server-only";
import { Pool } from "pg";

let pool: Pool | undefined;

export function getDb(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL이 설정되지 않았습니다.");
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 3000 });
    pool.on("error", () => { console.error("유휴 DB 연결이 끊겼습니다."); });
  }
  return pool;
}
