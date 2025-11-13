'use client'

import { useState } from 'react'
import { Search, Loader2, Globe, Download } from 'lucide-react'
import { domainScan, generateReport } from '@/lib/api'
import { motion } from 'framer-motion'
import TerminalLoader from '../TerminalLoader'

export default function DomainScanner() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleScan = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data = await domainScan(domain)
      setResults(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Globe className="w-8 h-8 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Domain Scanner</h2>
        </div>
        <p className="text-gray-400">
          Analyze domain reputation, breaches, and DNS records
        </p>
      </div>

      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            placeholder="Enter domain (e.g., example.com)..."
            className="flex-1 bg-cyber-darker border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue"
          />
          <button
            onClick={handleScan}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>{loading ? 'Scanning...' : 'Scan'}</span>
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>}
      </div>

      {loading && <TerminalLoader message="Analyzing domain..." />}

      {results && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Domain Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Domain</p>
                <p className="text-white font-mono mt-1">{results.domain}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className="text-yellow-400 font-bold mt-1">{results.breach_statistics?.risk_level}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Breaches</p>
                <p className="text-red-400 font-bold mt-1">{results.breach_statistics?.total_breaches}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Affected Records</p>
                <p className="text-orange-400 font-bold mt-1">{results.breach_statistics?.affected_records?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
