import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WordDisplay = ({ word, guessed, isLost }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 my-6">
      {word.split('').map((char, i) => {
        if (char === ' ') return <div key={i} className="w-5 h-12" />;

        const revealed = guessed.includes(char);
        const showAsWrong = isLost && !revealed;

        return (
          <div
            key={i}
            className="relative w-10 h-12 flex items-end justify-center pb-1.5"
            style={{
              borderBottom: '3px solid',
              borderImage: revealed
                ? 'linear-gradient(135deg,#00d4ff,#7c3aed) 1'
                : showAsWrong
                  ? 'linear-gradient(135deg,#ef4444,#ef4444) 1'
                  : 'linear-gradient(135deg,#334155,#334155) 1',
            }}
          >
            <AnimatePresence>
              {(revealed || showAsWrong) && (
                <motion.span
                  key={char + i}
                  initial={{ opacity: 0, y: -14, scale: 0.4 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className={`font-orbitron font-black text-xl leading-none ${
                    showAsWrong ? 'text-neon-red/70' : 'text-neon-cyan'
                  }`}
                >
                  {char}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default WordDisplay;
