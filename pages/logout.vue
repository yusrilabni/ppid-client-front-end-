<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600 font-medium">Sedang keluar dari sistem...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Jika memang belum login, langsung lempar ke halaman login
  if (!authStore.isAuthenticated) {
    return router.push('/login')
  }

  // Lakukan proses logout
  await authStore.logout()
  
  // Arahkan ke halaman login
  router.push('/login')
})
</script>
