'use client'

import { useState } from 'react'
import { Search, Loader2, AlertTriangle, Shield, Download } from 'lucide-react'
import { emailScan, generateReport } from '@/lib/api'
import { motion } from 'framer-motion'
import TerminalLoader from '../TerminalLoader'

export default function EmailScanner() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleScan = async () => {
    if (!email.trim()) {
      setError('Please enter an email address')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data = await emailScan(email)
      setResults(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-500'
      case 'MEDIUM': return 'text-yellow-500'
      case 'LOW': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const handleGenerateReport = async () => {
    if (!results) return
    try {
      const response = await generateReport(
        `Email Scan - ${email}`,
        results,
        `Email security scan for ${email}`
      )
      window.open(`http://localhost:8000${response.download_url}`, '_blank')
    } catch (err) {
      console.error('Error generating report:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Email Scanner</h2>
        </div>
        <p className="text-gray-400">
          Check if an email address has been compromised in known data breaches
        </p>
      </div>

      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
        <div className="flex space-x-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            placeholder="Enter email address..."
            className="flex-1 bg-cyber-darker border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue"
          />
          <button
            onClick={handleScan}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>{loading ? 'Scanning...' : 'Scan'}</span>
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>}
      </div>

      {loading && <TerminalLoader message="Checking breach databases..." />}

      {results && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Risk Assessment */}
          <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Risk Assessment</h3>
              <button
                onClick={handleGenerateReport}
                className="bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue text-cyber-blue px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-cyber-darker border border-red-500/30 rounded-lg p-4">
                <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
                <p className="text-gray-400 text-sm">Breaches Found</p>
                <p className="text-2xl font-bold text-red-400 mt-1">
                  {results.breach_data?.breach_count || 0}
                </p>
              </div>
              <div className="bg-cyber-darker border border-yellow-500/30 rounded-lg p-4">
                <Shield className="w-6 h-6 text-yellow-400 mb-2" />
                <p className="text-gray-400 text-sm">Risk Score</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">
                  {results.breach_data?.risk_score || 0}/100
                </p>
              </div>
              <div className="bg-cyber-darker border border-purple-500/30 rounded-lg p-4">
                <AlertTriangle className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className={`text-2xl font-bold mt-1 ${getRiskColor(results.breach_data?.risk_level)}`}>
                  {results.breach_data?.risk_level || 'UNKNOWN'}
                </p>
              </div>
            </div>

            {/* Email Info */}
            <div className="bg-cyber-darker rounded-lg p-4 mb-4">
              <h4 className="text-sm font-bold text-gray-400 mb-3">EMAIL INFORMATION</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white font-mono">{results.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Domain:</span>
                  <span className="text-white font-mono">{results.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Free Provider:</span>
                  <span className={results.email_reputation?.free_provider ? 'text-yellow-400' : 'text-green-400'}>
                    {results.email_reputation?.free_provider ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Disposable:</span>
                  <span className={results.email_reputation?.disposable ? 'text-red-400' : 'text-green-400'}>
                    {results.email_reputation?.disposable ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">⚠️ SECURITY RECOMMENDATIONS</h4>
                <ul className="space-y-2">
                  {results.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Breach Details */}
          {results.breach_data?.breaches && results.breach_data.breaches.length > 0 && (
            <div className="bg-cyber-dark border border-red-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">🔐 Data Breaches Found</h3>
              <div className="space-y-4">
                {results.breach_data.breaches.map((breach: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-cyber-darker border border-red-500/20 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">{breach.title || breach.name}</h4>
                        <p className="text-sm text-gray-400">{breach.domain}</p>
                      </div>
                      <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                        {breach.pwn_count?.toLocaleString() || 'N/A'} records
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{breach.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {breach.data_classes?.map((dataClass: string, i: number) => (
                        <span key={i} className="text-xs bg-red-500/10 text-red-300 px-2 py-1 rounded">
                          {dataClass}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                      <span>Breach Date: {breach.breach_date}</span>
                      <span>Added: {breach.added_date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
