import React from 'react';
import { motion } from 'framer-motion';
import { MAX_WRONG } from '../data/players';

const AttemptsBar = ({ wrongCount }) => {
  return (
    <div className="flex gap-2 items-center">
      {Array.from({ length: MAX_WRONG }).map((_, i) => {
        const used = i < wrongCount;
        return (
          <motion.div
            key={i}
            animate={used ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              used
                ? 'bg-neon-red border-neon-red shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                : 'border-slate-600 bg-transparent'
            }`}
          />
        );
      })}
    </div>
  );
};

export default AttemptsBar;
