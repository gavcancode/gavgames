CREATE TABLE IF NOT EXISTS suggestions (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 game_name TEXT NOT NULL,
 message TEXT NOT NULL,
 game_url TEXT,
 status TEXT NOT NULL DEFAULT 'New',
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_suggestions_created_at ON suggestions(created_at DESC);
