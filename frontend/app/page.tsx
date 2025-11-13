'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, User, Mail, Globe, Network, Fingerprint, Camera, Settings, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  timestamp: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error('Please upload an image file');
    }
  };
  
  // Handle image search
  const handleImageSearch = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    try {
      const response = await fetch('/api/reverse-image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Image search failed:', error);
      toast.error('Failed to perform image search');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const tabs = [
    { 
      id: 'dashboard', 
      icon: <Search className="w-5 h-5" />, 
      label: 'Dashboard',
      mobileLabel: 'Dashboard'
    },
    { 
      id: 'username', 
      icon: <User className="w-5 h-5" />, 
      label: 'Username',
      mobileLabel: 'User'
    },
    { 
      id: 'email', 
      icon: <Mail className="w-5 h-5" />, 
      label: 'Email',
      mobileLabel: 'Email'
    },
    { 
      id: 'domain', 
      icon: <Globe className="w-5 h-5" />, 
      label: 'Domain',
      mobileLabel: 'Domain'
    },
    { 
      id: 'ip', 
      icon: <Network className="w-5 h-5" />, 
      label: 'IP Lookup',
      mobileLabel: 'IP'
    },
    { 
      id: 'whois', 
      icon: <Fingerprint className="w-5 h-5" />, 
      label: 'WHOIS',
      mobileLabel: 'WHOIS'
    },
    { 
      id: 'exif', 
      icon: <Camera className="w-5 h-5" />, 
      label: 'EXIF Data',
      mobileLabel: 'EXIF'
    },
    { 
      id: 'reverse-image', 
      icon: <ImageIcon className="w-5 h-5" />, 
      label: 'Reverse Image',
      mobileLabel: 'Image'
    },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-blue-400">OSINT Toolkit</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transform transition-transform duration-300 ease-in-out w-64 bg-gray-800 shadow-lg h-screen fixed z-50 md:relative`}>
          <div className="p-4 border-b border-gray-700">
            <h1 className="text-xl font-bold text-blue-400">OSINT Toolkit</h1>
          </div>
          <nav className="mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center w-full px-3 md:px-4 py-2 md:py-3 text-left ${
                  activeTab === tab.id 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                title={tab.label}
              >
                <span className="mr-3">{tab.icon}</span>
                <span className="font-medium hidden md:inline">{tab.label}</span>
                <span className="font-medium md:hidden">{tab.mobileLabel}</span>
              </button>
            ))}
          </nav>
          <div className="absolute bottom-0 w-full p-2 md:p-4 border-t border-gray-700">
            <button 
              className="flex items-center w-full px-2 md:px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <Settings className="w-5 h-5 mr-2 md:mr-3 flex-shrink-0" />
              <span className="truncate hidden md:inline">Settings</span>
              <span className="truncate md:hidden">Settings</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-900 min-h-screen">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h1>
            <p className="text-gray-400">
              {activeTab === 'dashboard' 
                ? 'Overview of all OSINT tools and recent activity'
                : `Search and analyze ${activeTab === 'reverse-image' ? 'reverse image' : activeTab} data`}
            </p>
          </header>

          <div className="bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 border border-gray-700">
            {activeTab === 'reverse-image' ? (
              <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2">Reverse Image Search</h1>
                  <p className="text-gray-400">Upload an image to find similar images and gather information</p>
                </div>
                
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-blue-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto max-w-xs">
                        <div className="relative w-full h-48">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-contain rounded-lg"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(selectedFile?.size || 0) / 1024 > 1024
                          ? `${(selectedFile!.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${Math.round(selectedFile!.size / 1024)} KB`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-300" />
                      </div>
                      <div className="space-y-1">
                        <label 
                          htmlFor="file-upload" 
                          className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                        </label>
                        <p className="text-xs text-gray-400">
                          or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 w-full">
                  <button 
                    onClick={handleImageSearch}
                    disabled={!selectedFile || isLoading}
                    className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Search Image
                      </>
                    )}
                  </button>
                </div>
                
                <div className="mt-8 border-t border-gray-700 pt-6 text-sm md:text-base">
                  <h3 className="text-sm font-medium text-white mb-3">How it works</h3>
                  <ol className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white font-medium mr-3">1</span>
                      <span>Upload an image or paste the image URL</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white font-medium mr-3">2</span>
                      <span>Our system will analyze the image</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white font-medium mr-3">3</span>
                      <span>View matches and detailed information</span>
                    </li>
                  </ol>
                </div>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSearch}>
                  <div className="mb-6">
                    <div className="relative rounded-md shadow-sm max-w-xl">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-600 rounded-md p-3 border"
                        placeholder={`Search ${activeTab}...`}
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <button 
                          type="submit"
                          disabled={!searchQuery.trim() || isLoading}
                          className={`px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            !searchQuery.trim() || isLoading
                              ? 'bg-blue-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : 'Search'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-medium text-white">Search Results</h3>
                    <div className="space-y-4">
                      {results.map((result) => (
                        <div key={result.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:shadow-lg transition-shadow">
                          <h4 className="font-medium text-white">{result.title}</h4>
                          <p className="text-sm text-gray-300 mt-1">{result.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-400">{result.source}</span>
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              View source
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchQuery ? (
                  <div className="mt-8 text-center py-12 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="mt-8">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">How to use</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Enter your search query in the field above</li>
                        <li>Click the search button or press Enter</li>
                        <li>View and analyze the results</li>
                        <li>Use the filters to refine your search if needed</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <footer className="mt-12 text-center text-xs md:text-sm text-gray-400 px-4">
            <p>OSINT Toolkit &copy; {new Date().getFullYear()} - Open Source Intelligence Platform</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
