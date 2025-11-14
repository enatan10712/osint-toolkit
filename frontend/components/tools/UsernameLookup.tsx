'use client'

import { useState } from 'react'
import { Search, Loader2, CheckCircle, XCircle, Download, User } from 'lucide-react'
import { usernameLookup, generateReport } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import TerminalLoader from '../TerminalLoader'

export default function UsernameLookup() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data = await usernameLookup(username)
      setResults(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    if (!results) return
    try {
      const response = await generateReport(
        `Username Lookup - ${username}`,
        results,
        `Username lookup report for ${username}`
      )
      window.open(`http://localhost:8000${response.download_url}`, '_blank')
    } catch (err) {
      console.error('Error generating report:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <User className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Username Lookup</h2>
        </div>
        <p className="text-gray-400">
          Search for a username across 20+ social media platforms and online services
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter username..."
            className="flex-1 bg-cyber-darker border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>
        )}
      </div>

      {/* Terminal Loader */}
      {loading && <TerminalLoader message="Scanning platforms..." />}

      {/* Results */}
      <AnimatePresence>
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Platforms</p>
                <p className="text-2xl font-bold text-white mt-1">{results.total_platforms}</p>
              </div>
              <div className="bg-cyber-dark border border-green-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Found On</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{results.statistics.found}</p>
              </div>
              <div className="bg-cyber-dark border border-red-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Not Found</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{results.statistics.not_found}</p>
              </div>
              <div className="bg-cyber-dark border border-yellow-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Errors</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{results.statistics.errors}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleGenerateReport}
                className="bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-cyber-blue px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            {/* Platform Results */}
            <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Platform Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.platforms.map((platform: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      platform.exists
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-gray-800/50 border-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {platform.exists ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <p className="font-medium text-white">{platform.platform}</p>
                          {platform.exists && (
                            <a
                              href={platform.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyber-blue hover:underline"
                            >
                              View Profile →
                            </a>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        platform.exists
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-700/20 text-gray-400'
                      }`}>
                        {platform.status_code || 'N/A'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
