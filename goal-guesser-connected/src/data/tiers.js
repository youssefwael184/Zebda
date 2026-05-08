export const TIERS = [
  { name: 'Bronze',   min: 800,  max: 1399, icon: '🥉', color: '#CD7F32' },
  { name: 'Silver',   min: 1400, max: 1699, icon: '🥈', color: '#C0C0C0' },
  { name: 'Gold',     min: 1700, max: 1999, icon: '🥇', color: '#FFD700' },
  { name: 'Platinum', min: 2000, max: 2299, icon: '💎', color: '#00d4ff' },
  { name: 'Diamond',  min: 2300, max: 2599, icon: '💠', color: '#a78bfa' },
  { name: 'Legend',   min: 2600, max: 9999, icon: '👑', color: '#ef4444' },
];

export const MIN_RATING = 800;

export function getTier(rating) {
  return TIERS.find(t => rating >= t.min && rating <= t.max) ?? TIERS[TIERS.length - 1];
}

export function getTierProgress(rating) {
  const tier = getTier(rating);
  const tierIndex = TIERS.findIndex(t => t.name === tier.name);
  const next = TIERS[tierIndex + 1];
  if (!next) return 100;
  return ((rating - tier.min) / (next.min - tier.min)) * 100;
}

export function getDifficultyFromRating(rating) {
  if (rating < 1400) return 'easy';
  if (rating < 1700) return 'medium';
  if (rating < 2000) return 'hard';
  return 'legend';
}

export const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   emoji: '⚽', colorClass: 'text-neon-green', bgClass: 'bg-neon-green/10',  borderClass: 'border-neon-green/40'  },
  medium: { label: 'Medium', emoji: '🏆', colorClass: 'text-neon-amber', bgClass: 'bg-neon-amber/10',  borderClass: 'border-neon-amber/40'  },
  hard:   { label: 'Hard',   emoji: '🔥', colorClass: 'text-neon-red',   bgClass: 'bg-neon-red/10',    borderClass: 'border-neon-red/40'    },
  legend: { label: 'Legend', emoji: '👑', colorClass: 'text-purple-400', bgClass: 'bg-purple-500/10',  borderClass: 'border-purple-500/40'  },
};
