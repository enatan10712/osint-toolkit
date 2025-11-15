/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0e27',
          darker: '#05070f',
          blue: '#00d4ff',
          purple: '#9d4edd',
          pink: '#ff006e',
          green: '#00ff88',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff',
        'neon-pink': '0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e',
        'neon-green': '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88',
      },
    },
  },
  plugins: [],
}
