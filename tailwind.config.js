/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
        'gaming': ['Orbitron', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        'neon-green': '#00ff00',
        'neon-blue': '#00bfff',
        'neon-red': '#ff0000',
        'dark-bg': '#0a0a0a',
        'dark-panel': '#1a1a1a',
        'dark-border': '#333333',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 1s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff00' },
          '100%': { boxShadow: '0 0 20px #00ff00, 0 0 30px #00ff00' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
}
