<template>
  <div>
    <div class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 pt-6 md:pt-10 pb-24 overflow-hidden">
        <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div class="container max-w-6xl mx-auto px-4 relative z-10 text-center">
            <!-- Breadcrumbs -->
            <Breadcrumbs :breadcrumbs="getBreadcrumbs.informasiPemkab()" theme="dark" />


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
            <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-white mb-6 relative z-50">
                    <div class="flex-1 relative" style="z-index: 50;">
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-2">
                            <i class="fas fa-layer-group text-blue-500 mr-1"></i> Kategori
                        </label>
                        <CustomSelect 
                            v-model="filters.kategori" 
                            :options="kategoriOptions" 
                            labelKey="label" 
                            valueKey="value" 
                            placeholder="Semua Kategori"
                            @change="resetJenis"
                            class="w-full"
                        />
                    </div>
                    
                    <div class="flex-1 relative" style="z-index: 49;">
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-2">
                            <i class="fas fa-file-alt text-blue-500 mr-1"></i> Jenis Dokumen
                        </label>
                        <CustomSelect 
                            v-model="filters.jenis_dokumen" 
                            :options="jenisDokumenOptions" 
                            labelKey="label" 
                            valueKey="value" 
                            placeholder="Semua Jenis Dokumen"
                            @change="applyFilters"
                            class="w-full transition-opacity"
                        />
                    </div>

                    <div class="flex-1 relative" style="z-index: 48;">
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-2">
                            <i class="fas fa-calendar-alt text-blue-500 mr-1"></i> Tahun
                        </label>
                        <CustomSelect 
                            v-model="filters.tahun" 
                            :options="tahunOptions" 
                            labelKey="label" 
                            valueKey="value" 
                            placeholder="Semua Tahun"
                            @change="applyFilters"
                            class="w-full"
                        />
                    </div>

                    <div class="flex-1 relative" style="z-index: 47;">
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-2">
                            <i class="fas fa-search text-blue-500 mr-1"></i> Pencarian
                        </label>
                        <div class="relative">
                            <input 
                                type="text" 
                                v-model="filters.search" 
                                @keyup.enter="applyFilters"
                                placeholder="Cari judul..." 
                                class="w-full h-[44px] pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                            >
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                    </div>

                    <div class="w-full lg:w-48 flex-none pt-2 lg:pt-0 flex gap-2">
                        <button @click="applyFilters" class="flex-1 lg:flex-none w-full lg:w-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 rounded-xl h-[44px] transition-all flex items-center justify-center font-bold" title="Terapkan Filter">
                            <i class="fas fa-search lg:mr-0"></i> <span class="inline lg:hidden ml-2">Cari</span>
                        </button>
                        <button @click="resetFilters" class="flex-1 lg:flex-none w-full lg:w-14 bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm rounded-xl h-[44px] transition-all flex items-center justify-center border border-gray-200" title="Reset Filter">
                            <i class="fas fa-undo-alt lg:mr-0"></i> <span class="inline lg:hidden ml-2 font-semibold">Reset</span>
                        </button>
                        <button @click="copyShareLink" class="flex-1 lg:flex-none w-full lg:w-14 bg-white border-2 border-blue-500 hover:bg-blue-50 text-blue-600 shadow-sm rounded-xl h-[44px] transition-all flex items-center justify-center" title="Bagikan Hasil Filter">
                            <i class="fas fa-share-alt lg:mr-0"></i> <span class="inline lg:hidden ml-2 font-semibold">Bagikan</span>
                        </button>
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

                <template v-else-if="items.length > 0">
                    <div class="hidden md:block overflow-x-auto relative z-10">
                        <table class="min-w-full w-full whitespace-nowrap bg-transparent">
                            <thead>
                                <tr class="bg-gray-100/60 border-b border-gray-200 text-left backdrop-blur-sm">
                                    <th class="py-4 px-4 font-bold text-gray-700 text-sm tracking-wide uppercase w-16 text-center">No</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase">Detail Dokumen</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-48">Kategori</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-48 text-center">Tanggal</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-48 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100/50">
                                <tr v-for="(dokumen, index) in items" :key="dokumen.id" class="transition-colors group hover:bg-blue-50/60">
                                    <td class="py-4 px-4 text-center align-middle font-medium text-gray-500">
                                        {{ (currentPage - 1) * Number(filters.per_page) + index + 1 }}
                                    </td>
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
                                        <span class="inline-block bg-white/80 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 shadow-sm whitespace-nowrap">
                                            {{ formatDate(dokumen.published_at || dokumen.created_at) }}
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
      
                    <div class="block md:hidden relative z-10 p-3 sm:p-4 space-y-4 bg-gray-50/50">
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
                                    <i class="fas fa-calendar mr-1 text-gray-400"></i> {{ formatDate(dokumen.published_at || dokumen.created_at) }}
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
                </template>

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
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api, { getStorageUrl, getAssetUrl } from '@/services/api'
import CustomSelect from '@/components/CustomSelect.vue'

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

