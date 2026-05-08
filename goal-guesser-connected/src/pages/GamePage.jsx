/**
 * @module GamePage
 * @description Main game board page.
 *
 * Connects to the store for async game actions (startNewGame, guessLetter).
 * Shows a loading state while API calls are in-flight.
 * On mount: tries to reconnect to an existing session first,
 *           then starts a new game if there is none.
 */

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { DIFFICULTY_CONFIG } from "../data/tiers";
import Navbar from "../components/Navbar";
import StarField from "../components/StarField";
import HangmanSVG from "../components/HangmanSVG";
import WordDisplay from "../components/WordDisplay";
import Keyboard from "../components/Keyboard";
import HintBox from "../components/HintBox";
import AttemptsBar from "../components/AttemptsBar";
import StatsPanel from "../components/StatsPanel";
import GameOverlay from "../components/GameOverlay";

const GamePage = () => {
  const {
    gameState,
    gameLoading,
    gameError,
    startNewGame,
    guessLetter,
    reconnectSession,
  } = useStore();

  useEffect(() => {
    const init = async () => {
      // Try to reconnect to an existing in-progress session
      await reconnectSession();
      // If still idle (no active session), start a fresh game
      if (useStore.getState().gameState.status === "idle") {
        await startNewGame();
      }
    };
    init();
  }, []); // eslint-disable-line

  const isPlaying = gameState.status === "playing";
  const isLost = gameState.status === "lost";
  const diffConfig = gameState.difficulty
    ? DIFFICULTY_CONFIG[gameState.difficulty]
    : null;

  return (
    <div className="min-h-screen bg-pitch-900 relative">
      <StarField />
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-6">
          {/* Error banner */}
          {gameError && (
            <div className="mb-4 bg-neon-red/10 border border-neon-red/40 rounded-xl px-4 py-3 text-neon-red text-sm text-center">
              ❌ {gameError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
            {/* Left: Game Board */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  {diffConfig ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${diffConfig.colorClass} ${diffConfig.bgClass} ${diffConfig.borderClass}`}
                    >
                      {diffConfig.emoji} {diffConfig.label}
                    </span>
                  ) : (
                    <div />
                  )}
                  <AttemptsBar wrongCount={gameState.wrong.length} />
                </div>

                <div className="flex justify-center my-2">
                  <HangmanSVG
                    wrongCount={gameState.wrong.length}
                    isLost={isLost}
                  />
                </div>

                <HintBox
                  hints={gameState.hints}
                  wrongCount={gameState.wrong.length}
                />

                <WordDisplay
                  word={gameState.word}
                  guessed={gameState.guessed}
                  isLost={isLost}
                />

                <Keyboard
                  guessed={gameState.guessed}
                  wrong={gameState.wrong}
                  word={gameState.word}
                  disabled={!isPlaying || gameLoading}
                  onGuess={guessLetter}
                />

                {gameLoading && (
                  <div className="text-center mt-4 text-slate-500 text-sm animate-pulse">
                    ⚽ Loading...
                  </div>
                )}

                {!isPlaying && gameState.status !== "idle" && (
                  <motion.button
                    className="btn-primary mt-5"
                    onClick={startNewGame}
                    disabled={gameLoading}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    ⚽ NEXT PLAYER
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Right: Stats */}
            <StatsPanel />
          </div>
        </main>
      </div>
      <GameOverlay />
    </div>
  );
};

export default GamePage;
