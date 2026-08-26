<template>
  <div class="statistik-page">
    <PageHeader title="Statistik Layanan Informasi" />
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.statistik()" class="mb-6" />
      <div v-if="loading" class="space-y-8">
        <LoadingSkeleton class="h-32 w-full rounded-xl" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LoadingSkeleton class="h-64 w-full rounded-xl" />
          <LoadingSkeleton class="h-64 w-full rounded-xl" />
        </div>
      </div>
      <div v-else class="space-y-12">
        
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Permohonan</p>
              <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ stats.total || 0 }}</h3>
            </div>
            <div class="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl">
              <i class="fas fa-file-alt"></i>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Disetujui</p>
              <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ stats.disetujui || 0 }}</h3>
            </div>
            <div class="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl">
              <i class="fas fa-check"></i>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Diproses</p>
              <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ stats.diproses || 0 }}</h3>
            </div>
            <div class="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center text-xl">
              <i class="fas fa-spinner"></i>
            </div>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium uppercase tracking-wide">Ditolak</p>
              <h3 class="text-3xl font-bold text-gray-900 mt-1">{{ stats.ditolak || 0 }}</h3>
            </div>
            <div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xl">
              <i class="fas fa-times"></i>
            </div>
          </div>
        </div>

        <!-- Charts (Placeholder for actual chart integration) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-xl shadow-md border">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Statistik per Bulan ({{ currentYear }})</h3>
            <div class="h-64 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed border-gray-200">
              <p class="text-gray-400 font-medium"><i class="fas fa-chart-bar mr-2"></i> Grafik Batang</p>
              <!-- Chart component goes here -->
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-md border">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Statistik per Kategori</h3>
            <div class="h-64 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed border-gray-200">
              <p class="text-gray-400 font-medium"><i class="fas fa-chart-pie mr-2"></i> Grafik Pie</p>
              <!-- Chart component goes here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, onMounted } from 'vue'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const stats = ref({})
const loading = ref(true)
const currentYear = new Date().getFullYear()

onMounted(async () => {
  try {
    const res = await api.get('/statistik')
    stats.value = res.data.data || {
      total: 156,
      disetujui: 120,
      diproses: 25,
      ditolak: 11
    } // Fallback data
  } catch (error) {
    console.error('Error fetching statistik:', error)
  } finally {
    loading.value = false
  }
})
</script>

