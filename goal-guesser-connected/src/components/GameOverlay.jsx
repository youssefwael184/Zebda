import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const CONFETTI_COLORS = ['#00d4ff','#7c3aed','#10b981','#f59e0b','#ec4899','#FFD700'];

const GameOverlay = () => {
  const { gameState, currentUser, startNewGame, dismissOverlay } = useStore();
  
  const navigate = useNavigate();
  const confettiRef = useRef([]);

  const isVisible = gameState.status === 'won' || gameState.status === 'lost';
  const isWon = gameState.status === 'won';

  useEffect(() => {
    if (isWon && isVisible) {
      confettiRef.current = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 2,
        delay: Math.random() * 1.5,
      }));
    }
  }, [isWon, isVisible]);

  const handleNext = () => startNewGame();
  const handleDashboard = () => { dismissOverlay(); navigate('/dashboard'); };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          {isWon && confettiRef.current.map(piece => (
            <div
              key={piece.id}
              className="absolute top-0 confetti-piece rounded-sm pointer-events-none"
              style={{
                left: `${piece.x}%`,
                width: `${piece.size}px`,
                height: `${piece.size * 0.6}px`,
                background: piece.color,
                animationDuration: `${piece.duration}s`,
                animationDelay: `${piece.delay}s`,
              }}
            />
          ))}

          <motion.div
            className="bg-pitch-700 border border-neon-cyan/30 rounded-3xl p-8 w-full max-w-md text-center relative overflow-hidden"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: isWon ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#ef4444,#dc2626)' }}
            />

            <motion.div
              className="text-6xl mb-4 inline-block"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {isWon ? '🏆' : '💀'}
            </motion.div>

            <h2
              className="font-orbitron font-black text-3xl mb-1"
              style={{
                background: isWon ? 'linear-gradient(135deg,#10b981,#34d399)' : 'linear-gradient(135deg,#ef4444,#f87171)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {isWon ? '⚽ GOAL!' : 'GAME OVER'}
            </h2>

            <p className="text-slate-400 text-sm mb-4">
              {isWon ? 'You identified the legend!' : 'Better luck next time!'}
            </p>

            <div className="bg-pitch-600 rounded-xl p-3 mb-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">The answer was</p>
              <p className="font-orbitron font-black text-2xl text-neon-cyan">
                {gameState.player?.nationality} {gameState.word}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {gameState.player?.position}{gameState.player?.club ? ` · ${gameState.player.club}` : ''}
              </p>
            </div>

            <div className="bg-pitch-600 rounded-xl p-4 mb-5">
              <motion.p
                className={`font-orbitron font-black text-3xl ${isWon ? 'text-neon-green' : 'text-neon-red'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
              >
                {isWon ? '+' : ''}{gameState.ratingDelta}
              </motion.p>
              <p className="text-xs text-slate-500 mt-1">
                {isWon ? 'Rating gained (includes speed bonus)' : 'Rating lost'}
              </p>
              <p className="text-slate-400 text-sm mt-2">
                New rating: <span className="font-orbitron font-bold text-white">{currentUser?.rating}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDashboard}
                className="flex-1 py-3 rounded-xl border border-neon-cyan/30 text-slate-300 text-sm
                           font-semibold hover:border-neon-cyan hover:text-neon-cyan transition-all duration-200"
              >
                🏅 Leaderboard
              </button>
              <button onClick={handleNext} className="flex-[2] btn-primary">
                ⚡ NEXT PLAYER
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverlay;
