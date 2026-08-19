<template>
  <div class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 pt-6 md:pt-10 pb-24 overflow-hidden">
      <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      <div class="container max-w-6xl mx-auto px-4 relative z-10 text-center">
          <div class="flex flex-wrap items-center justify-start gap-y-2 space-x-2 md:space-x-3 text-blue-200 text-xs md:text-sm mb-6 font-medium w-full text-left">
              <router-link to="/" class="hover:text-white transition-colors flex items-center"><i class="fas fa-home mr-1"></i> Beranda</router-link>
              <i class="fas fa-chevron-right text-[10px] opacity-50"></i>
              <span class="text-white opacity-80 flex items-center"><i class="fas fa-layer-group mr-1"></i> Transparansi</span>
              <i class="fas fa-chevron-right text-[10px] opacity-50"></i>
              <span class="text-white opacity-80 flex items-center"><i class="fas fa-file-pdf mr-1"></i> Informasi Pemkab</span>
          </div>

          <div class="flex justify-center items-center mb-4">
              <div class="w-full relative">
                  <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
                      Informasi Pemkab
                  </h1>
              </div>
          </div>
          <p class="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-light mt-4">
              Transparansi Dokumen Pemerintah Kabupaten yang dapat Anda akses, telusuri, dan unduh dengan mudah.
          </p>
      </div>
      
      <div class="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-1">
          <svg class="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,121.22,201.2,110.53Z" class="fill-gray-50"></path>
          </svg>
      </div>
  </div>

  <div class="bg-gray-50 pb-16">
      <div class="container max-w-6xl mx-auto px-4 -mt-8 relative z-20">
          <div class="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mb-10 transition-all duration-300 hover:shadow-2xl">
              <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                  
                  <div class="relative" style="z-index: 50;">
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                          <i class="fas fa-layer-group text-blue-500 mr-1"></i> Kategori
                      </label>
                      <select v-model="filters.kategori" @change="resetJenis" class="w-full h-[44px] rounded-xl border border-gray-300 px-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium">
                          <option value="">Semua Kategori</option>
                          <option v-for="(jenisList, kat) in kategori_jenis" :key="kat" :value="kat">{{ kat }}</option>
                      </select>
                  </div>
                  
                  <div class="relative" style="z-index: 49;">
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                          <i class="fas fa-file-alt text-blue-500 mr-1"></i> Jenis Dokumen
                      </label>
                      <select v-model="filters.jenis_dokumen" :disabled="!filters.kategori" @change="applyFilters" class="w-full h-[44px] rounded-xl border border-gray-300 px-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                          <option value="">Semua Jenis Dokumen</option>
                          <option v-if="filters.kategori && kategori_jenis[filters.kategori]" v-for="j in kategori_jenis[filters.kategori]" :key="j" :value="j">{{ j }}</option>
                      </select>
                  </div>

                  <div class="relative">
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                          <i class="fas fa-calendar-alt text-blue-500 mr-1"></i> Tahun
                      </label>
                      <select v-model="filters.tahun" @change="applyFilters" class="w-full h-[44px] rounded-xl border border-gray-300 px-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium">
                          <option value="">Semua Tahun</option>
                          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
                      </select>
                  </div>

                  <div class="relative">
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                          <i class="fas fa-list-ol text-blue-500 mr-1"></i> Tampilkan
                      </label>
                      <select v-model="filters.per_page" @change="applyFilters" class="w-full h-[44px] rounded-xl border border-gray-300 px-3 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm font-medium">
                          <option value="10">10 Baris</option>
                          <option value="25">25 Baris</option>
                          <option value="50">50 Baris</option>
                          <option value="100">100 Baris</option>
                      </select>
                  </div>

                  <div class="relative flex flex-col">
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                          <i class="fas fa-search text-blue-500 mr-1"></i> Cari
                      </label>
                      <div class="flex items-center space-x-2">
                          <div class="relative flex-grow">
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <i class="fas fa-search text-gray-400"></i>
                              </div>
                              <input type="text" v-model="filters.search" @keyup.enter="applyFilters" placeholder="Judul..." 
                                  class="w-full pl-10 pr-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all h-[44px] text-sm bg-gray-50 focus:bg-white">
                          </div>
                          <button @click="applyFilters" class="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg rounded-xl h-[44px] px-4 transition-all flex items-center justify-center">
                              Cari
                          </button>
                          <button @click="resetFilters" class="bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm rounded-xl h-[44px] px-3 transition-all flex items-center justify-center border border-gray-200" title="Reset Filter">
                              <i class="fas fa-sync-alt"></i>
                          </button>
                      </div>
                  </div>
              </div>
          </div>

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4 relative z-10">
              <h2 class="text-xl font-bold text-gray-800">Daftar Dokumen</h2>
          </div>

          <!-- Daftar Dokumen -->
          <div class="bg-white/80 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]" style="z-index: 10;">
              
              <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" style="opacity: 0.03;">
                  <div class="w-full h-full" :style="{ backgroundImage: `url(${getAssetUrl('storage/logo/Lambang_Kabupaten_Sinjai.png')})`, backgroundRepeat: 'repeat-y', backgroundPosition: 'center top', backgroundSize: 'contain', minHeight: '800px', filter: 'grayscale(100%)' }"></div>
              </div>

              <div v-if="isLoading" class="p-12 text-center relative z-10">
                  <i class="fas fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
                  <p class="text-gray-500">Memuat data...</p>
              </div>

              <div v-else-if="items.length > 0" class="hidden md:block overflow-x-auto relative z-10">
                  <table class="min-w-full w-full whitespace-nowrap bg-transparent">
                      <thead>
                          <tr class="bg-gray-100/60 border-b border-gray-200 text-left backdrop-blur-sm">
                              <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase">Detail Dokumen</th>
                              <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-48">Kategori</th>
                              <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-32 text-center">Tahun</th>
                              <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-48 text-center">Aksi</th>
                          </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-100/50">
                          <tr v-for="dokumen in items" :key="dokumen.id" class="transition-colors group hover:bg-blue-50/60">
                              <td class="py-4 px-6 whitespace-normal align-middle">
                                  <div class="flex items-center">
                                      <div class="flex-shrink-0">
                                          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-50 border-blue-100 text-blue-600 flex items-center justify-center border shadow-sm">
                                              <i class="fas fa-file-pdf text-lg"></i>
                                          </div>
                                      </div>
                                      <div class="ml-4">
                                          <router-link :to="`/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}`" class="block text-base font-bold text-gray-800 hover:text-blue-700 transition-colors leading-tight">
                                              {{ dokumen.judul }}
                                          </router-link>
                                          <p v-if="dokumen.deskripsi" class="text-sm text-gray-500 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                                              {{ dokumen.deskripsi }}
                                          </p>
                                      </div>
                                  </div>
                              </td>
                              <td class="py-4 px-6 whitespace-normal align-middle">
                                  <span class="inline-block px-3 py-1 bg-white/80 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 mb-1 shadow-sm">
                                      {{ dokumen.kategori }}
                                  </span>
                                  <br>
                                  <span class="inline-block px-3 py-1 bg-blue-50/80 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100 mt-1 shadow-sm">
                                      {{ dokumen.jenis_dokumen }}
                                  </span>
                              </td>
                              <td class="py-4 px-6 text-center align-middle">
                                  <span class="inline-block bg-white/80 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 shadow-sm">
                                      {{ dokumen.tahun }}
                                  </span>
                              </td>
                              <td class="py-4 px-6 text-center align-middle w-48">
                                  <div class="flex items-center justify-center space-x-2">
                                      <router-link :to="`/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}`" class="inline-flex items-center justify-center w-9 h-9 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm transition-all duration-300" title="Lihat Detail">
                                          <i class="fas fa-eye"></i>
                                      </router-link>
                                      <a v-if="dokumen.file_path" :href="getDownloadUrl(dokumen)" target="_blank" class="inline-flex items-center justify-center w-9 h-9 bg-green-50 border border-green-200 text-green-600 hover:bg-green-600 hover:text-white rounded-lg text-sm transition-all duration-300" title="Unduh">
                                          <i :class="dokumen.file_path.startsWith('http') ? 'fas fa-external-link-alt' : 'fas fa-cloud-download-alt'"></i>
                                      </a>
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>

              <div v-else-if="items.length > 0" class="block md:hidden relative z-10 p-3 sm:p-4 space-y-4 bg-gray-50/50">
                  <div v-for="dokumen in items" :key="'mob-'+dokumen.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative flex flex-col">
                      <div class="flex items-start">
                          <div class="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-600 border-blue-100 flex items-center justify-center border shadow-sm mt-0.5">
                              <i class="fas fa-file-pdf text-lg"></i>
                          </div>
                          <div class="ml-3 flex-grow min-w-0">
                              <router-link :to="`/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}`" class="block text-sm sm:text-base font-bold text-gray-800 hover:text-blue-700 leading-snug">
                                  {{ dokumen.judul }}
                              </router-link>
                              <p v-if="dokumen.deskripsi" class="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                                  {{ dokumen.deskripsi }}
                              </p>
                          </div>
                      </div>

                      <div class="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                          <span class="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-semibold rounded-md border border-gray-200">
                              {{ dokumen.kategori }}
                          </span>
                          <span class="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-semibold rounded-md border border-blue-100">
                              {{ dokumen.jenis_dokumen }}
                          </span>
                          <span class="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] sm:text-xs font-semibold rounded-md border border-gray-200">
                              <i class="fas fa-calendar mr-1 text-gray-400"></i> {{ dokumen.tahun }}
                          </span>
                      </div>

                      <div class="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                          <a v-if="dokumen.file_path" :href="getDownloadUrl(dokumen)" target="_blank" class="inline-flex flex-1 sm:flex-none items-center justify-center h-9 px-3 bg-green-50 border border-green-200 text-green-600 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                              <i :class="dokumen.file_path.startsWith('http') ? 'fas fa-external-link-alt' : 'fas fa-cloud-download-alt'"></i> <span class="hidden sm:inline sm:ml-1.5">Unduh</span>
                          </a>
                          <router-link :to="`/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}`" class="inline-flex flex-1 sm:flex-none items-center justify-center h-9 px-3 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                              <i class="fas fa-eye sm:mr-1.5"></i> <span class="hidden sm:inline">Detail</span>
                          </router-link>
                      </div>
                  </div>
              </div>

              <div v-else class="py-20 text-center relative z-10">
                  <div class="flex flex-col items-center justify-center">
                      <div class="w-24 h-24 bg-white/80 shadow-sm rounded-full flex items-center justify-center mb-4">
                          <i class="fas fa-folder-open text-4xl text-gray-300"></i>
                      </div>
                      <h3 class="text-xl font-bold text-gray-700 mb-2">Belum Ada Dokumen</h3>
                      <p class="text-gray-500 font-medium">Silakan sesuaikan filter pencarian Anda.</p>
                  </div>
              </div>
              
              <!-- Pagination -->
              <div v-if="lastPage > 1" class="relative z-10 px-6 py-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm flex justify-center space-x-2">
                  <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 border rounded-md disabled:opacity-50">&laquo; Prev</button>
                  <span class="px-4 py-2 border rounded-md bg-blue-50 text-blue-600 font-bold">{{ currentPage }} / {{ lastPage }}</span>
                  <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage" class="px-4 py-2 border rounded-md disabled:opacity-50">Next &raquo;</button>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api, { getStorageUrl, getAssetUrl } from '@/services/api'

