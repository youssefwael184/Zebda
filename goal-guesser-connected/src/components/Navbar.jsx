import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import { getTier } from "../data/tiers";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const tier = currentUser ? getTier(currentUser.rating) : null;

  return (
    <nav className="sticky top-0 z-50 bg-pitch-700/95 backdrop-blur-md border-b border-neon-cyan/20 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNav("/game")}
          className="font-orbitron font-black text-base tracking-widest gradient-text hover:opacity-80 transition-opacity"
        >
          G
          <span
            style={{ color: "initial" }}
            className="inline-block animate-spin"
          >
            ⚽
          </span>
          AL GUESSER
        </button>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-2">
          {currentUser && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-orbitron font-bold"
              style={{
                background: `${tier?.color}22`,
                border: `1px solid ${tier?.color}66`,
                color: tier?.color,
              }}
            >
              {tier?.icon} {currentUser.rating}
            </div>
          )}

          <button
            onClick={() => handleNav("/game")}
            className={`nav-link ${location.pathname === "/game" ? "active" : ""}`}
          >
            🎮 Play
          </button>

          <button
            onClick={() => handleNav("/dashboard")}
            className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            🏆 Dashboard
          </button>

          <button onClick={handleLogout} className="btn-secondary text-xs">
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden btn-secondary text-lg px-2 py-1"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-2 flex flex-col gap-2 px-2 pb-3 border-t border-neon-cyan/10 pt-3">
          {currentUser && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-orbitron font-bold w-fit"
              style={{
                background: `${tier?.color}22`,
                border: `1px solid ${tier?.color}66`,
                color: tier?.color,
              }}
            >
              {tier?.icon} {currentUser.rating}
            </div>
          )}

          <button
            onClick={() => handleNav("/game")}
            className={`nav-link text-left ${location.pathname === "/game" ? "active" : ""}`}
          >
            🎮 Play
          </button>

          <button
            onClick={() => handleNav("/dashboard")}
            className={`nav-link text-left ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            🏆 Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="btn-secondary text-xs w-fit"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
