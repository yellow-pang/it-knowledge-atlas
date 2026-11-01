exports.up = (pgm) => {
  pgm.sql(`CREATE TABLE learning_state (
    concept_id text PRIMARY KEY CHECK (concept_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    first_reviewed_at timestamptz NOT NULL,
    last_reviewed_at timestamptz NOT NULL,
    next_review_date date NOT NULL,
    rule_version text NOT NULL,
    CHECK (last_reviewed_at >= first_reviewed_at)
  );
  CREATE TABLE review_event (
    id uuid PRIMARY KEY,
    concept_id text NOT NULL CHECK (concept_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    rating text NOT NULL CHECK (rating IN ('again', 'hard', 'remembered')),
    reviewed_at timestamptz NOT NULL,
    next_review_date date NOT NULL,
    rule_version text NOT NULL
  );
  CREATE INDEX learning_state_due_idx ON learning_state (next_review_date);
  CREATE INDEX review_event_concept_idx ON review_event (concept_id, reviewed_at);`);
};
exports.down = (pgm) => { pgm.sql('DROP TABLE review_event; DROP TABLE learning_state;'); };
