import React from 'react';

export default function Header() {
  return (
    <header className="bg-cyber-dark border-b border-cyber-blue/20 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-cyber-blue">OSINT Toolkit</h1>
        <div className="flex items-center space-x-4">
          <button className="text-cyber-blue hover:text-cyber-blue/80 transition-colors">
            <span className="text-sm">Login</span>
          </button>
          <button className="bg-cyber-blue text-cyber-dark px-4 py-2 rounded-md hover:bg-cyber-blue/90 transition-colors">
            <span className="text-sm font-medium">Get Started</span>
          </button>
        </div>
      </div>
    </header>
  );
}
