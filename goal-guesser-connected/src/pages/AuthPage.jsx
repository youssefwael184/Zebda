/**
 * @module AuthPage
 * @description Login / Register page.
 *
 * All auth logic is delegated to the store (which delegates to AuthService).
 * This component only handles UI state and user input — no business logic here.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import StarField from "../components/StarField";

const AuthPage = () => {
  const navigate = useNavigate();
  const {
    login,
    register,
    currentUser,
    authError,
    authSuccess,
    authLoading,
    clearAuthMessages,
  } = useStore();

  const [tab, setTab] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Already logged in → redirect
  useEffect(() => {
    if (currentUser) navigate("/game");
  }, [currentUser, navigate]);

  // Reset fields on tab switch
  useEffect(() => {
    clearAuthMessages();
    setUsername("");
    setEmail("");
    setPassword("");
  }, [tab]); // eslint-disable-line

  const handleLogin = async () => {
    if (!username || !password) return;
    const ok = await login(username, password);
    if (ok) navigate("/game");
  };

  const handleRegister = async () => {
    if (!username || !password || password.length < 6) return;
    const ok = await register(username, email, password);
    if (ok) setTimeout(() => navigate("/game"), 800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") tab === "login" ? handleLogin() : handleRegister();
  };

  return (
    <div className="min-h-screen bg-pitch-900 flex items-center justify-center p-4 relative">
      <StarField />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="text-5xl mb-3 inline-block"
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              ⚽
            </motion.div>
            <h1 className="font-orbitron font-black text-2xl gradient-text tracking-widest">
              GOAL GUESSER
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Guess the football legend
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-pitch-900 rounded-xl p-1 mb-6">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-300 ${
                  tab === t
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                style={
                  tab === t
                    ? { background: "linear-gradient(135deg,#00d4ff,#7c3aed)" }
                    : {}
                }
              >
                {t === "login" ? "🔑 Login" : "🚀 Register"}
              </button>
            ))}
          </div>

          {/* Messages */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-neon-red/10 border border-neon-red/40 rounded-xl px-4 py-3 text-neon-red text-sm text-center mb-4"
              >
                ❌ {authError}
              </motion.div>
            )}
            {authSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-neon-green/10 border border-neon-green/40 rounded-xl px-4 py-3 text-neon-green text-sm text-center mb-4"
              >
                ✅ {authSuccess}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === "login" ? 20 : -20 }}
              transition={{ duration: 0.25 }}
              onKeyDown={handleKey}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                    Username
                  </label>
                  <input
                    className="input-field"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {tab === "register" && (
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                      Email <span className="text-slate-700">(optional)</span>
                    </label>
                    <input
                      className="input-field"
                      placeholder="your@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                    Password
                    {tab === "register" && (
                      <span className="text-slate-600 ml-1 normal-case tracking-normal">
                        (min 6 chars)
                      </span>
                    )}
                  </label>
                  <input
                    className="input-field"
                    placeholder={
                      tab === "register" ? "Min 6 characters" : "Enter password"
                    }
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <motion.button
                  className="btn-primary mt-2"
                  onClick={tab === "login" ? handleLogin : handleRegister}
                  disabled={authLoading}
                  whileTap={{ scale: 0.97 }}
                >
                  {authLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="animate-spin">⚽</span> Loading...
                    </span>
                  ) : tab === "login" ? (
                    "⚡ LOGIN"
                  ) : (
                    "🚀 CREATE ACCOUNT"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-slate-700 text-xs mt-4 font-orbitron tracking-widest">
          TEST YOUR FOOTBALL KNOWLEDGE
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
