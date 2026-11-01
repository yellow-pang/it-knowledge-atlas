import pg from 'pg';
import { spawnSync } from 'node:child_process';

const url = new URL(process.env.DATABASE_URL || '');
if (url.hostname !== 'db' || url.pathname !== '/atlas_prod' || url.username !== 'atlas_owner' || !/^[A-Za-z0-9]+$/.test(process.env.APP_DB_PASSWORD || '')) {
  throw new Error('운영 전용 DB 대상 또는 앱 비밀번호를 확인하세요.');
}
const client = new pg.Client({ connectionString: url.toString() });
await client.connect();
try {
  const { rows } = await client.query('SELECT current_database() AS db, current_user AS role');
  if (rows[0].db !== 'atlas_prod' || rows[0].role !== 'atlas_owner') throw new Error('운영 DB 대상이 아닙니다.');
  const role = await client.query("SELECT 1 FROM pg_roles WHERE rolname = 'atlas_app'");
  // 비밀번호는 영문·숫자로 제한하므로 SQL 리터럴에 안전하게 삽입할 수 있다.
  if (!role.rowCount) await client.query(`CREATE ROLE atlas_app LOGIN PASSWORD '${process.env.APP_DB_PASSWORD}'`);
  await client.query('GRANT CONNECT ON DATABASE atlas_prod TO atlas_app');
  const appUrl = new URL(url);
  appUrl.username = 'atlas_app';
  appUrl.password = process.env.APP_DB_PASSWORD;
  const appClient = new pg.Client({ connectionString: appUrl.toString(), connectionTimeoutMillis: 3000 });
  try {
    await appClient.connect();
    const appRole = await appClient.query('SELECT current_user AS role');
    if (appRole.rows[0].role !== 'atlas_app') throw new Error('앱 DB 계정이 일치하지 않습니다.');
  } finally {
    await appClient.end();
  }
  const migration = spawnSync('node', ['node_modules/node-pg-migrate/bin/node-pg-migrate.js', 'up'], { stdio: 'inherit', env: process.env });
  if (migration.status !== 0) throw new Error('마이그레이션 실패');
  await client.query('GRANT USAGE ON SCHEMA public TO atlas_app');
  await client.query('GRANT SELECT, INSERT, UPDATE ON learning_state TO atlas_app');
  await client.query('REVOKE UPDATE ON review_event FROM atlas_app');
  await client.query('GRANT SELECT, INSERT ON review_event TO atlas_app');
} finally {
  await client.end();
}
