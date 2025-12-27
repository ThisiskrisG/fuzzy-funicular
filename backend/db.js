const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'cadet-space.db');
const db = new sqlite3.Database(dbPath);

const schema = `
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  callsign TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lobbies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  max_players INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lobby_players (
  lobby_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  joined_at TEXT NOT NULL,
  PRIMARY KEY (lobby_id, player_id),
  FOREIGN KEY (lobby_id) REFERENCES lobbies(id),
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS rounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lobby_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  lever_count INTEGER NOT NULL,
  completion_time_ms INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (lobby_id) REFERENCES lobbies(id),
  FOREIGN KEY (player_id) REFERENCES players(id)
);
`;

const initDb = () => {
  db.exec(schema);
};

module.exports = { db, initDb };
