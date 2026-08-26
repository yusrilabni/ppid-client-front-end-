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
  const token = localStorage.getItem('ppid_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}/storage/${path}`
}

export const getAssetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}/${path}`
}
