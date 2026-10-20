import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ppidkab.sinjaikab.go.id'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`, // Use direct API URL since Vercel proxy is blocked by firewall
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Using token-based auth, not cookie-based
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ppid_token')
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`)
      } else if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika request di-set skipAuthRedirect = true, biarkan caller handle sendiri
    if (error.config?.skipAuthRedirect) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('ppid_token')
      localStorage.removeItem('ppid_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Helper for public file/image URLs (not API calls)
export const getStorageUrl = (path) => {
  if (!path) return ''
  let url = String(path).trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    let clean = url.replace(/\\/g, '/').replace(/^\/+/, '')
    if (clean.startsWith('storage/')) {
      clean = clean.substring('storage/'.length)
    }
    url = `${API_BASE_URL}/storage/${clean}`
  }
  // Enforce HTTPS on production to prevent Mixed Content blocking by browsers
  url = url.replace(/^http:\/\/ppidkab\.sinjaikab\.go\.id/i, 'https://ppidkab.sinjaikab.go.id')
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    url = url.replace(/^http:\/\//i, 'https://')
  }
  return url.replace(/ /g, '%20')
}

export const getAssetUrl = (path) => {
  if (!path) return ''
  let url = String(path).trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    let clean = url.replace(/\\/g, '/').replace(/^\/+/, '')
    url = `${API_BASE_URL}/${clean}`
  }
  url = url.replace(/^http:\/\/ppidkab\.sinjaikab\.go\.id/i, 'https://ppidkab.sinjaikab.go.id')
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    url = url.replace(/^http:\/\//i, 'https://')
  }
  return url.replace(/ /g, '%20')
}
