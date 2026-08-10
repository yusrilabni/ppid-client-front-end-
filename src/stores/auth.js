import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('ppid_user') || 'null'))
  const token = ref(localStorage.getItem('ppid_token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'superadmin')
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin')
  const userName = computed(() => user.value?.name || '')
  const userRole = computed(() => user.value?.role || 'guest')

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/login', credentials)
      const data = response.data
      if (data.token) {
        token.value = data.token
        user.value = data.user
        localStorage.setItem('ppid_token', data.token)
        localStorage.setItem('ppid_user', JSON.stringify(data.user))
        return { success: true }
      }
      throw new Error(data.message || 'Login gagal')
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Login gagal'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function register(data) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/register', data)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch (e) {
      // ignore logout errors
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('ppid_token')
      localStorage.removeItem('ppid_user')
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const response = await api.get('/user')
      user.value = response.data
      localStorage.setItem('ppid_user', JSON.stringify(response.data))
    } catch (err) {
      if (err.response?.status === 401) {
        token.value = null
        user.value = null
        localStorage.removeItem('ppid_token')
        localStorage.removeItem('ppid_user')
      }
    }
  }

  return {
    user, token, loading, error,
    isAuthenticated, isAdmin, isSuperAdmin, userName, userRole,
    login, register, logout, fetchUser
  }
})
