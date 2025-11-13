import React from 'react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyber-blue mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'username', label: 'Username Lookup', icon: '👤' },
          { id: 'email', label: 'Email Scanner', icon: '📧' },
          { id: 'domain', label: 'Domain Scanner', icon: '🌐' },
          { id: 'ip', label: 'IP Lookup', icon: '📍' },
          { id: 'whois', label: 'WHOIS Lookup', icon: '🔍' },
          { id: 'exif', label: 'EXIF Extractor', icon: '🖼️' },
        ].map((item) => (
          <div 
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="bg-cyber-darker p-6 rounded-lg border border-cyber-blue/20 hover:border-cyber-blue/50 cursor-pointer transition-colors"
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <h3 className="text-lg font-semibold text-cyber-blue">{item.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
