'use client'

import { useState } from 'react'
import { Upload, Loader2, Image as ImageIcon, MapPin, AlertTriangle } from 'lucide-react'
import { exifExtract } from '@/lib/api'
import { motion } from 'framer-motion'

export default function ExifExtractor() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
    }
  }

  const handleExtract = async () => {
    if (!file) {
      setError('Please select an image file')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data = await exifExtract(file)
      setResults(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <ImageIcon className="w-8 h-8 text-pink-400" />
          <h2 className="text-2xl font-bold text-white">EXIF Extractor</h2>
        </div>
        <p className="text-gray-400">
          Extract hidden metadata from images including GPS coordinates, camera info, and more
        </p>
      </div>

      <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-cyber-blue/30 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-cyber-blue mx-auto mb-4" />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue px-6 py-3 rounded-lg font-medium transition-all"
            >
              Choose Image File
            </label>
            {file && (
              <p className="text-gray-400 text-sm mt-4">
                Selected: <span className="text-white">{file.name}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleExtract}
            disabled={loading || !file}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
            <span>{loading ? 'Extracting...' : 'Extract Metadata'}</span>
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">⚠️ {error}</p>}
      </div>

      {results && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Warnings */}
          {results.warnings && results.warnings.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-yellow-400 font-bold mb-2">Security Warnings</h4>
                  <div className="space-y-1">
                    {results.warnings.map((warning: string, idx: number) => (
                      <p key={idx} className="text-sm text-gray-300">{warning}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GPS Data */}
          {results.gps && (
            <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-400">GPS Location Found!</h3>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coordinates:</span>
                    <span className="text-white font-mono">{results.gps.coordinates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Latitude:</span>
                    <span className="text-cyan-400 font-mono">{results.gps.latitude}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Longitude:</span>
                    <span className="text-cyan-400 font-mono">{results.gps.longitude}</span>
                  </div>
                </div>
                {results.gps.google_maps_url && (
                  <a
                    href={results.gps.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* File Info & Metadata */}
          <div className="bg-cyber-dark border border-cyber-blue/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">File Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Filename</p>
                <p className="text-white font-mono mt-1">{results.filename}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Format</p>
                <p className="text-white mt-1">{results.file_info?.format}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">Dimensions</p>
                <p className="text-white mt-1">{results.file_info?.size}</p>
              </div>
              <div className="bg-cyber-darker rounded-lg p-4">
                <p className="text-gray-400 text-sm">File Size</p>
                <p className="text-white mt-1">{(results.file_info?.file_size_bytes / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
