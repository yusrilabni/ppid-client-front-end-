<template>
  <div class="py-8 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumbs Aligned with Content -->
          <div class="mb-4">
              <Breadcrumbs :breadcrumbs="[
                  { title: 'Beranda', url: '/', icon: 'fas fa-home' },
                  { title: 'DIP Tahun ' + (year || ''), url: '#', icon: 'fas fa-calendar-alt' },
              ]" />
          </div>

          <div v-if="!isLoading && data" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                  <div>
                      <h1 class="text-2xl md:text-3xl font-bold">Daftar Informasi Publik (DIP)</h1>
                      <p class="text-blue-100 mt-1 text-lg md:text-xl font-medium">Tahun {{ year }}</p>
                  </div>
              </div>

              <div class="p-4 md:p-8">
                  <!-- Section for "Penetapan DIP" -->
                  <div v-if="showNotification" class="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm transition-opacity duration-500" :class="{ 'opacity-0': fadeOutNotification }">
                      <p class="text-green-800 text-sm md:text-base leading-relaxed">
                          <i class="fas fa-check-circle mr-2 text-green-500"></i>
                          Daftar Informasi Publik (DIP) Tahun {{ year }} ini telah ditetapkan dan disusun secara otomatis berdasarkan metadata informasi yang tersedia di sistem.
                      </p>
                  </div>

                  <!-- Section for "Pencantuman Informasi Berdasarkan Klasifikasi" -->
                  <div class="space-y-10">
                      <template v-for="(label, key) in categories" :key="key">
                          <div v-if="data.informasiTahunIni && data.informasiTahunIni[key]" class="border-l-4 border-blue-500 pl-4 md:pl-6 py-1">
                              <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-6">{{ label }}</h3>
                              
                              <div class="space-y-8">
                                  <div v-for="(informasiList, jenisDokumen, index) in data.informasiTahunIni[key]" :key="jenisDokumen" class="relative">
                                      <h4 class="text-base md:text-lg font-bold text-blue-700 mb-4 flex items-start">
                                          <span class="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">{{ getCharIndex(index) }}</span>
                                          {{ jenisDokumen || 'Lainnya' }}
                                      </h4>
                                      <div class="md:pl-9">
                                          <DipInformasiTable :informasiList="informasiList" :unitMap="data.unitMap" />
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </template>
                  </div>
              </div>
          </div>
          <div v-else-if="!isLoading && !data" class="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-exclamation-triangle text-orange-400 text-3xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h3>
              <p class="text-gray-500">Daftar Informasi Publik untuk tahun tersebut tidak ditemukan.</p>
              <router-link to="/" class="inline-flex items-center mt-6 text-blue-600 font-bold hover:underline">
                  <i class="fas fa-arrow-left mr-2"></i> Kembali ke Beranda
              </router-link>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import DipInformasiTable from '@/components/DipInformasiTable.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const route = useRoute()
const router = useRouter()
const yearParam = computed(() => route.params.year)

const categories = {
  'Informasi Berkala': '1. Informasi Berkala',
  'Informasi Setiap Saat': '2. Informasi Tersedia Setiap Saat',
  'Informasi Serta Merta': '3. Informasi Serta Merta'
}

const showNotification = ref(true)
const fadeOutNotification = ref(false)

const fetchDip = async ({ queryKey }) => {
  const [_key, year] = queryKey
  if (!year) {
      // Fetch latest year
      const res = await api.get('/dip')
      if (res.data.success && res.data.data.latestYear) {
          router.replace({ name: 'dip', params: { year: res.data.data.latestYear } })
          throw new Error('Redirecting to latest year')
      }
      throw new Error('No data')
  }
  
  const res = await api.get(`/dip/${year}`)
  return res.data
}

const { data: response, isLoading, isError } = useQuery({
  queryKey: ['dip-global', yearParam],
  queryFn: fetchDip,
  staleTime: 30000,
  keepPreviousData: true,
  retry: false
})

useGlobalLoader(isLoading)

const data = computed(() => response.value?.data)
const year = computed(() => data.value?.year || yearParam.value)

onMounted(() => {
  setTimeout(() => {
      fadeOutNotification.value = true
      setTimeout(() => {
          showNotification.value = false
      }, 500)
  }, 8000)
})

function getCharIndex(index) {
  return String.fromCharCode(97 + index) // 97 is 'a'
}
</script>
