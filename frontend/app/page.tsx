'use client'

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });
const Dashboard = dynamic(() => import('@/components/Dashboard'), { ssr: false });
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const ComingSoon = dynamic(() => import('@/components/common/ComingSoon'), { ssr: false });

// Import tool components
const UsernameLookup = dynamic(() => import('@/components/tools/UsernameLookup'), { ssr: false });
const EmailScanner = dynamic(() => import('@/components/tools/EmailScanner'), { ssr: false });
const DomainScanner = dynamic(() => import('@/components/tools/DomainScanner'), { ssr: false });
const IPLookup = dynamic(() => import('@/components/tools/IPLookup'), { ssr: false });
const WhoisLookup = dynamic(() => import('@/components/tools/WhoisLookup'), { ssr: false });
const ExifExtractor = dynamic(() => import('@/components/tools/ExifExtractor'), { ssr: false });
const SearchHistory = dynamic(() => import('@/components/tools/SearchHistory'), { ssr: false });
const AnalystMode = dynamic(() => import('@/components/tools/AnalystMode'), { ssr: false });

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
