import React from "react";
import { motion } from "framer-motion";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const Keyboard = ({ guessed, wrong, disabled, onGuess }) => {
  return (
    <div className="grid grid-cols-7 gap-1.5 mt-4">
      {ALPHABET.map((letter, i) => {
        const isCorrect = guessed.includes(letter);
        const isWrong = wrong.includes(letter);
        const isUsed = isCorrect || isWrong;

        return (
          <motion.button
            key={letter}
            whileTap={!isUsed && !disabled ? { scale: 0.88 } : {}}
            whileHover={!isUsed && !disabled ? { scale: 1.08 } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.012, duration: 0.2 }}
            className={`key-btn ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
            disabled={isUsed || disabled}
            onClick={() => onGuess(letter)}
          >
            {letter}
          </motion.button>
        );
      })}
    </div>
  );
};

export default Keyboard;
