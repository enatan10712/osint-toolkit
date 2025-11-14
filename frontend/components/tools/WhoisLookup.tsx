'use client'

import { useState } from 'react'
import { Search, Loader2, FileText } from 'lucide-react'
import { whoisLookup } from '@/lib/api'
import { motion } from 'framer-motion'
import TerminalLoader from '../TerminalLoader'

export default function WhoisLookup() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleLookup = async () => {
    if (!domain.trim()) {
      setError('Please enter a domain')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data = await whoisLookup(domain)
      setResults(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="w-8 h-8 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">WHOIS Lookup</h2>
        </div>
        <p className="text-gray-400">
          Retrieve domain registration and ownership information
        </p>
      </div>

      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="Enter domain (e.g., example.com)..."
            className="flex-1 bg-cyber-darker border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>{loading ? 'Looking up...' : 'Lookup'}</span>
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>}
      </div>

      {loading && <TerminalLoader message="Querying WHOIS database..." />}

      {results && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">WHOIS Information</h3>
            <div className="space-y-4">
              <div className="bg-cyber-darker rounded-lg p-4">
                <h4 className="text-sm font-bold text-gray-400 mb-3">REGISTRATION DETAILS</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domain:</span>
                    <span className="text-white font-mono">{results.whois?.domain_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Registrar:</span>
                    <span className="text-white">{results.whois?.registrar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-green-400">{results.whois?.creation_date?.split('T')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-yellow-400">{results.whois?.expiration_date?.split('T')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Updated:</span>
                    <span className="text-blue-400">{results.whois?.updated_date?.split('T')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="bg-cyber-darker rounded-lg p-4">
                <h4 className="text-sm font-bold text-gray-400 mb-3">DNS RECORDS</h4>
                <div className="space-y-2 text-sm font-mono">
                  {results.dns_records?.A && results.dns_records.A.length > 0 && (
                    <div>
                      <span className="text-gray-400">A Records:</span>
                      <div className="text-cyan-400 ml-4">
                        {results.dns_records.A.map((record: string, i: number) => (
                          <div key={i}>{record}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.dns_records?.NS && results.dns_records.NS.length > 0 && (
                    <div>
                      <span className="text-gray-400">NS Records:</span>
                      <div className="text-purple-400 ml-4">
                        {results.dns_records.NS.map((record: string, i: number) => (
                          <div key={i}>{record}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