const kategoriOptions = computed(() => {
    const opts = [{ label: 'Semua Kategori', value: '' }]
    Object.keys(kategori_jenis.value).forEach(k => opts.push({ label: k, value: k }))
    return opts
})

const jenisDokumenOptions = computed(() => {
    const opts = [{ label: 'Semua Jenis Dokumen', value: '' }]
    if (filters.value.kategori && kategori_jenis.value[filters.value.kategori]) {
        kategori_jenis.value[filters.value.kategori].forEach(j => opts.push({ label: j, value: j }))
    } else if (kategori_jenis.value) {
        let allTypesSet = new Set()
        for (let cat in kategori_jenis.value) {
            kategori_jenis.value[cat].forEach(t => allTypesSet.add(t))
        }
        const allTypes = Array.from(allTypesSet).sort()
        allTypes.forEach(j => opts.push({ label: j, value: j }))
    }
    return opts
})

const tahunOptions = computed(() => {
    const opts = [{ label: 'Semua Tahun', value: '' }]
    availableYears.value.forEach(y => opts.push({ label: y.toString(), value: y.toString() }))
    return opts
})

const perPageOptions = [
    { label: '10 Baris', value: '10' },
    { label: '25 Baris', value: '25' },
    { label: '50 Baris', value: '50' },
    { label: '100 Baris', value: '100' },
]

const fetchInformasiPemkab = async () => {
  const res = await api.get('/informasi-pemkab', { params: filters.value })
  kategori_jenis.value = res.data.kategori_jenis
  return res.data.data
}

const getDownloadUrl = (dokumen) => {
  if (!dokumen) return '#'
  return `${api.defaults.baseURL.replace('/api/v1', '')}/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}/download`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const { data, isLoading } = useQuery({
  queryKey: computed(() => ['informasi-pemkab', filters.value]),
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

const updateTitle = (query) => {
  let title = 'PPID - Informasi Pemkab'
  if (query.kategori) {
    title += ' - ' + query.kategori
  }
  if (query.jenis_dokumen) {
    title += ' - ' + query.jenis_dokumen
  }
  
  let imageUrl = 'https://placehold.co/1200x630/2563eb/ffffff.png?text=Informasi+Pemkab'
  if (query.kategori) {
    imageUrl = `https://placehold.co/1200x630/2563eb/ffffff.png?text=${encodeURIComponent(query.kategori)}`
  }

  document.title = title
  
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.content = title
  
  let ogImage = document.querySelector('meta[property="og:image"]')
  if (!ogImage) {
      ogImage = document.createElement('meta')
      ogImage.setAttribute('property', 'og:image')
      document.head.appendChild(ogImage)
  }
  ogImage.content = imageUrl
}

const copyShareLink = () => {
  const queryObj = { ...filters.value };
  // Remove empty parameters to make URL cleaner
  Object.keys(queryObj).forEach(key => {
    if (!queryObj[key] || queryObj[key] === '') {
      delete queryObj[key];
    }
  });
  const queryString = new URLSearchParams(queryObj).toString();
  const url = `https://ppidkab.sinjaikab.go.id/share/informasi-pemkab${queryString ? '?' + queryString : ''}`;
  
  navigator.clipboard.writeText(url).then(() => {
    alert('Tautan khusus untuk filter ini berhasil disalin!\nSilakan tempel (paste) di WhatsApp atau Facebook Anda.');
  }).catch(err => {
    console.error('Gagal menyalin:', err);
    prompt('Salin tautan berikut secara manual:', url);
  });
}

import { onMounted } from 'vue'

onMounted(() => {
  updateTitle(route.query)
})

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
    updateTitle(newQuery)
  },
  { deep: true }
)
</script>