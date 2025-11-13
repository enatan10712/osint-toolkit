'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-cyber-darker text-white p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-cyber-blue">OSINT Toolkit</h1>
        <p className="text-gray-400">Open Source Intelligence Tools</p>
      </header>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-6">
          {['dashboard', 'username', 'email', 'domain', 'ip', 'whois', 'exif', 'reverse-image'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab
                  ? 'bg-cyber-blue text-cyber-darker font-medium'
                  : 'bg-cyber-dark hover:bg-cyber-darker/50'
              }`}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        <div className="bg-cyber-dark p-6 rounded-lg border border-cyber-blue/20">
          {activeTab === 'reverse-image' ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-cyber-blue mb-2">Coming Soon</h2>
              <p className="text-gray-300">This feature is under development. Please check back later!</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-cyber-blue mb-4">
                {activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h2>
              <p className="text-gray-300">
                This is a placeholder for the {activeTab.split('-').join(' ')} functionality.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>OSINT Toolkit &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
