const express = require('express');
const { db, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function handle(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });

initDb();

app.use(express.json());

app.get('/api/status', (_req, res) => {
  res.json({ status: 'ok', service: 'cadet-space-api' });
});

app.post('/api/players', async (req, res) => {
  const { callsign } = req.body || {};
  if (!callsign || typeof callsign !== 'string') {
    res.status(400).json({ error: 'callsign is required' });
    return;
  }

  const result = await run(
    'INSERT INTO players (callsign, created_at) VALUES (?, ?)',
    [callsign.trim(), new Date().toISOString()]
  );

  const player = await get('SELECT * FROM players WHERE id = ?', [result.lastID]);
  res.status(201).json(player);
});

app.post('/api/lobbies', async (req, res) => {
  const { name, maxPlayers = 4 } = req.body || {};
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'name is required' });
    return;
  }

  const result = await run(
    'INSERT INTO lobbies (name, max_players, created_at) VALUES (?, ?, ?)',
    [name.trim(), Number(maxPlayers) || 4, new Date().toISOString()]
  );

  const lobby = await get('SELECT * FROM lobbies WHERE id = ?', [result.lastID]);
  res.status(201).json(lobby);
});

app.post('/api/lobbies/:lobbyId/join', async (req, res) => {
  const lobbyId = Number(req.params.lobbyId);
  const { playerId } = req.body || {};
  if (!lobbyId || !playerId) {
    res.status(400).json({ error: 'lobbyId and playerId are required' });
    return;
  }

  const lobby = await get('SELECT * FROM lobbies WHERE id = ?', [lobbyId]);
  if (!lobby) {
    res.status(404).json({ error: 'lobby not found' });
    return;
  }

  const currentPlayers = await get(
    'SELECT COUNT(*) as count FROM lobby_players WHERE lobby_id = ?',
    [lobbyId]
  );

  if (currentPlayers.count >= lobby.max_players) {
    res.status(409).json({ error: 'lobby is full' });
    return;
  }

  await run(
    'INSERT OR IGNORE INTO lobby_players (lobby_id, player_id, joined_at) VALUES (?, ?, ?)',
    [lobbyId, Number(playerId), new Date().toISOString()]
  );

  const players = await all(
    `
    SELECT players.id, players.callsign, lobby_players.joined_at
    FROM lobby_players
    JOIN players ON players.id = lobby_players.player_id
    WHERE lobby_players.lobby_id = ?
    ORDER BY lobby_players.joined_at ASC
  `,
    [lobbyId]
  );

  res.json({ lobbyId, players });
});

app.post('/api/leaderboard/record', async (req, res) => {
  const {
    lobbyId,
    playerId,
    score,
    leverCount,
    completionTimeMs
  } = req.body || {};

  if (!lobbyId || !playerId || score === undefined) {
    res.status(400).json({
      error: 'lobbyId, playerId, and score are required'
    });
    return;
  }

  const result = await run(
    `
    INSERT INTO rounds (lobby_id, player_id, score, lever_count, completion_time_ms, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [
      Number(lobbyId),
      Number(playerId),
      Number(score),
      Number(leverCount) || 0,
      Number(completionTimeMs) || 0,
      new Date().toISOString()
    ]
  );

  const round = await get('SELECT * FROM rounds WHERE id = ?', [result.lastID]);
  res.status(201).json(round);
});

app.get('/api/leaderboard', async (req, res) => {
  const { scope = 'overall', lobbyId, limit = 10 } = req.query;
  const max = Math.min(Number(limit) || 10, 50);

  let rows;
  if (scope === 'lobby' && lobbyId) {
    rows = await all(
      `
      SELECT players.id as player_id, players.callsign,
             MAX(rounds.score) as best_score,
             AVG(rounds.lever_count) as average_levers,
             MIN(rounds.completion_time_ms) as best_time_ms
      FROM rounds
      JOIN players ON players.id = rounds.player_id
      WHERE rounds.lobby_id = ?
      GROUP BY players.id
      ORDER BY best_score DESC, best_time_ms ASC
      LIMIT ?
    `,
      [Number(lobbyId), max]
    );
  } else {
    rows = await all(
      `
      SELECT players.id as player_id, players.callsign,
             MAX(rounds.score) as best_score,
             AVG(rounds.lever_count) as average_levers,
             MIN(rounds.completion_time_ms) as best_time_ms
      FROM rounds
      JOIN players ON players.id = rounds.player_id
      GROUP BY players.id
      ORDER BY best_score DESC, best_time_ms ASC
      LIMIT ?
    `,
      [max]
    );
  }

  res.json({ scope, lobbyId: lobbyId ? Number(lobbyId) : null, results: rows });
});

app.get('/api/players/:playerId/stats', async (req, res) => {
  const playerId = Number(req.params.playerId);
  const player = await get('SELECT * FROM players WHERE id = ?', [playerId]);
  if (!player) {
    res.status(404).json({ error: 'player not found' });
    return;
  }

  const stats = await get(
    `
    SELECT
      COUNT(*) as rounds_played,
      MAX(score) as best_score,
      AVG(score) as average_score,
      AVG(lever_count) as average_levers,
      MIN(completion_time_ms) as best_time_ms
    FROM rounds
    WHERE player_id = ?
  `,
    [playerId]
  );

  res.json({ player, stats });
});

app.get('/api/lobbies/:lobbyId', async (req, res) => {
  const lobbyId = Number(req.params.lobbyId);
  const lobby = await get('SELECT * FROM lobbies WHERE id = ?', [lobbyId]);
  if (!lobby) {
    res.status(404).json({ error: 'lobby not found' });
    return;
  }

  const players = await all(
    `
    SELECT players.id, players.callsign, lobby_players.joined_at
    FROM lobby_players
    JOIN players ON players.id = lobby_players.player_id
    WHERE lobby_players.lobby_id = ?
    ORDER BY lobby_players.joined_at ASC
  `,
    [lobbyId]
  );

  res.json({ lobby, players });
});

app.listen(PORT, () => {
  console.log(`Cadet Space API listening on ${PORT}`);
});
