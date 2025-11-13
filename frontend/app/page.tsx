'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import UsernameLookup from '@/components/tools/UsernameLookup'
import EmailScanner from '@/components/tools/EmailScanner'
import DomainScanner from '@/components/tools/DomainScanner'
import IPLookup from '@/components/tools/IPLookup'
import WhoisLookup from '@/components/tools/WhoisLookup'
import ExifExtractor from '@/components/tools/ExifExtractor'
import SearchHistory from '@/components/tools/SearchHistory'
import AnalystMode from '@/components/tools/AnalystMode'
import Header from '@/components/Header'
import ComingSoon from '@/components/ComingSoon'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />
      case 'username':
        return <UsernameLookup />
      case 'email':
        return <EmailScanner />
      case 'domain':
        return <DomainScanner />
      case 'ip':
        return <IPLookup />
      case 'whois':
        return <WhoisLookup />
      case 'exif':
        return <ExifExtractor />
      case 'reverse-image':
        return <ComingSoon title="Reverse Image Search" description="This feature is coming soon. Stay tuned!" />
      case 'history':
        return <SearchHistory />
      case 'analyst':
        return <AnalystMode />
      default:
        return <Dashboard onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen bg-cyber-darker dark:bg-cyber-darker overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 cyber-grid">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
