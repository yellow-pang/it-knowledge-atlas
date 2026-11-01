import "server-only";
import { getDb } from "./db";
import { nextReviewDate, REVIEW_RULE_VERSION, type Rating } from "./review";

export type State = { concept_id: string; first_reviewed_at: Date; last_reviewed_at: Date; next_review_date: string; rule_version: string };
export async function getStates(): Promise<State[]> {
  const result = await getDb().query<State>("SELECT concept_id, first_reviewed_at, last_reviewed_at, next_review_date::text, rule_version FROM learning_state");
  return result.rows;
}
export class RequestConflict extends Error {}
export async function saveReview(id: string, conceptId: string, rating: Rating) {
  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    // Serialize evaluations of the same concept, including concurrent first evaluations.
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [conceptId]);
    const at = new Date();
    const next = nextReviewDate(at, rating);
    const inserted = await client.query<{ concept_id: string; rating: string; next_review_date: string }>(
      `INSERT INTO review_event (id, concept_id, rating, reviewed_at, next_review_date, rule_version)
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING
       RETURNING concept_id, rating, next_review_date::text`, [id, conceptId, rating, at, next, REVIEW_RULE_VERSION]);
    if (!inserted.rowCount) {
      const existing = await client.query<{ concept_id: string; rating: string; next_review_date: string }>("SELECT concept_id, rating, next_review_date::text FROM review_event WHERE id = $1", [id]);
      const event = existing.rows[0];
      if (!event || event.concept_id !== conceptId || event.rating !== rating) throw new RequestConflict();
      await client.query("COMMIT");
      return event.next_review_date;
    }
    await client.query(`INSERT INTO learning_state (concept_id, first_reviewed_at, last_reviewed_at, next_review_date, rule_version)
      VALUES ($1, $2, $2, $3, $4) ON CONFLICT (concept_id) DO UPDATE SET
      last_reviewed_at = EXCLUDED.last_reviewed_at, next_review_date = EXCLUDED.next_review_date, rule_version = EXCLUDED.rule_version`, [conceptId, at, next, REVIEW_RULE_VERSION]);
    await client.query("COMMIT");
    return next;
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}
