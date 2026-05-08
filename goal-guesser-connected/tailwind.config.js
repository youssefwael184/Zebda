/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        exo: ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        pitch: {
          950: '#060b14',
          900: '#0a0e1a',
          800: '#0f1623',
          700: '#111827',
          600: '#1a2235',
          500: '#243044',
        },
        neon: {
          cyan: '#00d4ff',
          purple: '#7c3aed',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
        },
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
      },
      animation: {
        'twinkle': 'twinkle 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-icon': 'bounceIcon 1s ease infinite alternate',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'fade-in': 'fadeIn 0.4s ease',
        'slide-up': 'slideUp 0.3s ease',
        'letter-pop': 'letterPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'shake': 'shake 0.4s ease',
      },
      keyframes: {
        twinkle: { '0%': { opacity:'0.1' }, '100%': { opacity:'0.9' } },
        shimmer: { '0%': { backgroundPosition:'0%' }, '100%': { backgroundPosition:'200%' } },
        float: { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-6px)' } },
        bounceIcon: { '0%': { transform:'translateY(0)' }, '100%': { transform:'translateY(-12px)' } },
        scaleIn: { from:{ transform:'scale(0.8)', opacity:'0' }, to:{ transform:'scale(1)', opacity:'1' } },
        fadeIn: { from:{ opacity:'0' }, to:{ opacity:'1' } },
        slideUp: { from:{ transform:'translateY(20px)', opacity:'0' }, to:{ transform:'translateY(0)', opacity:'1' } },
        letterPop: { '0%':{ transform:'translateY(-15px) scale(0.5)', opacity:'0' }, '100%':{ transform:'translateY(0) scale(1)', opacity:'1' } },
        shake: { '0%,100%':{ transform:'translateX(0)' }, '25%':{ transform:'translateX(-8px)' }, '75%':{ transform:'translateX(8px)' } },
      },
    },
  },
  plugins: [],
};
