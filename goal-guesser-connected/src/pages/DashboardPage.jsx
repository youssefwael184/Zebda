/**
 * @module DashboardPage
 * @description Leaderboard & user stats page.
 *
 * Loads the leaderboard from the API on mount via loadLeaderboard().
 * Falls back gracefully with a loading skeleton.
 */

import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { getTier } from "../data/tiers";
import Navbar from "../components/Navbar";
import StarField from "../components/StarField";
import Avatar from "../components/Avatar";

const RANK_MEDAL = {
  1: {
    label: "👑",
    color: "linear-gradient(135deg,#FFD700,#FFA500)",
    textColor: "#000",
    glow: "0 0 20px rgba(255,215,0,0.4)",
  },
  2: {
    label: "🥈",
    color: "linear-gradient(135deg,#C0C0C0,#A0A0A0)",
    textColor: "#000",
    glow: "0 0 20px rgba(192,192,192,0.3)",
  },
  3: {
    label: "🥉",
    color: "linear-gradient(135deg,#CD7F32,#B8681A)",
    textColor: "#fff",
    glow: "0 0 20px rgba(205,127,50,0.3)",
  },
};

const ROW_BG = {
  1: "linear-gradient(135deg,rgba(255,215,0,0.08) 0%,transparent 60%)",
  2: "linear-gradient(135deg,rgba(192,192,192,0.06) 0%,transparent 60%)",
  3: "linear-gradient(135deg,rgba(205,127,50,0.07) 0%,transparent 60%)",
};

const DashboardPage = () => {
  const { currentUser, leaderboard, loadLeaderboard } = useStore();

  // Fetch leaderboard from API on mount
  useEffect(() => {
    loadLeaderboard(50);
  }, []); // eslint-disable-line

  // Leaderboard already sorted by server — add rank index locally
  const rankedBoard = useMemo(
    () => leaderboard.map((u, i) => ({ ...u, rank: i + 1 })),
    [leaderboard],
  );

  const top10 = rankedBoard.slice(0, 10);
  const userEntry = rankedBoard.find((u) => u.id === currentUser?.id);
  const userInTop10 = top10.some((u) => u.id === currentUser?.id);

  const rows = [...top10];
  if (!userInTop10 && userEntry) rows.push("divider", userEntry);

  const userTier = currentUser ? getTier(currentUser.rating) : null;
  const winRate = userEntry?.winRate ?? 0;

  return (
    <div className="min-h-screen bg-pitch-900 relative">
      <StarField />
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-6">
          {/* Current user stats bar */}
          {currentUser && userEntry && (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {[
                {
                  label: "My Rating",
                  value: currentUser.rating,
                  icon: "⭐",
                  color: userTier?.color,
                },
                {
                  label: "Wins",
                  value: currentUser.wins,
                  icon: "🏆",
                  color: "#10b981",
                },
                {
                  label: "Win Rate",
                  value: `${winRate}%`,
                  icon: "📊",
                  color: "#00d4ff",
                },
                {
                  label: "Best Streak",
                  value: currentUser.bestStreak ?? currentUser.streak,
                  icon: "🔥",
                  color: "#f59e0b",
                },
              ].map(({ label, value, icon, color }) => (
                <div
                  key={label}
                  className="bg-pitch-700 border border-neon-cyan/15 rounded-2xl p-4 text-center"
                >
                  <p className="text-2xl mb-1">{icon}</p>
                  <p
                    className="font-orbitron font-black text-xl"
                    style={{ color }}
                  >
                    {value}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-orbitron font-black text-xl gradient-text">
                  <span style={{ color: "initial" }}>🏆</span> LEADERBOARD
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  Top players ranked by rating
                </p>
              </div>
              <div className="text-xs text-slate-600 font-orbitron">
                {rankedBoard.length} players
              </div>
            </div>

            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-slate-600 font-orbitron tracking-widest animate-pulse">
                Loading leaderboard...
              </div>
            ) : (
              <div className="bg-pitch-700 border border-neon-cyan/20 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[56px_1fr_100px_80px] gap-2 px-5 py-3 bg-pitch-600/60 border-b border-neon-cyan/10">
                  {["Rank", "Player", "Rating", "Games"].map((h, i) => (
                    <p
                      key={h}
                      className={`text-[10px] uppercase tracking-widest text-slate-500 font-semibold ${i >= 2 ? "text-right" : ""}`}
                    >
                      {h}
                    </p>
                  ))}
                </div>

                {rows.map((row, idx) => {
                  if (row === "divider") {
                    return (
                      <div
                        key="divider"
                        className="px-5 py-2 text-center text-slate-700 text-xs border-b border-neon-cyan/5 font-orbitron tracking-widest"
                      >
                        • • •
                      </div>
                    );
                  }

                  const user = row;
                  const medal = RANK_MEDAL[user.rank];
                  const isMe = user.id === currentUser?.id;
                  const tier = getTier(user.rating);

                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`grid grid-cols-[56px_1fr_100px_80px] gap-2 px-5 py-3.5 border-b border-neon-cyan/5 last:border-0 transition-colors duration-200 hover:bg-neon-cyan/5 ${isMe ? "border-l-2 border-l-neon-purple" : ""}`}
                      style={{
                        background: medal
                          ? isMe
                            ? `${ROW_BG[user.rank]}, rgba(124,58,237,0.06)`
                            : ROW_BG[user.rank]
                          : isMe
                            ? "rgba(124,58,237,0.07)"
                            : undefined,
                        boxShadow: medal && isMe ? medal.glow : undefined,
                      }}
                    >
                      {/* Rank */}
                      <div className="flex items-center">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-orbitron font-black text-sm flex-shrink-0"
                          style={
                            medal
                              ? {
                                  background: medal.color,
                                  color: medal.textColor,
                                  boxShadow: medal.glow,
                                }
                              : { background: "#1a2235", color: "#64748b" }
                          }
                        >
                          {medal ? medal.label : user.rank}
                        </div>
                      </div>

                      {/* Player */}
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          username={user.username}
                          color={user.avatarColor}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p
                            className={`font-semibold text-sm truncate ${isMe ? "text-neon-purple" : "text-slate-200"}`}
                          >
                            {user.username}
                            {isMe && (
                              <span className="ml-1.5 text-[10px] text-neon-purple/70 font-normal">
                                (you)
                              </span>
                            )}
                          </p>
                          <p
                            className="text-[10px] font-semibold"
                            style={{ color: tier.color }}
                          >
                            {tier.icon} {tier.name}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-end">
                        <span
                          className="font-orbitron font-black text-base"
                          style={{
                            color: medal
                              ? user.rank === 1
                                ? "#FFD700"
                                : user.rank === 2
                                  ? "#C0C0C0"
                                  : "#CD7F32"
                              : isMe
                                ? "#a78bfa"
                                : "#e2e8f0",
                          }}
                        >
                          {user.rating}
                        </span>
                      </div>

                      {/* Games */}
                      <div className="flex items-center justify-end">
                        <span className="text-slate-500 text-sm">
                          {user.games}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
