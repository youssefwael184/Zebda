/**
 * @module UserRepository
 * @description Repository Pattern — REMOVED from the frontend.
 *
 * The backend (MySQL via Prisma) is now the data repository.
 * All user persistence goes through the REST API via UserService.
 *
 * This file is kept as a documented tombstone so the git history explains
 * the architectural decision and nothing silently breaks if a stale import exists.
 *
 * If you need to add offline/cache support in the future, re-implement this
 * interface backed by IndexedDB or a service worker — the rest of the code
 * will not need to change (Dependency Inversion Principle).
 */

const UserRepository = {
  findAll:        () => { throw new Error('[UserRepository] Moved to backend — use UserService.getLeaderboard()'); },
  findById:       () => { throw new Error('[UserRepository] Moved to backend — use UserService.getProfile()');    },
  findByUsername: () => { throw new Error('[UserRepository] Moved to backend — use AuthService.login()');         },
  save:           () => { throw new Error('[UserRepository] Moved to backend — use AuthService.register()');      },
  update:         () => { throw new Error('[UserRepository] Moved to backend — handled server-side');             },
  deleteById:     () => { throw new Error('[UserRepository] Moved to backend — not exposed on this client');      },
  leaderboard:    () => { throw new Error('[UserRepository] Moved to backend — use UserService.getLeaderboard()'); },
};

export default UserRepository;
