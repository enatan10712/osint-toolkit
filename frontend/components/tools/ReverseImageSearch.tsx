'use client'

import { useState, useRef } from 'react'
import { Image, Loader2, Search, Upload, X } from 'lucide-react'

export default function ReverseImageSearch() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSearch = async () => {
    if (!preview) return
    
    setIsLoading(true)
    setResults([])
    
    try {
      // Convert base64 to blob
      const base64Data = preview.split(',')[1]
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })
      
      // Create form data
      const formData = new FormData()
      formData.append('file', blob, 'search-image.jpg')
      
      // Call the API
      const response = await fetch('http://localhost:8000/api/reverse-image-search', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Search failed')
      }
      
      const data = await response.json()
      setResults(data.results || [])
      
    } catch (error) {
      console.error('Error during reverse image search:', error)
      alert('Failed to perform reverse image search. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setPreview(null)
    setResults([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-cyber-dark/50 p-6 rounded-lg border border-cyber-blue/20">
        <h2 className="text-xl font-bold text-cyber-blue mb-4 flex items-center">
          <Image className="mr-2" size={20} />
          Reverse Image Search
        </h2>
        
        {!preview ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-cyber-blue bg-cyber-darker' : 'border-cyber-blue/30 hover:border-cyber-blue/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto mb-4 text-cyber-blue/70" size={40} />
            <p className="text-cyber-text/80 mb-2">Drag & drop an image here, or click to select</p>
            <p className="text-xs text-cyber-text/50">Supports JPG, PNG, WEBP (Max 5MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative group">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full max-h-64 object-contain rounded-lg border border-cyber-blue/20"
              />
              <button
                onClick={clearSearch}
                className="absolute -top-2 -right-2 bg-cyber-red/90 text-white p-1.5 rounded-full hover:bg-cyber-red transition-colors"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-cyber-blue/90 hover:bg-cyber-blue text-white py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Search for similar images</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-cyber-text mb-4 flex items-center">
            <Search className="mr-2" size={18} />
            Search Results ({results.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <a
                key={index}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-cyber-dark/50 hover:bg-cyber-darker/80 border border-cyber-blue/10 rounded-lg overflow-hidden transition-colors group"
              >
                {result.thumbnail && (
                  <div className="h-40 bg-cyber-darker/50 flex items-center justify-center overflow-hidden">
                    <img 
                      src={result.thumbnail} 
                      alt={result.title || 'Result image'}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRjNTU2YiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMSAxNnY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00Ii8+PHBhdGggZD0ibTYgMTAgNi02IDYgNiIvPjxwYXRoIGQ9Ik0xOCAxNnYtMTJoLTEydi0xMiIvPjwvc3ZnPg=='
                      }}
                    />
                  </div>
                )}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-cyber-blue group-hover:underline truncate">
                    {result.title || 'No title available'}
                  </h4>
                  <p className="text-xs text-cyber-text/70 mt-1 truncate">
                    {result.url ? new URL(result.url).hostname.replace('www.', '') : 'No URL'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin text-cyber-blue mb-4" size={32} />
          <p className="text-cyber-text/80">Searching for similar images...</p>
        </div>
      )}
    </div>
  )
}
