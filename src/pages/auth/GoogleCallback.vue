<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
      <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">Memvalidasi Google...</h2>
      <p class="text-sm text-gray-500">Mohon tunggu, sedang memverifikasi kode dari Google.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const code = route.query.code
  const state = route.query.state || 'login'

  if (code) {
    try {
      // POST the code to Laravel backend
      const response = await api.post('/auth/google/callback-spa', {
        code: code,
        state: state
      })

      if (response.data.success && response.data.token) {
        localStorage.setItem('ppid_token', response.data.token)
        authStore.token = response.data.token
        authStore.user = response.data.user
        router.push('/')
      } else {
        router.push('/login?error=auth_failed&msg=' + encodeURIComponent(response.data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to verify Google code:', error)
      const msg = error.response?.data?.message || error.message || 'Server error'
      router.push('/login?error=auth_failed&msg=' + encodeURIComponent(msg))
    }
  } else {
    router.push('/login?error=auth_failed&msg=No_Code_From_Google')
  }
})
</script>
