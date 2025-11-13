import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const usernameLookup = async (username: string) => {
  const response = await api.post('/api/username-lookup', { username })
  return response.data
}

export const emailScan = async (email: string) => {
  const response = await api.post('/api/email-scan', { email })
  return response.data
}

export const domainScan = async (domain: string) => {
  const response = await api.post('/api/domain-scan', { domain })
  return response.data
}

export const ipLookup = async (ip: string) => {
  const response = await api.post('/api/ip-lookup', { ip })
  return response.data
}

export const whoisLookup = async (domain: string) => {
  const response = await api.post('/api/whois-lookup', { domain })
  return response.data
}

export const exifExtract = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/api/exif-extract', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const generateReport = async (title: string, data: any, notes: string = '') => {
  const response = await api.post('/api/generate-report', { title, data, notes })
  return response.data
}

export const getSearchHistory = async () => {
  const response = await api.get('/api/search-history')
  return response.data
}

export const clearSearchHistory = async () => {
  const response = await api.delete('/api/search-history')
  return response.data
}
