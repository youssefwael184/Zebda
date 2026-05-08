import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MAX_WRONG } from '../data/players';

const popIn = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

const drawIn = {
  hidden: { opacity: 0, pathLength: 0 },
  visible: { opacity: 1, pathLength: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const HangmanSVG = ({ wrongCount, isLost }) => {
  const bodyColor = isLost ? '#ef4444' : '#00d4ff';
  const glow = isLost ? 'drop-shadow(0 0 8px #ef4444)' : 'drop-shadow(0 0 6px #00d4ff)';
  const show = (n) => wrongCount > n;

  return (
    <svg width="220" height="240" viewBox="0 0 220 240" className="w-full max-w-[220px]">
      {/* Gallows */}
      <line x1="10"  y1="230" x2="210" y2="230" stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      <line x1="60"  y1="230" x2="60"  y2="15"  stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      <line x1="60"  y1="15"  x2="145" y2="15"  stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      <line x1="145" y1="15"  x2="145" y2="40"  stroke="#1e3a5f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="145" cy="42" r="2" fill="#1e3a5f" />

      <g style={{ filter: glow }}>
        <AnimatePresence>
          {show(0) && (
            <motion.circle key="head" cx="145" cy="58" r="16"
              fill="none" stroke={bodyColor} strokeWidth="2.5"
              variants={popIn} initial="hidden" animate="visible" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {show(1) && (
            <motion.line key="body" x1="145" y1="74" x2="145" y2="130"
              stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round"
              variants={drawIn} initial="hidden" animate="visible" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {show(2) && (
            <motion.line key="arm-l" x1="145" y1="88" x2="118" y2="112"
              stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round"
              variants={drawIn} initial="hidden" animate="visible" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {show(3) && (
            <motion.line key="arm-r" x1="145" y1="88" x2="172" y2="112"
              stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round"
              variants={drawIn} initial="hidden" animate="visible" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {show(4) && (
            <motion.line key="leg-l" x1="145" y1="130" x2="122" y2="162"
              stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round"
              variants={drawIn} initial="hidden" animate="visible" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {show(5) && (
            <motion.line key="leg-r" x1="145" y1="130" x2="168" y2="162"
              stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round"
              variants={drawIn} initial="hidden" animate="visible" />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {show(MAX_WRONG - 1) && (
            <motion.g key="ball" variants={popIn} initial="hidden" animate="visible">
              <circle cx="145" cy="188" r="13" fill="none" stroke="#ef4444" strokeWidth="2.5" />
              <path d="M137,183 L145,177 L153,183 L151,192 L139,192 Z"
                fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="145" cy="177" r="1.5" fill="#ef4444" />
              <circle cx="153" cy="183" r="1.5" fill="#ef4444" />
              <circle cx="150" cy="192" r="1.5" fill="#ef4444" />
              <circle cx="140" cy="192" r="1.5" fill="#ef4444" />
              <circle cx="137" cy="183" r="1.5" fill="#ef4444" />
            </motion.g>
          )}
        </AnimatePresence>
      </g>
    </svg>
  );
};

export default HangmanSVG;
