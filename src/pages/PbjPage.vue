<template>
  <div class="bg-gray-50 min-h-screen pb-12">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white pt-12 pb-20 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
            <svg class="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" fill="currentColor">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
            </svg>
        </div>
        
        <div class="container mx-auto px-6 relative z-10">
            <div class="mb-6 pbj-breadcrumbs">
                <Breadcrumbs :breadcrumbs="[
                    { title: 'Beranda', url: '/', icon: 'fas fa-home' },
                    { title: 'Kuesioner PBJ', url: '/pbj', icon: 'fas fa-file-signature' },
                ]" />
            </div>

            <div class="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Kuesioner PBJ</h1>
                    <p class="text-blue-100 text-lg max-w-2xl leading-relaxed">
                        Daftar Kuesioner Pengadaan Barang dan Jasa Pemerintah Kabupaten Sinjai berdasarkan tahun.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-6 -mt-8 relative z-20">
      
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-white rounded-3xl h-48 border border-gray-100 shadow-sm animate-pulse"></div>
      </div>
      
      <!-- Years List -->
      <div v-else-if="years.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="year in years" :key="year" class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
            <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <i class="fas fa-file-signature text-8xl text-blue-600"></i>
            </div>
            
            <div class="flex-1 relative z-10">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <i class="fas fa-calendar-alt text-xl"></i>
                </div>
                <h3 class="text-2xl font-black text-gray-900 mb-2">Tahun {{ year }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed mb-6">Kumpulan pertanyaan dan dokumen jawaban untuk evaluasi Pengadaan Barang dan Jasa tahun {{ year }}.</p>
            </div>
            
            <div class="mt-auto relative z-10">
                <router-link :to="`/pbj/${year}`" class="w-full inline-flex flex-row items-center justify-center px-4 py-3 text-sm font-bold rounded-2xl bg-gray-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 group/btn">
                    Lihat Kuesioner
                    <i class="fas fa-arrow-right ml-2 group-hover/btn:translate-x-1 transition-transform"></i>
                </router-link>
            </div>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
          <i class="fas fa-folder-open"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Belum Ada Kuesioner</h3>
        <p class="text-gray-500">Saat ini belum ada kuesioner PBJ yang tersedia di sistem.</p>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const { data: yearsResponse, isLoading } = useQuery({
  queryKey: ['pbj-years'],
  queryFn: async () => {
    const res = await api.get('/pbj/years')
    return res.data
  }
})

useGlobalLoader(isLoading)

const years = computed(() => yearsResponse.value?.data || [])
</script>

<style scoped>
::v-deep(.pbj-breadcrumbs a), 
::v-deep(.pbj-breadcrumbs span), 
::v-deep(.pbj-breadcrumbs i) {
    color: rgba(255, 255, 255, 0.9) !important;
}
::v-deep(.pbj-breadcrumbs .breadcrumb-separator) {
    color: rgba(255, 255, 255, 0.4) !important;
}
</style>
