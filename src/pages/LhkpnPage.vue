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
            <div class="mb-6 lhkpn-breadcrumbs">
                <Breadcrumbs :breadcrumbs="getBreadcrumbs.lhkpn()" />
            </div>

            <div class="mt-8">
                <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Laporan Harta Kekayaan (LHKPN)</h1>
                <p class="text-blue-100 text-lg max-w-2xl leading-relaxed">
                    Transparansi Harta Kekayaan Penyelenggara Negara di Lingkungan Pemerintah Kabupaten Sinjai.
                </p>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-6 -mt-8 relative z-20">
      <!-- Search & Filters -->
      <div class="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 mb-12 flex flex-col md:flex-row gap-4 border border-gray-100">
        <div class="flex-1 relative" style="z-index: 100;">
          <label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-4">Cari Pejabat / Jabatan</label>
          <div class="bg-gray-50/50 rounded-2xl">
            <CustomInput 
              v-model="filters.search" 
              placeholder="Ketik nama atau jabatan..." 
              icon="fas fa-search"
            />
          </div>
        </div>
        
        <div class="min-w-[200px] relative" style="z-index: 90;">
          <label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-4">Tahun Laporan</label>
          <div class="bg-gray-50/50 rounded-2xl">
            <CustomSelect 
              v-model="filters.year"
              :options="yearOptions"
              :searchable="false"
              placeholder="Semua Tahun"
            />
          </div>
        </div>
      </div>
      
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-12">
        <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="j in 3" :key="j" class="bg-white rounded-3xl h-64 border border-gray-100"></div>
            </div>
        </div>
      </div>
      
      <!-- Data Sections -->
      <div v-else-if="items.length > 0" class="space-y-16">
        <!-- Pimpinan -->
        <section v-if="pimpinan.length > 0">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-white mr-4">
                        <i class="fas fa-crown text-xl"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-gray-900">LHKPN Pimpinan</h2>
                        <p class="text-gray-500 text-sm">Bupati, Wakil Bupati, dan Sekretaris Daerah</p>
                    </div>
                </div>
                <div class="h-px flex-1 bg-gray-200 mx-8 hidden lg:block"></div>
                <span class="px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-full border border-blue-100">
                    {{ pimpinan.length }} Jabatan
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <LhkpnCard v-for="item in pimpinan" :key="item.display_title" :item="item" :year-filter="filters.year" />
            </div>
        </section>

        <!-- Eselon 2 -->
        <section v-if="eselon2.length > 0">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-green-600 rounded-2xl shadow-lg flex items-center justify-center text-white mr-4">
                        <i class="fas fa-building text-xl"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-gray-900">LHKPN Eselon II</h2>
                        <p class="text-gray-500 text-sm">Asisten, Staf Ahli, dan Pejabat Daerah</p>
                    </div>
                </div>
                <div class="h-px flex-1 bg-gray-200 mx-8 hidden lg:block"></div>
                <span class="px-4 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-100">
                    {{ eselon2.length }} Jabatan
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <LhkpnCard v-for="item in eselon2" :key="item.display_title" :item="item" :year-filter="filters.year" />
            </div>
        </section>

        <!-- Eselon 3 -->
        <section v-if="eselon3.length > 0">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-amber-500 rounded-2xl shadow-lg flex items-center justify-center text-white mr-4">
                        <i class="fas fa-map-marked-alt text-xl"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-gray-900">LHKPN Eselon III</h2>
                        <p class="text-gray-500 text-sm">Para Camat Se-Kabupaten Sinjai</p>
                    </div>
                </div>
                <div class="h-px flex-1 bg-gray-200 mx-8 hidden lg:block"></div>
                <span class="px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-bold rounded-full border border-amber-100">
                    {{ eselon3.length }} Jabatan
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <LhkpnCard v-for="item in eselon3" :key="item.display_title" :item="item" :year-filter="filters.year" />
            </div>
        </section>
      </div>

      <!-- No Data -->
      <div v-else class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
          <i class="fas fa-search-minus"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h3>
        <p class="text-gray-500">Silakan ubah kata kunci pencarian Anda.</p>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CustomInput from '@/components/CustomInput.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import LhkpnCard from '@/components/LhkpnCard.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const filters = reactive({
  search: '',
  year: ''
})

const debouncedSearch = ref('')

const handleSearch = debounce((val) => {
  debouncedSearch.value = val
}, 500)

watch(() => filters.search, (newVal) => {
  handleSearch(newVal)
})

const { data: response, isLoading } = useQuery({
  queryKey: computed(() => ['lhkpn', debouncedSearch.value, filters.year]),
  queryFn: async () => {
    const res = await api.get('/lhkpn', { params: { search: debouncedSearch.value, year: filters.year } })
    return res.data
  }
})

useGlobalLoader(isLoading)

const items = computed(() => response.value?.data?.items || [])
const availableYears = computed(() => response.value?.data?.stats?.available_years || [])

const yearOptions = computed(() => {
  const opts = availableYears.value.map(y => ({ value: String(y), label: `Tahun ${y}` }))
  opts.unshift({ value: '', label: 'Semua Tahun' })
  return opts
})

const pimpinan = computed(() => items.value.filter(i => i.group === 'pimpinan'))
const eselon2 = computed(() => items.value.filter(i => i.group === 'eselon2'))
const eselon3 = computed(() => items.value.filter(i => i.group === 'eselon3'))

</script>

<style scoped>
::v-deep(.lhkpn-breadcrumbs a), 
::v-deep(.lhkpn-breadcrumbs span), 
::v-deep(.lhkpn-breadcrumbs i) {
    color: rgba(255, 255, 255, 0.9) !important;
}
::v-deep(.lhkpn-breadcrumbs .breadcrumb-separator) {
    color: rgba(255, 255, 255, 0.4) !important;
}
</style>
