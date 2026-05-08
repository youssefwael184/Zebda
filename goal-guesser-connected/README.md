# ⚽ Goal Guesser — Football Hangman Game

> A football-themed Hangman game built as a full Software Engineering project applying Agile, Design Patterns, Clean Code, SOLID principles, and Unit Testing.

---

## 🚀 Quick Start

```bash
npm install
npm start        # development server → http://localhost:3000
npm test         # run all 98 unit tests
npm run build    # production build
```

**Demo credentials:** `demo` / `pass1234`

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AttemptsBar.jsx  # Wrong-guess life indicator
│   ├── Avatar.jsx       # User avatar
│   ├── GameOverlay.jsx  # Win/Lose modal + confetti
│   ├── HangmanSVG.jsx   # Animated SVG figure
│   ├── HintBox.jsx      # Progressive hint display
│   ├── Keyboard.jsx     # A–Z letter buttons
│   ├── Navbar.jsx       # Navigation bar
│   ├── ProtectedRoute.jsx
│   ├── StarField.jsx    # Animated background
│   ├── StatsPanel.jsx   # Player stats sidebar
│   └── WordDisplay.jsx  # Letter boxes
│
├── pages/
│   ├── AuthPage.jsx      # Login + Register
│   ├── GamePage.jsx      # Main game screen
│   └── DashboardPage.jsx # Leaderboard
│
├── patterns/             # ★ Design Patterns
│   ├── UserRepository.js # Repository Pattern
│   ├── factories.js      # Factory Pattern (User + Game)
│   ├── RatingStrategy.js # Strategy Pattern
│   └── GameEventBus.js   # Observer Pattern
│
├── services/             # Business logic (no UI)
│   ├── AuthService.js    # Authentication logic
│   └── GameService.js    # Game rules + rating
│
├── store/
│   └── useStore.js       # Zustand global state
│
├── data/
│   ├── players.js        # 24 football players (4 difficulties)
│   └── tiers.js          # Rating tiers + difficulty thresholds
│
├── utils/
│   └── uuid.js           # UUID generator (no external dep)
│
└── tests/                # ★ Unit Tests (98 tests, 5 suites)
    ├── RatingStrategy.test.js
    ├── AuthService.test.js
    ├── GameService.test.js
    ├── UserRepository.test.js
    └── factories.test.js
```

---

## 🏗️ Architecture

### Layered Architecture

```
┌──────────────────────────────────────┐
│           UI Layer                   │
│   (React components + pages)         │
├──────────────────────────────────────┤
│         State Layer                  │
│         (Zustand store)              │
├──────────────────────────────────────┤
│        Service Layer                 │
│   AuthService  │  GameService        │
├──────────────────────────────────────┤
│       Pattern Layer                  │
│  Repository │ Factory │ Strategy     │
│             │ Observer               │
├──────────────────────────────────────┤
│         Data Layer                   │
│      localStorage (via Repo)         │
└──────────────────────────────────────┘
```

---

## 🎨 Design Patterns

### 1. Repository Pattern — `UserRepository.js`
Abstracts all data access. No component ever reads/writes `localStorage` directly.

```js
UserRepository.findByUsername('demo')
UserRepository.save(newUser)
UserRepository.leaderboard()
```

### 2. Factory Pattern — `factories.js`
Centralises object creation. Shape changes in one place only.

```js
UserFactory.createNew({ username, email, password })
GameFactory.createForRating(1500)   // picks difficulty automatically
GameFactory.createEmpty()
```

### 3. Strategy Pattern — `RatingStrategy.js`
Each difficulty has its own rating algorithm. Add a new difficulty → add one new strategy object, zero other changes.

```js
const strategy = getRatingStrategy('hard')
strategy.calculateWin(wrongCount)   // +40 + speed bonus
strategy.calculateLoss(currentRating) // -20, floored at MIN_RATING
```

### 4. Observer Pattern — `GameEventBus.js`
Pub/Sub event bus. Components react to game events without tight coupling.

```js
GameEventBus.on('game:won',  handler)
GameEventBus.emit('game:won', { ratingDelta: 52 })
GameEventBus.once('game:started', handler)
```

---

## 🔷 SOLID Principles

| Principle | Where Applied |
|---|---|
| **S**ingle Responsibility | `AuthService` only handles auth. `GameService` only handles game rules. `UserRepository` only handles data access. |
| **O**pen/Closed | Add new difficulty → add one new Strategy. No existing code changes. |
| **L**iskov Substitution | All rating strategies are substitutable — they share the same interface. |
| **I**nterface Segregation | `AuthService` doesn't expose game methods. `GameService` doesn't expose auth. |
| **D**ependency Inversion | `GameService` depends on `getRatingStrategy()` abstraction, not on concrete strategies. |

---

## ⚙️ Rating System

| Difficulty | Rating Needed | Win | Loss | Speed Bonus |
|---|---|---|---|---|
| Easy | < 1400 | +15 | −5 | +3 per saved guess |
| Medium | 1400–1699 | +25 | −10 | +3 per saved guess |
| Hard | 1700–1999 | +40 | −20 | +3 per saved guess |
| Legend | ≥ 2000 | +60 | −35 | +3 per saved guess |

### Tiers
`Bronze → Silver → Gold → Platinum → Diamond → Legend`

---

## 🧪 Testing

```bash
npm test
```

| Test Suite | Tests | Coverage |
|---|---|---|
| `RatingStrategy.test.js` | 18 | Strategy Pattern, all difficulties, Liskov |
| `AuthService.test.js` | 14 | Login, Register, validation |
| `GameService.test.js` | 21 | Guesses, Win, Loss, Events, Guards |
| `UserRepository.test.js` | 13 | CRUD, Leaderboard sort |
| `factories.test.js` | 32 | Factory + Observer (EventBus) |
| **Total** | **98** | |

---

## 🔄 Agile Process (Scrum — 4 Sprints)

### Sprint 1 — Foundation
- Auth system (Login/Register)
- User data model and repository
- Basic routing

### Sprint 2 — Core Game
- Hangman SVG component
- Letter guessing logic
- Game state management

### Sprint 3 — Patterns & Rating
- Strategy Pattern for rating
- Observer Pattern (EventBus)
- Factory Pattern refactor
- Difficulty system

### Sprint 4 — Polish & QA
- Leaderboard dashboard
- Animations (Framer Motion)
- Unit tests (98 tests)
- Documentation

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react` | UI framework |
| `react-router-dom` | Client-side routing |
| `zustand` | Global state management |
| `framer-motion` | Animations |
| `tailwindcss` | Utility-first CSS |

---

## 🌿 Git Branching Strategy

```
main
├── develop
│   ├── feature/auth-system
│   ├── feature/game-core
│   ├── feature/design-patterns
│   ├── feature/rating-strategy
│   └── feature/leaderboard
└── hotfix/*
```

---

## 👥 Team Roles (Scrum)

| Role | Responsibility |
|---|---|
| Product Owner | Requirements, user stories, sprint backlog |
| Software Engineer | Architecture, design patterns, code review |
| Developer(s) | Feature implementation, clean code |
| QA / Test Engineer | Unit tests, test cases, quality assurance |