const route = useRoute()
const router = useRouter()

const filters = ref({
  kategori: route.query.kategori || '',
  jenis_dokumen: route.query.jenis_dokumen || '',
  tahun: route.query.tahun || '',
  search: route.query.search || '',
  per_page: route.query.per_page || '10',
  page: route.query.page || 1
})

const kategori_jenis = ref({})

const availableYears = computed(() => {
  const years = []
  const current = new Date().getFullYear()
  for (let y = current; y >= 2000; y--) years.push(y)
  return years
})

const fetchInformasiPemkab = async () => {
  const res = await api.get('/informasi-pemkab', { params: filters.value })
  kategori_jenis.value = res.data.kategori_jenis
  return res.data.data
}

const getDownloadUrl = (dokumen) => {
  return `${api.defaults.baseURL.replace('/api/v1', '')}/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}/download`
}

const { data, isLoading } = useQuery({
  queryKey: ['informasi-pemkab', filters.value],
  queryFn: fetchInformasiPemkab,
  keepPreviousData: true
})

const items = computed(() => data.value?.data || [])
const currentPage = computed(() => data.value?.current_page || 1)
const lastPage = computed(() => data.value?.last_page || 1)

const resetJenis = () => {
  filters.value.jenis_dokumen = ''
  applyFilters()
}

const applyFilters = () => {
  filters.value.page = 1
  updateRoute()
}

const resetFilters = () => {
  filters.value = {
    kategori: '',
    jenis_dokumen: '',
    tahun: '',
    search: '',
    per_page: '10',
    page: 1
  }
  updateRoute()
}

const changePage = (p) => {
  if (p >= 1 && p <= lastPage.value) {
    filters.value.page = p
    updateRoute()
  }
}

const updateRoute = () => {
  router.push({ query: { ...filters.value } })
}

watch(
  () => route.query,
  (newQuery) => {
    filters.value = {
      kategori: newQuery.kategori || '',
      jenis_dokumen: newQuery.jenis_dokumen || '',
      tahun: newQuery.tahun || '',
      search: newQuery.search || '',
      per_page: newQuery.per_page || '10',
      page: newQuery.page || 1
    }
  },
  { deep: true }
)
</script>