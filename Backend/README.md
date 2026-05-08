# ⚽ Goal Guesser — Backend API

Node.js / Express REST API for the Goal Guesser football Hangman game.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js ≥ 18                      |
| Framework   | Express 4                         |
| ORM         | Prisma 5                          |
| Database    | PostgreSQL (SQLite for local dev) |
| Auth        | JWT + Refresh Token rotation      |
| Validation  | express-validator                 |
| Security    | helmet, cors, express-rate-limit  |

---

## Project Structure

```
goal-guesser-backend/
├── prisma/
│   ├── schema.prisma        # Database models
│   └── seed.js              # 25 football players across 4 difficulty tiers
│
└── src/
    ├── server.js            # Entry point — starts HTTP server
    ├── app.js               # Express app factory — middleware & routes
    │
    ├── config/
    │   ├── database.js      # Prisma singleton
    │   ├── jwt.js           # Sign / verify access & refresh tokens
    │   └── constants.js     # MAX_WRONG, HINTS, RATING deltas, etc.
    │
    ├── middleware/
    │   ├── auth.js          # Bearer JWT verification → req.user
    │   ├── errorHandler.js  # Global JSON error formatter
    │   ├── validate.js      # express-validator result checker
    │   └── rateLimiter.js   # API + auth rate limiters
    │
    ├── services/            # All business logic (thin controllers call these)
    │   ├── auth.service.js  # register · login · refresh · logout
    │   ├── game.service.js  # startGame · guessLetter · getActiveSession
    │   └── user.service.js  # getProfile · getLeaderboard · getGameHistory
    │
    ├── controllers/         # HTTP layer — req/res only, delegates to services
    │   ├── auth.controller.js
    │   ├── game.controller.js
    │   └── user.controller.js
    │
    ├── routes/              # Express routers with validation rules
    │   ├── auth.routes.js
    │   ├── game.routes.js
    │   └── user.routes.js
    │
    └── utils/
        ├── game.js          # Pure functions: masking, hints, rating, avatar
        ├── error.js         # createError(status, message)
        └── response.js      # ok() / created() JSON helpers
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, REFRESH_TOKEN_SECRET
```

### 3. Set up the database
```bash
# Push schema to DB (development)
npm run db:push

# OR run migrations (production-ready)
npm run db:migrate

# Seed 25 football players
npm run db:seed
```

### 4. Start the server
```bash
npm run dev      # development (nodemon)
npm start        # production
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint       | Auth | Body                                  | Description              |
|--------|---------------|------|---------------------------------------|--------------------------|
| POST   | /register     | ❌   | `username, email?, password`          | Create account           |
| POST   | /login        | ❌   | `username, password`                  | Login → tokens           |
| POST   | /refresh      | ❌   | `refreshToken`                        | Rotate refresh token     |
| POST   | /logout       | ❌   | `refreshToken`                        | Revoke refresh token     |
| POST   | /logout-all   | ✅   | —                                     | Revoke all tokens        |

### Game — `/api/game`  *(all protected)*

| Method | Endpoint   | Body       | Description                          |
|--------|-----------|------------|--------------------------------------|
| POST   | /start    | —          | Start new game (abandons any open)   |
| POST   | /guess    | `letter`   | Guess one letter                     |
| GET    | /session  | —          | Get current active session           |

### Users — `/api/users`

| Method | Endpoint      | Auth | Description                  |
|--------|--------------|------|------------------------------|
| GET    | /leaderboard | ❌   | Top 50 users by rating       |
| GET    | /me          | ✅   | My profile + stats           |
| GET    | /history     | ✅   | Last 20 completed games      |

---

## Game Session Response Shape

```json
{
  "success": true,
  "session": {
    "sessionId": "uuid",
    "status": "playing | won | lost",
    "difficulty": "EASY | MEDIUM | HARD | LEGEND",
    "maskedWord": "_ _ _ l i a n   _ b a p p e",
    "guessed": ["L", "I", "A", "N"],
    "wrong": ["X", "Z"],
    "hints": [
      { "label": "🌍 Nationality", "value": "France" }
    ],
    "wrongCount": 2,
    "maxWrong": 6,
    "lastGuessCorrect": true,
    "player": null
  }
}
```
> `player` is `null` during play — revealed only on `won` or `lost`.

---

## Difficulty & Rating System

| Tier   | Rating Range | Wrong Guess Reward | Loss Penalty |
|--------|--------------|--------------------|--------------|
| EASY   | 0 – 1199     | +10                | −5           |
| MEDIUM | 1200 – 1499  | +20                | −10          |
| HARD   | 1500 – 1799  | +35                | −15          |
| LEGEND | 1800+        | +50                | −20          |

Starting rating: **1000** (EASY tier)

---

## Hint Reveal Order

Each wrong guess unlocks the next hint (max 6):

1. 🌍 Nationality
2. ⚽ Position
3. 🏟️ Club
4. 🏆 League
5. 📅 Age
6. 🎽 Jersey Number
