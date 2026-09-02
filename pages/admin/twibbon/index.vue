<template>
  <div class="p-6">
    <!-- Notification Banner -->
    <div v-if="notification.show" class="mb-6 p-4 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-sm" :class="notification.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'">
      <i :class="notification.isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'" class="text-xl"></i>
      <p class="font-medium">{{ notification.message }}</p>
    </div>

    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Manajemen Twibbon</h1>
      <NuxtLink to="/admin/twibbon/create" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 shadow-sm flex items-center gap-2">
        <i class="fas fa-plus"></i> Tambah Twibbon
      </NuxtLink>
    </div>
    
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-sm p-4 h-64 animate-pulse">
        <div class="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <div v-else-if="twibbons.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-camera-retro text-2xl"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">Belum ada Twibbon</h3>
      <p class="text-gray-500 mb-6">Silakan tambahkan frame twibbon pertama Anda.</p>
      <NuxtLink to="/admin/twibbon/create" class="text-blue-600 font-medium hover:underline">Tambah Sekarang</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="item in twibbons" :key="item.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition flex flex-col">
        <NuxtLink :to="`/twibbon/${item.slug}`" target="_blank" class="block h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4 checkerboard cursor-pointer">
          <img :src="getStorageUrl(item.file_path)" :alt="item.judul" class="max-h-full object-contain drop-shadow-md z-10 relative group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
        </NuxtLink>
        <div class="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <h3 class="font-bold text-gray-800 text-sm truncate mb-1" :title="item.judul">{{ item.judul }}</h3>
            <p class="text-xs text-gray-500"><i class="far fa-clock mr-1"></i> {{ formatDate(item.created_at) }}</p>
          </div>
          <div class="flex items-center gap-2 mt-2 pt-3 border-t border-gray-100">
            <NuxtLink :to="`/twibbon/${item.slug}`" target="_blank" class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-2 px-3 rounded-lg text-center transition flex items-center justify-center gap-1">
              <i class="fas fa-external-link-alt"></i> Buka Editor
            </NuxtLink>
            <button @click="deleteTwibbon(item.id)" class="bg-red-50 hover:bg-red-100 text-red-600 p-2 px-3 rounded-lg transition flex items-center justify-center" title="Hapus Twibbon">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkerboard {
  background-image: 
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>

<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api, { getStorageUrl } from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const twibbons = ref([])
const notification = ref({ show: false, message: '', isError: false })

const showNotification = (message, isError = false) => {
  notification.value = { show: true, message, isError }
  setTimeout(() => {
    notification.value.show = false
  }, 5000)
}

onMounted(() => {
  if (!authStore.isSuperAdmin) {
    router.push('/admin')
    return
  }
  
  if (route.query.success === 'created') {
    showNotification('Twibbon berhasil ditambahkan!')
    router.replace({ query: {} })
  }
  
  fetchTwibbons()
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
}

const fetchTwibbons = async () => {
  try {
    loading.value = true
    const res = await api.get('/twibbon')
    
    // Parse response data robustly
    const data = res.data
    if (Array.isArray(data)) {
      twibbons.value = data
    } else if (data?.data && Array.isArray(data.data)) {
      twibbons.value = data.data
    } else if (data?.data?.data && Array.isArray(data.data.data)) {
      twibbons.value = data.data.data
    } else {
      twibbons.value = []
    }
  } catch (error) {
    console.error('Error fetching twibbons:', error)
  } finally {
    loading.value = false
  }
}

const deleteTwibbon = async (id) => {
  if (!confirm('Yakin ingin menghapus twibbon ini?')) return
  
  try {
    await api.delete(`/twibbon/${id}`)
    twibbons.value = twibbons.value.filter(t => t.id !== id)
    showNotification('Twibbon berhasil dihapus!')
  } catch (error) {
    showNotification('Gagal menghapus twibbon', true)
  }
}
</script>
