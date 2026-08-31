import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const store = useAuthStore()
  const token = localStorage.getItem('ppid_token')
  const userStr = localStorage.getItem('ppid_user')
  
  if (token && userStr) {
    store.token = token
    try {
      store.user = JSON.parse(userStr)
    } catch (e) {}
  }
})
