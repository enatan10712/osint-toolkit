'use client'

import { 
  User, 
  Mail, 
  Globe, 
  MapPin, 
  FileText, 
  Image, 
  History, 
  Map,
  LayoutDashboard,
  Shield
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'mode-selector', label: '🎯 Mode Selector', icon: Shield, special: true },
  { id: 'username', label: 'Username Lookup', icon: User },
  { id: 'email', label: 'Email Scanner', icon: Mail },
  { id: 'domain', label: 'Domain Scanner', icon: Globe },
  { id: 'ip', label: 'IP Lookup', icon: MapPin },
  { id: 'whois', label: 'WHOIS Lookup', icon: FileText },
  { id: 'exif', label: 'EXIF Extractor', icon: Image },
  { id: 'reverse-image', label: 'Reverse Image', icon: Image },
  { id: 'ss7', label: 'SS7 Intelligence', icon: Shield },
  { id: 'phone-intel', label: 'Phone Intel', icon: User },
  { id: 'email-intel', label: 'Email Intel', icon: Mail },
  { id: 'analyst', label: 'Analyst Mode', icon: Map },
  { id: 'history', label: 'Search History', icon: History },
]

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-cyber-dark dark:bg-cyber-dark border-r border-cyber-blue/20 flex flex-col">
      <div className="p-6 border-b border-cyber-blue/20 flex items-center space-x-3">
        <Shield className="w-8 h-8 text-cyber-blue" />
        <div>
          <h2 className="text-lg font-bold text-cyber-blue">GOD EYE</h2>
          <p className="text-xs text-gray-400">Intel Suite v3.0</p>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/50 shadow-neon-blue'
                  : 'text-gray-400 hover:bg-cyber-darker hover:text-cyber-blue'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-cyber-blue/20">
        <div className="bg-cyber-darker rounded-lg p-4 border border-cyber-blue/30">
          <p className="text-xs text-gray-400 mb-2">System Status</p>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Uptime</span>
            <span className="text-cyber-green">99.9%</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-400">Active Scans</span>
            <span className="text-cyber-blue">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
