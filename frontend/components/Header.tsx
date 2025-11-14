'use client'

import { Moon, Sun, Terminal, Activity } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-cyber-dark dark:bg-cyber-dark border-b border-cyber-blue/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Terminal className="w-8 h-8 text-cyber-blue" />
          <div>
            <h1 className="text-2xl font-bold neon-text text-cyber-blue">
              THE GOD EYE
            </h1>
            <p className="text-xs text-gray-400">Multi-Mode Intelligence Platform v3.0</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-cyber-darker rounded-lg border border-cyber-blue/30">
            <Activity className="w-4 h-4 text-cyber-green animate-pulse" />
            <span className="text-sm text-cyber-green">System Online</span>
          </div>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-cyber-darker hover:bg-cyber-blue/20 transition-colors border border-cyber-blue/30"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-cyber-blue" />
            ) : (
              <Moon className="w-5 h-5 text-cyber-blue" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
