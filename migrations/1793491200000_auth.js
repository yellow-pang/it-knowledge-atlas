exports.up = (pgm) => { pgm.sql(`CREATE TABLE auth_session (token_hash text PRIMARY KEY, expires_at timestamptz NOT NULL);
CREATE TABLE auth_attempt (id integer PRIMARY KEY CHECK (id = 1), failures integer NOT NULL, blocked_until timestamptz);
INSERT INTO auth_attempt VALUES (1, 0, NULL);`); };
exports.down = (pgm) => { pgm.sql('DROP TABLE auth_session; DROP TABLE auth_attempt;'); };
