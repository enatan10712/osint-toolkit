'use client'

import { Map, TrendingUp, Shield, Globe } from 'lucide-react'

export default function AnalystMode() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Map className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Analyst Mode</h2>
        </div>
        <p className="text-gray-400">
          Advanced visualization and correlation of intelligence data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Global Threat Map</h3>
          </div>
          <div className="bg-cyber-darker rounded-lg p-8 text-center">
            <p className="text-gray-500">Map visualization coming soon</p>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-bold text-white">Investigation Timeline</h3>
          </div>
          <div className="bg-cyber-darker rounded-lg p-8 text-center">
            <p className="text-gray-500">Timeline view coming soon</p>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Threat Correlation</h3>
          </div>
          <div className="bg-cyber-darker rounded-lg p-8 text-center">
            <p className="text-gray-500">Correlation engine coming soon</p>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Map className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Entity Relationships</h3>
          </div>
          <div className="bg-cyber-darker rounded-lg p-8 text-center">
            <p className="text-gray-500">Relationship graph coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
