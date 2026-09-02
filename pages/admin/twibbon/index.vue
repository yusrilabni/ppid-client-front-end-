<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Manajemen Twibbon</h1>
      <NuxtLink to="/admin/twibbon/create" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200">
        <i class="fas fa-plus mr-2"></i> Tambah Twibbon
      </NuxtLink>
    </div>
    
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-camera-retro text-2xl"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">Halaman Twibbon</h3>
      <p class="text-gray-500">Fitur manajemen Twibbon sedang disiapkan.</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // Pastikan hanya superadmin yang bisa akses
  if (!authStore.isSuperAdmin) {
    router.push('/admin')
  }
})
</script>
