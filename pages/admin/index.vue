<template>
  <div class="dashboard-page p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>
    
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <LoadingSkeleton v-for="i in 4" :key="i" class="h-32 w-full rounded-lg" />
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h3 class="text-gray-500 text-sm font-medium uppercase">Total Informasi</h3>
        <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.informasi || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <h3 class="text-gray-500 text-sm font-medium uppercase">Permohonan Baru</h3>
        <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.permohonan_baru || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
        <h3 class="text-gray-500 text-sm font-medium uppercase">Pengunjung Bulan Ini</h3>
        <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.pengunjung || 0 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
        <h3 class="text-gray-500 text-sm font-medium uppercase">Total OPD</h3>
        <p class="text-3xl font-bold text-gray-800 mt-2">{{ stats.opd || 0 }}</p>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold text-gray-800 mb-4">Aktivitas Terbaru</h2>
      <div class="space-y-4">
        <div v-for="(activity, index) in activities" :key="index" class="flex items-start pb-4 border-b last:border-0 last:pb-0">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 flex-shrink-0">
            <i class="fas fa-bell"></i>
          </div>
          <div>
            <p class="text-gray-800 font-medium">{{ activity.message }}</p>
            <p class="text-sm text-gray-500">{{ activity.time }}</p>
          </div>
        </div>
        <div v-if="!activities.length" class="text-center text-gray-500 py-4">
          Tidak ada aktivitas terbaru.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

import { ref, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const stats = ref({})
const activities = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/admin/dashboard')
    stats.value = res.data.data.stats || {}
    activities.value = res.data.data.activities || []
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>


