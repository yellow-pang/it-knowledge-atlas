import "server-only";
import { Pool } from "pg";

let pool: Pool | undefined;

export function getDb(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL이 설정되지 않았습니다.");
  }
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 3000 });
  return pool;
}
