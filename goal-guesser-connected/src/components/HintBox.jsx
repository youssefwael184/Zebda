import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const HintBox = ({ hints = [], wrongCount }) => {
  const activeHintIndex = wrongCount - 1;
  const currentHint =
    wrongCount > 0 && activeHintIndex < hints.length
      ? hints[activeHintIndex]
      : null;

  return (
    <div className="bg-pitch-600 border border-neon-cyan/15 rounded-xl p-3.5 flex items-start gap-3 min-h-[64px]">
      <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
      <div className="flex-1">
        <p className="text-neon-cyan text-[10px] uppercase tracking-widest font-semibold mb-1">
          Hint{" "}
          {wrongCount > 0
            ? `${Math.min(wrongCount, hints.length)} / ${hints.length}`
            : ""}
        </p>
        <AnimatePresence mode="wait">
          {currentHint ? (
            <motion.p
              key={activeHintIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="text-slate-300 text-sm leading-relaxed"
            >
              {currentHint}
            </motion.p>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-600 text-sm italic"
            >
              Make wrong guesses to unlock hints...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HintBox;
