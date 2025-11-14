'use client'

import { useState, useEffect } from 'react'
import { History, Trash2 } from 'lucide-react'
import { getSearchHistory, clearSearchHistory } from '@/lib/api'
import { motion } from 'framer-motion'

export default function SearchHistory() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await getSearchHistory()
      setHistory(data)
    } catch (err) {
      console.error('Error loading history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all search history?')) {
      try {
        await clearSearchHistory()
        setHistory([])
      } catch (err) {
        console.error('Error clearing history:', err)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="w-8 h-8 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Search History</h2>
              <p className="text-gray-400">View past investigations</p>
            </div>
          </div>
          {history.length > 0 && (
            <button onClick={handleClearHistory} className="bg-red-500/20 hover:bg-red-500/30 border border-red-500 text-red-400 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-12 text-center">
            <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No search history yet</p>
          </div>
        ) : (
          history.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30">{item.type}</span>
                    <span className="text-white font-medium">{item.query}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
