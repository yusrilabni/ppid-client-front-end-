<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
      <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">Memproses Autentikasi...</h2>
      <p class="text-sm text-gray-500">Mohon tunggu sebentar, sedang menghubungkan akun Anda.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token

  if (token) {
    localStorage.setItem('ppid_token', token)
    authStore.token = token
    
    try {
      await authStore.fetchUser()
      router.push('/')
    } catch (error) {
      console.error('Failed to fetch user:', error)
      router.push('/login?error=auth_failed')
    }
  } else {
    router.push('/login?error=auth_failed')
  }
})
</script>
