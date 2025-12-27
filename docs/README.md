# IVP Starter Bundle

This is the starter pack for IVP (Internet Visionary Provider). It includes:

- Frontend: `index.html`
- Backend: Node/Express API
- Q&A Plugin: `whisper_bot.js`
- Deploy scaffold
- Certs placeholder

## Cadet Space Game (Part 3) API

A Node/Express API powers multiplayer lobbies and a leaderboard for the multi-lever cadet space game.
The service stores player stats in a SQLite database for quick leaderboard queries.

### Quick start

```bash
cd backend
npm install
npm run start
```

### Core endpoints

- `POST /api/players` — create a player (`{ "callsign": "Nova" }`).
- `POST /api/lobbies` — create a lobby (`{ "name": "Alpha Wing", "maxPlayers": 6 }`).
- `POST /api/lobbies/:lobbyId/join` — join a lobby (`{ "playerId": 1 }`).
- `POST /api/leaderboard/record` — record a round (`{ "lobbyId": 1, "playerId": 1, "score": 9200, "leverCount": 6, "completionTimeMs": 45200 }`).
- `GET /api/leaderboard?scope=overall|lobby&lobbyId=1&limit=10` — fetch leaderboard rows.
- `GET /api/players/:playerId/stats` — fetch a player stat summary.
