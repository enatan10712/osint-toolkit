'use client'

import { 
  Search,
  Home,
  LayoutDashboard,
  FileBarChart2,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  User,
  Mail,
  Globe,
  MapPin,
  FileText,
  Image,
  History,
  Map
} from 'lucide-react'
import { useState, useEffect } from 'react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'reports', label: 'Reports', icon: FileBarChart2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Logout', icon: LogOut, className: 'mt-auto' },
]

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-screen">
      {/* Header with logo and time */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-cyber-blue">GOD EYE</h1>
          <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {formatTime(currentTime)}
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyber-blue focus:border-cyber-blue sm:text-sm"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              onMouseEnter={() => setIsHovered(item.id === 'logout')}
              onMouseLeave={() => setIsHovered(false)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                item.className || ''
              } ${
                isActive 
                  ? 'bg-cyber-blue/20 text-cyber-blue border-l-4 border-cyber-blue shadow-cyber-glow'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${
                item.id === 'logout' && isHovered ? 'bg-red-900/30 text-red-400' : ''
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
      
      {/* Status bar */}
      <div className="p-3 border-t border-gray-800 bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span>Connected</span>
          </div>
          <div>v3.0.1</div>
        </div>
      </div>
    </div>
  )
}
