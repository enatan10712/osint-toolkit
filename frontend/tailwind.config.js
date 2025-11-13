/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')

// Hacker theme colors
const hackerColors = {
  'matrix-green': '#00ff41',
  'hacker-green': '#39ff14',
  'hacker-blue': '#00f0ff',
  'hacker-red': '#ff0038',
  'hacker-purple': '#9d00ff',
  'hacker-yellow': '#ffd700',
  'hacker-bg': '#0a0e17',
  'hacker-bg-light': '#0f172a',
  'hacker-bg-dark': '#05080f',
  'hacker-text': '#e2e8f0',
  'hacker-text-dim': '#94a3b8',
  'hacker-border': '#1e293b',
  'hacker-accent': '#3b82f6',
  'hacker-success': '#10b981',
  'hacker-warning': '#f59e0b',
  'hacker-error': '#ef4444',
  'hacker-info': '#3b82f6',
}

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ...hackerColors,
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
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'cyber': {
          dark: '#0a0e17',
          darker: '#05080f',
          blue: '#00f0ff',
          'blue-dark': '#00a8b5',
          pink: '#ff2d75',
          purple: '#7928ca',
          teal: '#00f5d4',
          magenta: '#ff00ff',
          yellow: '#ffd60a',
          'neon-green': '#39ff14',
          'dark-purple': '#3a0ca3',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', 'Courier New', 'monospace', ...fontFamily.mono],
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        rajdhani: ['var(--font-rajdhani)', 'sans-serif'],
        'hacker': ['Courier New', 'monospace'],
        'digital': ['Digital-7', 'monospace'],
        'matrix': ['Matrix Code NFI', 'monospace'],
        'audiowide': ['Audiowide', 'cursive'],
      },
      boxShadow: {
        // Theme-based shadows
        'neon-blue': '0 0 5px theme("colors.cyber.blue"), 0 0 10px theme("colors.cyber.blue")',
        'neon-pink': '0 0 5px theme("colors.cyber.pink"), 0 0 10px theme("colors.cyber.pink")',
        'neon-purple': '0 0 5px theme("colors.cyber.purple"), 0 0 10px theme("colors.cyber.purple")',
        'cyber-glow': '0 0 10px theme("colors.cyber.blue"), 0 0 20px theme("colors.cyber.blue")',
        'cyber-glow-pink': '0 0 10px theme("colors.cyber.pink"), 0 0 20px theme("colors.cyber.pink")',
        'cyber-glow-purple': '0 0 10px theme("colors.cyber.purple"), 0 0 20px theme("colors.cyber.purple")',
        'matrix-glow': '0 0 5px theme("colors.matrix-green"), 0 0 10px theme("colors.matrix-green")',
        'hacker-glow': '0 0 10px theme("colors.hacker-green"), 0 0 20px theme("colors.hacker-green")',
        'hacker-glow-blue': '0 0 10px theme("colors.hacker-blue"), 0 0 20px theme("colors.hacker-blue")',
        'hacker-glow-red': '0 0 10px theme("colors.hacker-red"), 0 0 20px theme("colors.hacker-red")'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 8s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'neon-flicker': 'flicker 4s linear infinite',
        'text-flicker': 'textFlicker 3s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'hologram': 'hologram 6s ease-in-out infinite',
        'glitch': 'glitch 1s linear infinite',
        'matrix-rain': 'matrixRain 5s linear infinite',
        'terminal-blink': 'terminalBlink 1s step-end infinite',
        'hacker-typing': 'typing 3.5s steps(40, end) infinite',
        'binary-rain': 'binaryRain 10s linear infinite',
        'signal-wave': 'signalWave 2s ease-in-out infinite'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glowPulse: {
          '0%, 100%': { 'text-shadow': '0 0 5px theme("colors.cyber.blue"), 0 0 10px theme("colors.cyber.blue")' },
          '50%': { 'text-shadow': '0 0 10px theme("colors.cyber.blue"), 0 0 20px theme("colors.cyber.blue")' },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: 0.99,
            'text-shadow': '0 0 10px theme("colors.cyber.blue"), 0 0 20px theme("colors.cyber.blue")',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: 0.4,
            'text-shadow': 'none',
          },
        },
        textFlicker: {
          '0%, 100%': { 'text-shadow': '0 0 5px theme("colors.cyber.blue")' },
          '50%': { 'text-shadow': '0 0 5px theme("colors.cyber.pink")' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        hologram: {
          '0%, 100%': { 
            'box-shadow': '0 0 5px 0px theme("colors.cyber.blue"), 0 0 10px 2px theme("colors.cyber.blue")',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            opacity: 0.8,
          },
          '35%': { 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            opacity: 0.4,
          },
          '50%': { 
            'box-shadow': '0 0 10px 0px theme("colors.cyber.pink"), 0 0 20px 2px theme("colors.cyber.pink")',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            opacity: 0.8,
          }
        },
        },
        'glitch': {
          '0%': { 
            textShadow: '0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75)' 
          },
          '14%': { 
            textShadow: '0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75)' 
          },
          '15%': { 
            textShadow: '-0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75)' 
          },
          '49%': { 
            textShadow: '-0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75)' 
          },
          '50%': { 
            textShadow: '0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75)' 
          },
          '99%': { 
            textShadow: '0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75)' 
          },
          '100%': { 
            textShadow: '-0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75)' 
          },
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
