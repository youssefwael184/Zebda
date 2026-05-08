import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { getTier, getTierProgress } from '../data/tiers';

const StatsPanel = () => {
  const { currentUser, gameState } = useStore();
  if (!currentUser) return null;

  const tier = getTier(currentUser.rating);
  const progress = getTierProgress(currentUser.rating);

  const stats = [
    { label: 'Rating', value: currentUser.rating, emoji: '⭐' },
    { label: 'Wins',   value: currentUser.wins,   emoji: '🏆' },
    { label: 'Streak', value: currentUser.streak, emoji: '🔥' },
    { label: 'Played', value: currentUser.games,  emoji: '🎮' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="flex flex-col gap-4"
    >
      {/* Tier card */}
      <div className="card p-4 animate-float">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Current Tier</p>
            <p className="font-orbitron font-bold text-base" style={{ color: tier.color }}>{tier.name}</p>
          </div>
          <span className="text-3xl">{tier.icon}</span>
        </div>
        <div className="h-1.5 bg-pitch-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${tier.color}, #7c3aed)` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-slate-600 mt-1.5 text-right">{Math.round(progress)}% to next tier</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map(({ label, value, emoji }) => (
          <div key={label} className="stat-card">
            <p className="text-lg mb-0.5">{emoji}</p>
            <p className="font-orbitron font-black text-xl gradient-text">{value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Wrong letters */}
      <div className="bg-pitch-600 border border-neon-cyan/10 rounded-xl p-3">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Wrong Guesses</p>
        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
          {gameState.wrong.length === 0 ? (
            <span className="text-slate-700 text-xs italic">None yet...</span>
          ) : (
            gameState.wrong.map(l => (
              <motion.span
                key={l}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="px-2 py-0.5 bg-neon-red/10 border border-neon-red/30 rounded-md text-neon-red font-orbitron font-bold text-sm"
              >
                {l}
              </motion.span>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsPanel;
