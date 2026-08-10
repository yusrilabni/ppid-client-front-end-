<template>
  <div class="py-8 px-4 overflow-x-hidden bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto w-full">
      <!-- Breadcrumbs -->
      <div class="overflow-x-auto mb-4">
        <Breadcrumbs :breadcrumbs="breadcrumbData" />
      </div>

      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">{{ categoryName }}</h1>
          </div>
          <!-- Admin / Create Button -->
          <router-link v-if="isAdmin" :to="`/admin/informasi/create?category=${category}`" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center">
            <i class="fas fa-plus mr-2"></i> Tambah Informasi
          </router-link>
        </div>

        <!-- Search and Filter Controls -->
        <div class="mt-8 mb-10">
          <form @submit.prevent class="relative">
            <!-- Minimalist Search Bar -->
            <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-white mb-6">
              
              <!-- Search Input -->
              <div class="flex-1">
                <label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-4">Pencarian Pintar</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 pl-5 flex items-center text-blue-400 group-focus-within:text-blue-600 transition-colors">
                    <i class="fas fa-search"></i>
                  </span>
                  <input type="text" v-model="filters.search" placeholder="Ketik kata kunci..."
                         class="w-full pl-14 pr-6 py-4 text-sm border-none bg-gray-50/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300 font-bold text-gray-700" />
                </div>
              </div>

              <!-- Grid Controls -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 lg:w-auto">
                <div class="min-w-[140px]">
                  <label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-2">Mulai</label>
                  <input type="date" v-model="filters.date_from"
                         class="w-full px-4 py-4 text-xs border-none bg-gray-50/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-600" />
                </div>
                <div class="min-w-[140px]">
                  <label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-2">Sampai</label>
                  <input type="date" v-model="filters.date_to"
                         class="w-full px-4 py-4 text-xs border-none bg-gray-50/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-600" />
                </div>
                <div class="min-w-[120px]">
                  <label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-2">Urutan</label>
                  <select v-model="filters.sort" class="w-full px-4 py-4 text-xs border-none bg-gray-50/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-600 appearance-none">
                    <option value="tanggal_upload_desc">Terbaru</option>
                    <option value="tanggal_upload_asc">Terlama</option>
                    <option value="title_asc">Judul (A-Z)</option>
                    <option value="title_desc">Judul (Z-A)</option>
                  </select>
                </div>
                <div class="min-w-[100px]">
                  <label class="block text-[10px] font-black text-blue-900/40 mb-2 uppercase tracking-[0.2em] ml-2">Limit</label>
                  <select v-model="filters.per_page" class="w-full px-4 py-4 text-xs border-none bg-gray-50/50 rounded-2xl focus:ring-4 focus:ring-blue-500/10 font-bold text-gray-600 appearance-none">
                    <option value="10">10 Baris</option>
                    <option value="20">20 Baris</option>
                    <option value="50">50 Baris</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Lower Filter Row -->
            <div class="flex flex-col lg:flex-row items-center justify-between gap-6 px-2">
              <button type="button" @click="resetFilters" class="px-6 py-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 flex items-center gap-2 lg:ml-auto group border border-transparent hover:border-red-100 shadow-sm">
                <i class="fas fa-sync-alt text-[10px] group-hover:rotate-180 transition-transform duration-500"></i>
                <span class="text-[10px] font-black uppercase tracking-widest">Reset Filter</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Content Area -->
      <div class="relative min-h-[400px]">
        <!-- Loading Overlay -->
        <div v-if="isFetching" class="absolute inset-0 bg-white/40 backdrop-blur-[4px] z-[60] flex items-center justify-center rounded-[3rem]">
          <div class="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-50 flex flex-col items-center">
            <div class="relative w-16 h-16">
              <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span class="mt-6 text-[10px] font-black text-blue-900 uppercase tracking-[0.3em]">Memproses Data...</span>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="mt-4 bg-white rounded-t-2xl rounded-b-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-gray-50">
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
              <thead>
                <tr class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">No.</th>
                  <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Dokumen / Judul</th>
                  <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Deskripsi Ringkas</th>
                  <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Unit Kerja</th>
                  <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Tgl Upload</th>
                  <th class="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em]">Aktivitas</th>
                  <th class="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em]">Opsi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <template v-if="items.length > 0">
                  <tr v-for="(item, index) in items" :key="item.id" :class="['hover:bg-blue-50/30 transition-colors', item.status === 'ARSIP' ? 'bg-gray-50/50 opacity-70' : '']">
                    <td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-400 text-center">
                      {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
                    </td>
                    <td class="px-6 py-4">
                      <router-link :to="getDetailLink(item)" class="text-sm font-black text-gray-900 hover:text-blue-600 block leading-tight mb-1">
                        {{ item.title }}
                      </router-link>
                      <div class="flex items-center gap-2 mt-1">
                        <span v-if="item.status === 'ARSIP'" class="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest">ARSIP</span>
                        <span v-else-if="['BERLAKU', 'aktif', 'AKTIF'].includes(item.status)" class="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-[9px] font-black uppercase tracking-widest">BERLAKU</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-xs text-gray-500 leading-relaxed max-w-xs">
                      {{ truncateText(item.deskripsi, 80) }}
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-tight inline-block border border-blue-100/50">
                        {{ item.organization_name || 'Unit Tidak Terdaftar' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="text-xs font-bold text-gray-700">{{ formatDate(item.tanggal_upload) }}</span>
                        <span class="text-[9px] text-gray-400 uppercase tracking-widest">Tahun: {{ item.tahun || '-' }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1.5" title="Dilihat">
                          <i class="fas fa-eye text-indigo-400 text-xs"></i>
                          <span class="text-xs font-bold text-gray-600">{{ item.views_count || 0 }}</span>
                        </div>
                        <div class="flex items-center gap-1.5" title="Diunduh">
                          <i class="fas fa-download text-blue-400 text-xs"></i>
                          <span class="text-xs font-bold text-gray-600">{{ item.download_count || 0 }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <div class="flex items-center justify-center gap-2">
                        <router-link :to="getDetailLink(item)" class="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Detail">
                          <i class="fas fa-eye text-sm"></i>
                        </router-link>
                        <a v-if="!item.official && !isStruktur(item.content) && item.url" :href="item.url" target="_blank" class="w-9 h-9 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Buka Link">
                          <i class="fas fa-external-link-alt text-sm"></i>
                        </a>
                        <a v-if="!item.official && !isStruktur(item.content) && item.file_url" :href="item.file_url" target="_blank" download class="w-9 h-9 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Download">
                          <i class="fas fa-download text-sm"></i>
                        </a>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="6" class="px-6 py-20 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                        <i class="fas fa-search-minus text-2xl"></i>
                      </div>
                      <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Tidak ada data ditemukan</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards View -->
          <div class="md:hidden p-4 space-y-4">
            <template v-if="items.length > 0">
              <div v-for="(item, index) in items" :key="item.id" class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div v-if="item.status === 'ARSIP'" class="absolute top-0 right-0 bg-gray-200 text-gray-600 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  ARSIP
                </div>
                <div class="mb-3">
                  <span class="inline-block px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest mb-2 border border-blue-100">
                    {{ item.organization_name || 'Unit Tidak Terdaftar' }}
                  </span>
                  <router-link :to="getDetailLink(item)" class="block text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {{ item.title }}
                  </router-link>
                  <p class="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{{ truncateText(item.deskripsi, 100) }}</p>
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Tgl Upload</span>
                    <span class="text-xs font-bold text-gray-700">{{ formatDate(item.tanggal_upload) }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1">
                      <i class="fas fa-eye text-indigo-400 text-[10px]"></i>
                      <span class="text-[10px] font-bold text-gray-600">{{ item.views_count || 0 }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <i class="fas fa-download text-blue-400 text-[10px]"></i>
                      <span class="text-[10px] font-bold text-gray-600">{{ item.download_count || 0 }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 mt-4">
                  <router-link :to="getDetailLink(item)" class="flex-1 bg-blue-50 text-blue-600 text-xs font-bold py-2 rounded-xl text-center hover:bg-blue-600 hover:text-white transition-colors">
                    Detail
                  </router-link>
                  <a v-if="!item.official && !isStruktur(item.content) && item.file_url" :href="item.file_url" target="_blank" download class="w-10 flex-shrink-0 bg-green-50 text-green-600 flex items-center justify-center rounded-xl hover:bg-green-600 hover:text-white transition-colors">
                    <i class="fas fa-download text-sm"></i>
                  </a>
                </div>
              </div>
            </template>
            <div v-else class="py-12 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <i class="fas fa-search-minus text-2xl"></i>
              </div>
              <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Data kosong</p>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="mt-8 flex justify-center">
          <nav class="inline-flex rounded-xl shadow-sm border border-gray-100 bg-white p-1">
            <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-4 py-2 text-sm font-bold text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors">
              <i class="fas fa-chevron-left"></i>
            </button>
            <template v-for="page in visiblePages" :key="page">
              <span v-if="page === '...'" class="px-4 py-2 text-sm font-bold text-gray-400">...</span>
              <button v-else @click="changePage(page)" :class="['px-4 py-2 text-sm font-bold rounded-lg transition-colors', page === pagination.current_page ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600']">
                {{ page }}
              </button>
            </template>
            <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="px-4 py-2 text-sm font-bold text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors">
              <i class="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'
import debounce from 'lodash.debounce'

const route = useRoute()
const authStore = useAuthStore()

const category = computed(() => route.params.category || '')
const categoryName = computed(() => {
  let name = category.value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  if (!name.toLowerCase().includes('informasi')) {
    name = 'Informasi ' + name
  }
  return name
})

const isAdmin = computed(() => authStore.isAuthenticated && (authStore.isAdmin || authStore.user?.unit_id))

const breadcrumbData = computed(() => [
  { title: 'Beranda', url: '/', icon: 'fas fa-home' },
  { title: 'Informasi Publik', url: '', icon: 'fas fa-folder-open' },
  { title: categoryName.value, url: '', icon: 'fas fa-file-alt' }
])

const filters = reactive({
  search: '',
  date_from: '',
  date_to: '',
  sort: 'tanggal_upload_desc',
  per_page: '10',
  page: 1
})

const debouncedSearch = ref('')

const handleSearch = debounce((val) => {
  debouncedSearch.value = val
  filters.page = 1
}, 500)

watch(() => filters.search, (newVal) => {
  handleSearch(newVal)
})

watch([() => filters.date_from, () => filters.date_to, () => filters.sort, () => filters.per_page], () => {
  filters.page = 1
})

const { data: queryData, isFetching, isLoading } = useQuery({
  queryKey: computed(() => ['informasi', category.value, debouncedSearch.value, filters.date_from, filters.date_to, filters.sort, filters.per_page, filters.page]),
  queryFn: async () => {
    const params = {
      category: categoryName.value,
      search: debouncedSearch.value,
      date_from: filters.date_from,
      date_to: filters.date_to,
      sort: filters.sort,
      per_page: filters.per_page,
      page: filters.page
    }
    const res = await api.get('/informasi', { params })
    return res.data
  },
  staleTime: 30000,
  keepPreviousData: true
})

useGlobalLoader(isLoading)

const items = computed(() => queryData.value?.data?.data || [])
const pagination = computed(() => ({
  current_page: queryData.value?.data?.current_page || 1,
  last_page: queryData.value?.data?.last_page || 1,
  per_page: queryData.value?.data?.per_page || 10,
  total: queryData.value?.data?.total || 0
}))

const visiblePages = computed(() => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', last]
  }
  if (current >= last - 3) {
    return [1, '...', last - 4, last - 3, last - 2, last - 1, last]
  }
  return [1, '...', current - 1, current, current + 1, '...', last]
})

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    filters.page = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const resetFilters = () => {
  filters.search = ''
  filters.date_from = ''
  filters.date_to = ''
  filters.sort = 'tanggal_upload_desc'
  filters.per_page = '10'
  filters.page = 1
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const truncateText = (text, length = 80) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const isStruktur = (content) => {
  return content && content.toString().startsWith('struktur_organisasi_')
}

const getDetailLink = (item) => {
  if (item.official) {
    const posSlug = item.official.position?.slug || ''
    if (posSlug === 'bupati') return '/profil/bupati'
    if (posSlug === 'wakil-bupati') return '/profil/wakil-bupati'
    if (posSlug === 'sekretaris-daerah') return '/profil/sekretaris-daerah'
    return `/profil/${item.official.slug}`
  } else if (isStruktur(item.content)) {
    // Actually, backend V2 opd detail link is by slug. We don't have org slug here easily unless returned.
    // So fallback to detail informasi
    return `/informasi/detail/${item.slug || item.id}`
  }
  return `/informasi/detail/${item.slug || item.id}`
}

watch(category, () => {
  resetFilters()
})

</script>
