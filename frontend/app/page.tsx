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
    { id: 'dashboard', icon: <Search className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'username', icon: <User className="w-5 h-5" />, label: 'Username' },
    { id: 'email', icon: <Mail className="w-5 h-5" />, label: 'Email' },
    { id: 'domain', icon: <Globe className="w-5 h-5" />, label: 'Domain' },
    { id: 'ip', icon: <Network className="w-5 h-5" />, label: 'IP Lookup' },
    { id: 'whois', icon: <Fingerprint className="w-5 h-5" />, label: 'WHOIS' },
    { id: 'exif', icon: <Camera className="w-5 h-5" />, label: 'EXIF Data' },
    { id: 'reverse-image', icon: <ImageIcon className="w-5 h-5" />, label: 'Reverse Image' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-indigo-600">OSINT Toolkit</h1>
          </div>
          <nav className="mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full px-4 py-3 text-left ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className="mr-3">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t">
            <button className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500">
              {activeTab === 'dashboard' 
                ? 'Overview of all OSINT tools and recent activity'
                : `Search and analyze ${activeTab === 'reverse-image' ? 'reverse image' : activeTab} data`}
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'reverse-image' ? (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Reverse Image Search</h1>
                  <p className="text-gray-500">Upload an image to find similar images and gather information</p>
                </div>
                
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
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
                      <p className="text-sm text-gray-600 truncate">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile?.size || 0) / 1024 > 1024
                          ? `${(selectedFile!.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${Math.round(selectedFile!.size / 1024)} KB`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="space-y-1">
                        <label 
                          htmlFor="file-upload" 
                          className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
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
                        <p className="text-xs text-gray-500">
                          or drag and drop
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <button 
                    onClick={handleImageSearch}
                    disabled={!selectedFile || isLoading}
                    className={`w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
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
                
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">How it works</h3>
                  <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium mr-3">1</span>
                      <span>Upload an image or paste the image URL</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium mr-3">2</span>
                      <span>Our system will analyze the image</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium mr-3">3</span>
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
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md p-3 border"
                        placeholder={`Search ${activeTab}...`}
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <button 
                          type="submit"
                          disabled={!searchQuery.trim() || isLoading}
                          className={`px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            !searchQuery.trim() || isLoading
                              ? 'bg-indigo-400 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
                    <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
                    <div className="space-y-4">
                      {results.map((result) => (
                        <div key={result.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                          <h4 className="font-medium text-gray-900">{result.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">{result.source}</span>
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-600 hover:text-indigo-800"
                            >
                              View source
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : searchQuery ? (
                  <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="mt-8">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">How to use</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-600">
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

          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>OSINT Toolkit &copy; {new Date().getFullYear()} - Open Source Intelligence Platform</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
