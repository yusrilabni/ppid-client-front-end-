<template>
  <div class="py-8 bg-gray-50 min-h-screen pb-24 lg:pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-6">
              <Breadcrumbs :breadcrumbs="getBreadcrumbs.dipUnitDetail(unitName)" />
          </div>

          <div v-if="!isLoading && data" class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
              <div class="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 md:p-10 text-white relative overflow-hidden">
                  <div class="absolute top-0 right-0 p-10 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                      <i class="fas fa-building text-[120px]"></i>
                  </div>
                  <div class="relative z-10">
                      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                          <div>
                              <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">Daftar Informasi Publik Unit</span>
                              <h1 class="text-3xl md:text-4xl font-extrabold leading-tight mb-2">{{ unitName }}</h1>
                              <p class="text-blue-100 text-lg md:text-xl font-medium opacity-90">Tahun Anggaran {{ selectedYear }}</p>
                          </div>
                          
                          <!-- Export & Year Filter -->
                          <div class="flex flex-col md:flex-row gap-4 items-center">
                              <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 order-1 md:order-2">
                                  <div class="flex flex-col gap-2">
                                      <label for="year" class="text-xs font-bold uppercase tracking-widest text-blue-100">Pilih Tahun DIP</label>
                                      <div class="relative">
                                          <select v-model="selectedYear" id="year" @change="onYearChange"
                                              class="appearance-none w-full md:w-40 bg-white text-gray-900 px-4 py-2.5 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 border-none shadow-sm cursor-pointer pr-10">
                                              <option v-for="availYear in availableYears" :key="availYear" :value="availYear">
                                                  {{ availYear }}
                                              </option>
                                          </select>
                                          <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-blue-600">
                                              <i class="fas fa-chevron-down"></i>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="p-6 md:p-10">
                  <div v-if="isInformasiEmpty" class="text-center py-16">
                      <div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i class="fas fa-exclamation-triangle text-orange-400 text-3xl"></i>
                      </div>
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Data Tidak Ditemukan</h3>
                      <p class="text-gray-500">Belum ada Daftar Informasi Publik (DIP) untuk tahun {{ selectedYear }} pada OPD ini.</p>
                      <router-link to="/dipunit" class="inline-flex items-center mt-6 text-blue-600 font-bold hover:underline">
                          <i class="fas fa-arrow-left mr-2"></i> Kembali ke Daftar Unit
                      </router-link>
                  </div>
                  <div v-else class="space-y-12">
                      <template v-for="(label, key) in categories" :key="key">
                          <div v-if="informasiTahunIni[key]" class="relative">
                              <div class="flex items-center gap-4 mb-8">
                                  <div class="h-10 w-1.5 bg-blue-600 rounded-full"></div>
                                  <h3 class="text-2xl font-black text-gray-800 uppercase tracking-tight">{{ label }}</h3>
                              </div>
                              
                              <div class="space-y-10 pl-2">
                                  <div v-for="(groupedByUnit, jenisDokumen, jenisIndex) in informasiTahunIni[key]" :key="jenisDokumen" class="bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100">
                                      <h4 class="text-lg font-bold text-indigo-700 mb-6 flex items-start">
                                          <span class="bg-indigo-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black mr-4 flex-shrink-0 shadow-md shadow-indigo-100">{{ getCharIndex(jenisIndex) }}</span>
                                          <span class="pt-0.5">{{ jenisDokumen || 'Dokumen Lainnya' }}</span>
                                      </h4>

                                      <div class="space-y-8">
                                          <div v-for="(informasiList, originUnitName) in groupedByUnit" :key="originUnitName" class="relative">
                                              <!-- Unit Origin Label -->
                                              <div class="flex items-center mb-4 gap-3">
                                                  <div class="h-px flex-grow bg-gray-200"></div>
                                                  <span class="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest shadow-sm">
                                                      <i class="fas fa-university mr-2 text-indigo-400"></i> Unit: {{ originUnitName }}
                                                  </span>
                                                  <div class="h-px flex-grow bg-gray-200"></div>
                                              </div>

                                              <div class="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                                                  <DipInformasiTable :informasiList="informasiList" :unitMap="data.unitMap" />
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </template>
                  </div>
              </div>
          </div>
          
          <!-- Info Footer -->
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm px-4">
              <p><i class="fas fa-info-circle mr-2"></i> Data diperbarui secara otomatis oleh sistem PPID.</p>
              <p>&copy; {{ currentYear }} PPID Kabupaten Sinjai</p>
          </div>
      </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import DipInformasiTable from '@/components/DipInformasiTable.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug)
const yearFromQuery = computed(() => route.query.year)

const categories = {
  'Informasi Berkala': '1. Informasi Berkala',
  'Informasi Setiap Saat': '2. Informasi Tersedia Setiap Saat',
  'Informasi Serta Merta': '3. Informasi Serta Merta'
}

const currentYear = new Date().getFullYear()

const fetchDip = async ({ queryKey }) => {
  const [_key, currentSlug, currentYearQuery] = queryKey
  const params = currentYearQuery ? { year: currentYearQuery } : {}
  const res = await api.get(`/dipunit/dip/${currentSlug}`, { params })
  return res.data
}

const { data: response, isLoading } = useQuery({
  queryKey: ['dipunit-detail', slug, yearFromQuery],
  queryFn: fetchDip,
  staleTime: 30000,
  keepPreviousData: true,
})

useGlobalLoader(isLoading)

const data = computed(() => response.value?.data)
const unitName = computed(() => data.value?.unitName || 'Memuat...')
const selectedYear = ref('')

// Watch for data changes to set initial year
watch(data, (newData) => {
  if (newData && newData.year) {
      selectedYear.value = newData.year
  }
}, { immediate: true })

const availableYears = computed(() => data.value?.availableYears || [])
const informasiTahunIni = computed(() => data.value?.informasiTahunIni || {})

const isInformasiEmpty = computed(() => {
  return Object.keys(informasiTahunIni.value).length === 0
})

function onYearChange() {
  if (selectedYear.value) {
      router.push({ query: { year: selectedYear.value } })
  }
}

function getCharIndex(index) {
  return String.fromCharCode(97 + index) // 97 is 'a'
}
</script>
