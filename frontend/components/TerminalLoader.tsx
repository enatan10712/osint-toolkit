'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TerminalLoaderProps {
  message?: string
}

export default function TerminalLoader({ message = 'Processing...' }: TerminalLoaderProps) {
  const [dots, setDots] = useState('')
  const [lines, setLines] = useState<string[]>([])

  const terminalMessages = [
    '> Initializing scan...',
    '> Connecting to servers...',
    '> Fetching data...',
    '> Analyzing results...',
    '> Processing information...',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < terminalMessages.length) {
        setLines(prev => [...prev, terminalMessages[index]])
        index++
      }
    }, 600)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cyber-darker border border-cyber-blue/30 rounded-lg p-6 font-mono"
    >
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-400 text-sm ml-4">terminal</span>
      </div>
      
      <div className="space-y-2">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-cyber-green text-sm"
          >
            {line}
          </motion.div>
        ))}
        <div className="text-cyber-blue text-sm">
          {message}{dots}
          <span className="terminal-cursor">█</span>
        </div>
      </div>
    </motion.div>
  )
}
