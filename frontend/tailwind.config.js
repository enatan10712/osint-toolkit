/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          dark: '#0a0e17',
          darker: '#05080f',
          blue: '#00f0ff',
          'blue-dark': '#00a8b5',
          pink: '#ff2d75',
          purple: '#7928ca',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'cyber': '0 0 15px rgba(0, 240, 255, 0.5)',
        'cyber-sm': '0 0 5px rgba(0, 240, 255, 0.5)',
        'cyber-lg': '0 0 25px rgba(0, 240, 255, 0.7)',
        'neon-blue': '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 8s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.6 },
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-cyber': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 240, 255, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0, 240, 255, 0)' },
        },
      },
      boxShadow: {
        'neon-pink': '0 0 10px #ff006e, 0 0 20px #ff006e, 0 0 30px #ff006e',
        'neon-green': '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88',
      },
    },
  },
  plugins: [],
}
