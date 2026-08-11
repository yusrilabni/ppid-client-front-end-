<template>
    <div class="container mx-auto my-8 px-4 md:px-0">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <Breadcrumbs :breadcrumbs="[
            { title: 'Beranda', url: '/', icon: 'fas fa-home' },
            { title: 'Kuesioner PBJ', url: '/pbj', icon: 'fas fa-file-signature' }
          ]" />
        </div>

        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Kuesioner Pengadaan Barang dan Jasa (PBJ)</h2>
          
          <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 3" :key="i" class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl h-40 animate-pulse"></div>
          </div>

          <div v-else-if="years.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="year in years" :key="year" class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 transform hover:-translate-y-1 transition-all duration-300">
              <div class="flex flex-col h-full">
                <div class="flex-1">
                  <div class="p-3 rounded-lg bg-blue-500/10 inline-block">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mt-4">Kuesioner Tahun {{ year }}</h3>
                  <p class="text-gray-600 mt-2">Kumpulan pertanyaan untuk evaluasi PBJ tahun {{ year }}.</p>
                </div>
                <div class="mt-4">
                  <router-link :to="`/pbj/${year}`" class="inline-flex items-center justify-center px-4 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-200">
                    Lihat Detail
                    <i class="fas fa-arrow-right ml-2"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="md:col-span-2 lg:col-span-3 text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Belum Ada Kuesioner</h3>
            <p class="mt-2 text-gray-500">Saat ini belum ada kuesioner PBJ yang tersedia.</p>
          </div>
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
