# ⚽ Goal Guesser

> **Guess the football legend — a hangman-style football trivia game with live leaderboards and a rating system.**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Game Mechanics](#game-mechanics)
- [Rating & Tier System](#rating--tier-system)
- [API Endpoints](#api-endpoints)

---

## Overview

Goal Guesser is a full-stack web game where players guess the names of famous football players letter by letter (hangman-style). The difficulty adapts dynamically based on the player's rating. Wrong guesses unlock progressive hints about the player. Scores are tracked on a live leaderboard.

---

## Features

- 🔐 **Authentication** — Register / Login with JWT access + refresh tokens, auto-refresh on expiry
- ⚽ **Adaptive Difficulty** — Easy / Medium / Hard / Legend tiers assigned based on your current rating
- 💡 **Progressive Hints** — Unlock up to 5 hints per wrong guess
- 🏆 **Live Leaderboard** — Real-time ranking with tier badges
- ⚡ **Speed Bonus** — Extra rating points for guessing with fewer wrong attempts
- 🎨 **Animated UI** — Hangman SVG, confetti on win, smooth letter reveals
- 📱 **Responsive** — Works on mobile and desktop

---

## Tech Stack

### Frontend
| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Zustand | Global state management |
| React Router v6 | Client-side routing |
| Framer Motion | Animations |
| Tailwind CSS | Styling |
| Axios | HTTP client |

### Backend *(expected)*
| Tech | Purpose |
|---|---|
| Node.js / Express | REST API server |
| MySQL + Prisma | Database & ORM |
| JWT | Auth tokens (access + refresh) |

---

## Project Structure

```
src/
├── components/
│   ├── AttemptsBar.jsx      # Wrong attempt dots indicator
│   ├── Avatar.jsx           # User initials avatar
│   ├── GameOverlay.jsx      # Win/Loss modal with confetti
│   ├── HangmanSVG.jsx       # Animated hangman drawing
│   ├── HintBox.jsx          # Progressive hint display
│   ├── Keyboard.jsx         # On-screen A–Z keyboard
│   ├── Navbar.jsx           # Top navigation with tier badge
│   ├── ProtectedRoute.jsx   # Auth guard for routes
│   ├── StarField.jsx        # Animated background stars
│   ├── StatsPanel.jsx       # Sidebar stats & tier progress
│   └── WordDisplay.jsx      # Letter blanks with reveal animation
│
├── data/
│   ├── players.js           # Player definitions (now served by backend)
│   └── tiers.js             # Tier config, difficulty mapping, helpers
│
├── pages/
│   ├── AuthPage.jsx         # Login / Register
│   ├── DashboardPage.jsx    # Leaderboard & personal stats
│   └── GamePage.jsx         # Main game board
│
├── patterns/
│   ├── factories.js         # Factory pattern — safe default shapes
│   ├── GameEventBus.js      # Observer pattern — decoupled game events
│   ├── RatingStrategy.js    # Strategy pattern — per-difficulty rating calc
│   └── UserRepository.js    # Tombstone — moved to backend
│
├── services/
│   ├── api.js               # Axios instance, token interceptors
│   ├── AuthService.js       # /auth/* API calls
│   ├── GameService.js       # /games/* API calls
│   └── UserService.js       # /users/* API calls
│
├── store/
│   └── useStore.js          # Zustand store — state coordination
│
└── utils/
    └── uuid.js              # UUID v4 generator
```

---

## Architecture & Design Patterns

The codebase intentionally demonstrates several classic design patterns:

### 🏭 Factory Pattern — `patterns/factories.js`
Creates safe default shapes for `GameState` and `User` objects so the UI always has a typed, empty object to render from — even before the first API response arrives.

### 📡 Observer Pattern — `patterns/GameEventBus.js`
A pub/sub event bus that decouples game logic from UI reactions. Components subscribe to events like `game:won` or `game:letter:wrong` without knowing what emits them.

```js
GameEventBus.on('game:won', ({ ratingDelta }) => showCelebration(ratingDelta));
GameEventBus.emit('game:won', { player, ratingDelta: 25 });
```

### ♟️ Strategy Pattern — `patterns/RatingStrategy.js`
Each difficulty level has its own rating calculation strategy. Adding a new difficulty only requires adding a new strategy object — no existing code changes (Open/Closed Principle).

### 🗄️ Repository Pattern — `patterns/UserRepository.js`
Originally handled local storage persistence. After backend integration, all persistence moved to MySQL via Prisma. The file is kept as a documented tombstone explaining the architectural decision.

### SOLID Principles Applied
- **S** — Each service file (Auth, Game, User) has a single responsibility
- **O** — New difficulties/strategies extend without modifying existing ones
- **D** — Store depends on service abstractions, not Axios directly

---

## Getting Started

### Prerequisites
- Node.js 18+
- A running backend API (see [Environment Variables](#environment-variables))

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd goal-guesser-connected

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the dev server
npm start
```

The app runs at `http://localhost:3000` by default.

---

## Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5000
```

| Variable | Description | Default |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## Game Mechanics

1. **Start** — The server picks a football player based on your current rating tier.
2. **Guess** — Click letters on the on-screen keyboard.
3. **Wrong guess** — Part of the hangman is drawn and a hint is unlocked.
4. **Win condition** — Reveal all letters in the player's name.
5. **Lose condition** — 6 wrong guesses (full hangman + football).
6. **Rating** — Win = base points + speed bonus; Loss = rating deduction (floor: 800).

### Speed Bonus
Every wrong guess "saved" earns `+3` extra rating points on a win.

```
Rating gained = baseWin + (MAX_WRONG - wrongCount) × 3
```

---

## Rating & Tier System

| Tier | Rating Range | Difficulty |
|---|---|---|
| 🥉 Bronze | 800 – 1199 | Easy |
| 🥈 Silver | 1200 – 1499 | Medium |
| 🥇 Gold | 1500 – 1999 | Hard |
| 💎 Platinum | 2000 – 2299 | Legend |
| 💠 Diamond | 2300 – 2599 | Legend |
| 👑 Legend | 2600+ | Legend |

All players start at **1000 rating** (Bronze tier).

---

## API Endpoints

The frontend expects the following REST endpoints:

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create new account |
| `POST` | `/auth/login` | Login, returns JWT tokens |
| `POST` | `/auth/logout` | Revoke current refresh token |
| `POST` | `/auth/refresh` | Exchange refresh token for new access token |

### Game
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/games/start` | Start a new game session |
| `POST` | `/games/guess` | Submit a letter guess `{ letter }` |
| `GET` | `/games/session` | Reconnect to active session |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users/me` | Get authenticated user profile |
| `GET` | `/users/leaderboard` | Get top players `?limit=50` |
| `GET` | `/users/history` | Get game history `?limit=20` |

---

## 🎨 UI Theme

The app uses a custom dark football-pitch aesthetic defined in `tailwind.config.js`:

- **Background:** Deep navy (`#0a0e1a`)
- **Accent:** Neon cyan (`#00d4ff`) + Purple (`#7c3aed`)
- **Fonts:** Orbitron (headings) + Exo 2 (body)
- **Animations:** Twinkle stars, shimmer borders, confetti rain on win

---

*Built with ⚽ and React*
