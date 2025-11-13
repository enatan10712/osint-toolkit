'use client'

import { useState } from 'react'
import { Search, Loader2, MapPin, Download } from 'lucide-react'
import { ipLookup, generateReport } from '@/lib/api'
import { motion } from 'framer-motion'
import TerminalLoader from '../TerminalLoader'

export default function IPLookup() {
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleLookup = async () => {
    if (!ip.trim()) {
      setError('Please enter an IP address')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data = await ipLookup(ip)
      setResults(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <MapPin className="w-8 h-8 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">IP Lookup</h2>
        </div>
        <p className="text-gray-400">
          Get geolocation, threat intelligence, and network information for any IP address
        </p>
      </div>

      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
            placeholder="Enter IP address (e.g., 8.8.8.8)..."
            className="flex-1 bg-cyber-darker border border-cyber-blue/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span>{loading ? 'Looking up...' : 'Lookup'}</span>
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>}
      </div>

      {loading && <TerminalLoader message="Geolocating IP address..." />}

      {results && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Geolocation Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">IP Address</p>
                <p className="text-cyber-blue font-mono mt-1">{results.ip}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-white mt-1">{results.geolocation?.city}, {results.geolocation?.country}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Organization</p>
                <p className="text-white mt-1">{results.geolocation?.org}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Coordinates</p>
                <p className="text-green-400 font-mono mt-1">{results.geolocation?.latitude}, {results.geolocation?.longitude}</p>
              </div>
            </div>

            {/* Threat Intelligence */}
            <div className="bg-cyber-darker rounded-lg p-4">
              <h4 className="text-sm font-bold text-gray-400 mb-3">THREAT INTELLIGENCE</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Threat Score:</span>
                  <span className="text-yellow-400 ml-2 font-bold">{results.threat_intelligence?.threat_score}/100</span>
                </div>
                <div>
                  <span className="text-gray-400">Threat Level:</span>
                  <span className="text-green-400 ml-2 font-bold">{results.threat_intelligence?.threat_level}</span>
                </div>
                <div>
                  <span className="text-gray-400">Blacklisted:</span>
                  <span className={`ml-2 font-bold ${results.threat_intelligence?.blacklisted ? 'text-red-400' : 'text-green-400'}`}>
                    {results.threat_intelligence?.blacklisted ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">VPN/Proxy:</span>
                  <span className={`ml-2 font-bold ${results.threat_intelligence?.in_vpn_list ? 'text-yellow-400' : 'text-green-400'}`}>
                    {results.threat_intelligence?.in_vpn_list ? 'Detected' : 'Not Detected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
