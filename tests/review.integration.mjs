// 별도의 빈 테스트 DB와 테스트 서버에서만 실행한다.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
const dbUrl = process.env.TEST_DATABASE_URL;
const appUrl = process.env.TEST_APP_URL;
if (!dbUrl || !appUrl) throw new Error('TEST_DATABASE_URL과 TEST_APP_URL이 필요합니다.');
const parsed = new URL(dbUrl);
if (!['localhost', '127.0.0.1'].includes(parsed.hostname) || parsed.pathname !== '/atlas_test' || !['localhost', '127.0.0.1'].includes(new URL(appUrl).hostname)) throw new Error('로컬 atlas_test 전용 DB와 서버만 허용합니다.');
const pool = new pg.Pool({ connectionString: dbUrl });
after(() => pool.end());
const send = (id, conceptId, rating) => fetch(`${appUrl}/api/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, conceptId, rating }) });
test('첫 평가, 재평가, 멱등성, 원자성과 화면', async () => {
  const concept = 'transaction';
  const before = await pool.query('SELECT count(*)::int AS n FROM review_event WHERE concept_id=$1', [concept]);
  const id = randomUUID();
  const first = await send(id, concept, 'again');
  assert.equal(first.status, 200);
  const firstResult = await first.json();
  const replay = await send(id, concept, 'again');
  assert.deepEqual(await replay.json(), firstResult);
  assert.equal((await send(id, concept, 'hard')).status, 409);
  assert.equal((await send(randomUUID(), 'does-not-exist', 'again')).status, 404);
  assert.equal((await send(randomUUID(), concept, 'invalid')).status, 400);
  const second = await send(randomUUID(), concept, 'remembered');
  assert.equal(second.status, 200);
  const next = (await second.json()).nextReviewDate;
  const state = await pool.query('SELECT next_review_date::text, rule_version, first_reviewed_at, last_reviewed_at FROM learning_state WHERE concept_id=$1', [concept]);
  assert.equal(state.rows[0].next_review_date, next);
  assert.equal(state.rows[0].rule_version, 'fixed-1-3-7-v1');
  assert.ok(state.rows[0].first_reviewed_at <= state.rows[0].last_reviewed_at);
  const count = await pool.query('SELECT count(*)::int AS n FROM review_event WHERE concept_id=$1', [concept]);
  assert.equal(count.rows[0].n, before.rows[0].n + 2);
  const failedId = randomUUID();
  await pool.query(`CREATE FUNCTION atlas_test_reject_state() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test failure'; END $$; CREATE TRIGGER atlas_test_reject_state BEFORE INSERT OR UPDATE ON learning_state FOR EACH ROW EXECUTE FUNCTION atlas_test_reject_state()`);
  try { assert.equal((await send(failedId, concept, 'hard')).status, 503); }
  finally { await pool.query('DROP TRIGGER atlas_test_reject_state ON learning_state; DROP FUNCTION atlas_test_reject_state()'); }
  assert.equal((await pool.query('SELECT count(*)::int AS n FROM review_event WHERE id=$1', [failedId])).rows[0].n, 0);
  assert.equal((await send(failedId, concept, 'hard')).status, 200);
  const page = await (await fetch(appUrl)).text();
  assert.match(page, /오늘의 복습/); assert.match(page, /새로운 학습/); assert.match(page, /학습 현황/);
  const detail = await (await fetch(`${appUrl}/concepts/${concept}`)).text();
  assert.match(detail, /생각한 뒤 핵심 내용 확인하기/); assert.match(detail, /기억 상태를 평가해 주세요/);
});
test('시험 연계 화면 조회가 기존 복습 이력과 예정일을 변경하지 않는다', async () => {
  const concept = 'isolation-level';
  assert.equal((await send(randomUUID(), concept, 'remembered')).status, 200);
  const snapshot = async () => ({
    state: (await pool.query('SELECT concept_id, first_reviewed_at, last_reviewed_at, next_review_date::text, rule_version FROM learning_state WHERE concept_id=$1', [concept])).rows,
    events: (await pool.query('SELECT id, concept_id, rating, reviewed_at, next_review_date::text, rule_version FROM review_event WHERE concept_id=$1 ORDER BY id', [concept])).rows,
  });
  const before = await snapshot();
  const response = await fetch(`${appUrl}/concepts/${concept}`);
  assert.equal(response.status, 200);
  const detail = await response.text();
  assert.match(detail, /2023-01-01/); assert.match(detail, /2027-01-01/);
  assert.match(detail, /im-2027-dbms-distributed-files|DBMS과 분산파일처리/);
  assert.match(detail, /3교시/); assert.match(detail, /4번/);
  assert.deepEqual(await snapshot(), before);
});
