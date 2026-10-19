<template>
  <div class="py-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs and Back Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <Breadcrumbs :breadcrumbs="getBreadcrumbs.dip(yearParam)" />
        <NuxtLink to="/dip" class="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors self-start sm:self-auto bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 shadow-sm">
          <i class="fas fa-arrow-left mr-2"></i> Pilih Tahun Lain
        </NuxtLink>
      </div>

      <div v-if="!isLoading && data" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold">Daftar Informasi Publik (DIP)</h1>
            <p class="text-blue-100 mt-1 text-lg md:text-xl font-medium">Tahun {{ year }}</p>
          </div>

          <!-- Quick Actions / Year Switcher -->
          <div class="flex items-center gap-3">
            <div class="relative">
              <select
                v-model="selectedYear"
                @change="onYearChange"
                class="appearance-none bg-blue-900/50 hover:bg-blue-900/70 border border-white/20 text-white font-bold text-xs md:text-sm px-4 py-2 rounded-xl cursor-pointer pr-8 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm shadow-sm transition-colors"
              >
                <option v-for="y in availableYears" :key="y" :value="y" class="text-gray-900 bg-white">
                  Tahun {{ y }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2.5 pointer-events-none text-blue-200 text-xs">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 md:p-8">
          <!-- Section for "Penetapan DIP" Notification -->
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

      <!-- Not Found State -->
      <div v-else-if="!isLoading && !data" class="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
        <div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-exclamation-triangle text-orange-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h3>
        <p class="text-gray-500">Daftar Informasi Publik untuk Tahun {{ yearParam }} tidak ditemukan.</p>
        <NuxtLink to="/dip" class="inline-flex items-center mt-6 text-blue-600 font-bold hover:underline">
          <i class="fas fa-arrow-left mr-2"></i> Kembali ke Daftar Tahun DIP
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'
import { ref, computed, watch, onMounted } from 'vue'
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

const availableYears = ref([2026, 2025, 2024, 2023, 2022, 2021, 2020])
const selectedYear = ref(Number(yearParam.value) || 2026)

onMounted(() => {
  setTimeout(() => {
    fadeOutNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 500)
  }, 8000)
})

const onYearChange = () => {
  if (selectedYear.value) {
    router.push(`/dip/${selectedYear.value}`)
  }
}

const fetchDip = async ({ queryKey }) => {
  const [_key, targetYear] = queryKey
  if (!targetYear) throw new Error('Tahun tidak valid')
  const res = await api.get(`/dip/${targetYear}`)
  return res.data
}

const { data: response, isLoading, isError } = useQuery({
  queryKey: ['dip-year-detail', yearParam],
  queryFn: fetchDip,
  staleTime: 30000,
  keepPreviousData: true,
  retry: false
})

useGlobalLoader(isLoading)

const data = computed(() => response.value?.data)
const year = computed(() => data.value?.year || yearParam.value)

watch(() => year.value, (newY) => {
  if (newY) {
    selectedYear.value = Number(newY)
    if (!availableYears.value.includes(Number(newY))) {
      availableYears.value.unshift(Number(newY))
      availableYears.value.sort((a, b) => b - a)
    }
  }
}, { immediate: true })

function getCharIndex(index) {
  return String.fromCharCode(97 + index) // 97 is 'a'
}

useHead(() => ({
  title: `DIP Tahun ${year.value || yearParam.value} - PPID Kabupaten Sinjai`,
  meta: [
    { name: 'description', content: `Daftar Informasi Publik (DIP) Kabupaten Sinjai Tahun Anggaran ${year.value || yearParam.value}.` },
    { property: 'og:title', content: `DIP Tahun ${year.value || yearParam.value} - PPID Kabupaten Sinjai` }
  ]
}))
</script>
