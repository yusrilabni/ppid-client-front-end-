import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const getLocal = (key, defaultVal) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) || defaultVal;
    }
    return defaultVal;
  };

  const user = ref(JSON.parse(getLocal('ppid_user', 'null')))
  const token = ref(getLocal('ppid_token', null))
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
      const responseData = response.data
      if (responseData.success && responseData.data?.token) {
        token.value = responseData.data.token
        user.value = responseData.data.user
        localStorage.setItem('ppid_token', responseData.data.token)
        localStorage.setItem('ppid_user', JSON.stringify(responseData.data.user))
        return { success: true }
      }
      throw new Error(responseData.message || 'Login gagal')
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
      const responseData = response.data
      if (responseData.success && responseData.data?.token) {
        token.value = responseData.data.token
        user.value = responseData.data.user
        localStorage.setItem('ppid_token', responseData.data.token)
        localStorage.setItem('ppid_user', JSON.stringify(responseData.data.user))
        return { success: true }
      }
      throw new Error(responseData.message || 'Registrasi gagal')
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Registrasi gagal'
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
