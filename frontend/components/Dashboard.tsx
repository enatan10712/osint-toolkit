'use client'

import { User, Mail, Globe, MapPin, FileText, Image, TrendingUp, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardProps {
  onNavigate: (tab: string) => void
}

const tools = [
  {
    id: 'username',
    title: 'Username Lookup',
    description: 'Search for usernames across 20+ social media platforms',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    stats: '20+ Platforms'
  },
  {
    id: 'email',
    title: 'Email Scanner',
    description: 'Check if email appears in known data breaches',
    icon: Mail,
    color: 'from-purple-500 to-pink-500',
    stats: 'Breach Database'
  },
  {
    id: 'domain',
    title: 'Domain Scanner',
    description: 'Analyze domain reputation and breach history',
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
    stats: 'DNS & WHOIS'
  },
  {
    id: 'ip',
    title: 'IP Lookup',
    description: 'Get geolocation and threat intelligence for any IP',
    icon: MapPin,
    color: 'from-orange-500 to-red-500',
    stats: 'Geo + Security'
  },
  {
    id: 'whois',
    title: 'WHOIS Lookup',
    description: 'Retrieve domain registration and ownership information',
    icon: FileText,
    color: 'from-indigo-500 to-purple-500',
    stats: 'Domain Intel'
  },
  {
    id: 'exif',
    title: 'EXIF Extractor',
    description: 'Extract hidden metadata from images including GPS',
    icon: Image,
    color: 'from-pink-500 to-rose-500',
    stats: 'GPS + Metadata'
  },
]

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/30 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-cyber-blue mb-2">
              Welcome to OSINT Intelligence Platform
            </h2>
            <p className="text-gray-400">
              Advanced reconnaissance tools for ethical security research and investigation
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-cyber-darker px-4 py-2 rounded-lg border border-cyber-green/30">
            <Activity className="w-5 h-5 text-cyber-green animate-pulse" />
            <span className="text-cyber-green font-mono">OPERATIONAL</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Scans', value: '0', icon: TrendingUp, color: 'text-cyber-blue' },
          { label: 'Active Tools', value: '6', icon: Activity, color: 'text-cyber-green' },
          { label: 'Data Sources', value: '15+', icon: Globe, color: 'text-cyber-purple' },
          { label: 'Success Rate', value: '99%', icon: TrendingUp, color: 'text-cyber-pink' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-4 hover:border-cyber-blue/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tools Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Available Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(tool.id)}
              className="cyber-card bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{tool.title}</h4>
              <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyber-blue bg-cyber-blue/10 px-3 py-1 rounded-full">
                  {tool.stats}
                </span>
                <span className="text-xs text-gray-500">Click to launch →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6"
      >
        <h3 className="text-lg font-bold text-white mb-4">🎯 Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">
              <span className="text-cyber-blue">•</span> Always verify information from multiple sources
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <span className="text-cyber-blue">•</span> Use tools ethically and legally
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">
              <span className="text-cyber-blue">•</span> Export reports for documentation
            </p>
            <p className="text-sm text-gray-400 mt-2">
              <span className="text-cyber-blue">•</span> Check search history for past investigations
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
