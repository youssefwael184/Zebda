import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getTier } from '../data/tiers';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useStore();

  const handleLogout = async () => { await logout(); navigate('/'); };
  const tier = currentUser ? getTier(currentUser.rating) : null;

  return (
    <nav className="sticky top-0 z-50 bg-pitch-700/95 backdrop-blur-md border-b border-neon-cyan/20 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate('/game')}
          className="font-orbitron font-black text-base tracking-widest gradient-text hover:opacity-80 transition-opacity"
        >
          ⚽ GOAL GUESSER
        </button>

        <div className="flex items-center gap-2">
          {currentUser && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-orbitron font-bold"
              style={{ background: `${tier?.color}22`, border: `1px solid ${tier?.color}66`, color: tier?.color }}
            >
              {tier?.icon} {currentUser.rating}
            </div>
          )}

          <button
            onClick={() => navigate('/game')}
            className={`nav-link ${location.pathname === '/game' ? 'active' : ''}`}
          >
            🎮 Play
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            🏆 Dashboard
          </button>

          <button onClick={handleLogout} className="btn-secondary text-xs">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
