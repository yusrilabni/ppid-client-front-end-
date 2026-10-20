<template>
  <div class="py-8 md:py-12 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.laporanPpid()" />

      <!-- Header Section -->
      <div class="mb-12 text-center mt-6">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <i class="fas fa-file-invoice text-blue-600"></i>
          Dokumen Resmi PPID
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Laporan Tahunan PPID
        </h1>
        <p class="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Daftar dokumen laporan tahunan pelayanan informasi publik Dinas Komunikasi Informatika dan Persandian sebagai PPID Utama Pemerintah Kabupaten Sinjai.
        </p>
      </div>

      <!-- Filter & Search Bar -->
      <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-80">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul laporan atau tahun..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-gray-500 whitespace-nowrap">Filter Tahun:</span>
            <select
              v-model="selectedYear"
              class="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">Semua Tahun</option>
              <option v-for="yr in availableYears" :key="yr" :value="yr">
                Tahun {{ yr }}
              </option>
            </select>
          </div>

          <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 whitespace-nowrap">
            {{ filteredItems.length }} Laporan
          </span>
        </div>
      </div>

      <!-- Loading State (Skeleton) -->
      <div v-if="loading && items.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <LoadingSkeleton v-for="i in 8" :key="i" class="h-96 w-full rounded-[2.5rem]" />
      </div>

      <!-- Content Grid -->
      <template v-else>
        <div v-if="filteredItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div
            v-for="item in filteredItems"
            :key="item.id || item.encoded_id"
            class="group flex flex-col rounded-[2.5rem] shadow-md hover:shadow-2xl overflow-hidden bg-white border border-gray-100 transition-all duration-500 hover:-translate-y-2 relative"
          >
            <!-- Decorative Accent -->
            <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-50 to-white opacity-50 pointer-events-none"></div>

            <!-- Cover Preview Image / Fallback -->
            <div class="relative h-80 overflow-hidden m-4 rounded-[2rem] shadow-inner bg-gray-50 flex-shrink-0">
              <img
                v-if="item.cover && !failedImages.has(item.id || item.encoded_id)"
                class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                :src="getStorageUrl(item.cover)"
                :alt="item.title"
                @error="handleImageError(item.id || item.encoded_id)"
              />
              <!-- Official Book-style Cover Fallback -->
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-between p-6 text-center bg-gradient-to-br from-blue-700 via-indigo-800 to-blue-900 text-white relative overflow-hidden"
              >
                <!-- Watermark icon -->
                <div class="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                  <i class="fas fa-file-invoice text-9xl text-white"></i>
                </div>
                
                <div class="w-full flex justify-between items-center text-[10px] font-black tracking-widest text-blue-200 uppercase">
                  <span>PPID SINJAI</span>
                  <span>TAHUN {{ item.tahun || item.year }}</span>
                </div>

                <div class="my-auto py-3">
                  <div class="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20 shadow-inner">
                    <i class="fas fa-book-open text-2xl text-blue-200"></i>
                  </div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-white line-clamp-3 leading-snug px-2">
                    {{ item.title }}
                  </h4>
                </div>

                <div class="text-[9px] font-bold text-blue-200/90 uppercase tracking-widest border-t border-white/10 w-full pt-2">
                  Laporan Layanan Informasi
                </div>
              </div>

              <!-- Year Badge -->
              <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-blue-700 px-3.5 py-1.5 rounded-full text-[11px] font-black shadow-md border border-blue-100 flex items-center gap-1.5 z-10">
                <i class="fas fa-calendar-alt text-[10px] text-blue-500"></i>
                <span>TAHUN {{ item.tahun || item.year }}</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="flex-1 p-6 pt-2 flex flex-col justify-between">
              <div class="flex-1 mb-5 flex items-center justify-center min-h-[50px]">
                <h3
                  class="font-black text-gray-900 text-center leading-snug group-hover:text-blue-600 transition-colors"
                  :class="item.title && item.title.length > 50 ? 'text-xs' : (item.title && item.title.length > 25 ? 'text-sm' : 'text-base')"
                >
                  {{ item.title }}
                </h3>
              </div>

              <!-- Action Buttons -->
              <div class="grid grid-cols-1 gap-2.5">
                <NuxtLink
                  :to="`/laporan/ppid/preview/${item.encoded_id}`"
                  class="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] py-3.5 rounded-2xl transition-all duration-300 uppercase tracking-wider gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95"
                >
                  <i class="fas fa-book-open text-xs"></i>
                  Preview Flipbook
                </NuxtLink>
                <a
                  :href="getStorageUrl(item.file)"
                  target="_blank"
                  download
                  class="flex items-center justify-center w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 font-black text-[11px] py-3 rounded-2xl transition-all duration-300 uppercase tracking-wider gap-2 active:scale-95"
                >
                  <i class="fas fa-download text-xs text-blue-500"></i>
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State Filter -->
        <div v-else-if="items.length > 0 && filteredItems.length === 0" class="bg-white rounded-3xl p-16 text-center shadow-sm border border-dashed border-gray-200">
          <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 text-3xl">
            <i class="fas fa-search"></i>
          </div>
          <h3 class="text-xl font-black text-gray-900 mb-2">Tidak Ditemukan</h3>
          <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Tidak ada laporan tahunan yang sesuai dengan kata kunci pencarian atau filter tahun yang dipilih.
          </p>
          <button
            @click="resetFilters"
            class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Reset Filter
          </button>
        </div>

        <!-- Truly Empty State -->
        <div v-else class="bg-white rounded-3xl p-16 sm:p-20 text-center shadow-sm border border-dashed border-gray-200">
          <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-folder-open text-gray-300 text-4xl"></i>
          </div>
          <h3 class="text-2xl font-black text-gray-900 mb-2">Belum Ada Laporan</h3>
          <p class="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Daftar laporan tahunan akan segera tersedia di halaman ini. Silakan kembali lagi nanti.
          </p>
          <button
            @click="refresh"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            <i class="fas fa-sync-alt text-xs text-blue-500"></i>
            Muat Ulang Halaman
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'
import api, { getStorageUrl } from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

// Gunakan server: false karena IP server Vercel (luar negeri) diblokir oleh firewall Pemkab Sinjai.
// Dengan server: false, browser client lokal langsung mengeksekusi fetch secara cepat tanpa timeout atau perlu menekan tombol muat ulang saat hard refresh.
const { data: itemsData, pending: loading, refresh } = useAsyncData('laporan-ppid-list', async () => {
  try {
    const res = await api.get('/laporan')
    const list = Array.isArray(res.data) ? res.data : (res.data?.data || [])
    return list
  } catch (err) {
    console.error('Gagal mengambil daftar laporan PPID:', err)
    return []
  }
}, {
  server: false,
  lazy: true,
  default: () => []
})

const items = computed(() => itemsData.value || [])

// Fallback tracker untuk gambar sampul yang gagal dimuat
const failedImages = ref(new Set())
const handleImageError = (id) => {
  if (id) failedImages.value.add(id)
}

// Otomatis fetch saat client mount jika data masih kosong
onMounted(() => {
  if (!items.value || items.value.length === 0) {
    refresh()
  }
})

// Search & Filter State
const searchQuery = ref('')
const selectedYear = ref('')

const availableYears = computed(() => {
  const yrs = items.value
    .map(item => String(item.tahun || item.year || ''))
    .filter(Boolean)
  return [...new Set(yrs)].sort((a, b) => Number(b) - Number(a))
})

const filteredItems = computed(() => {
  let list = items.value || []

  if (selectedYear.value) {
    list = list.filter(item => String(item.tahun || item.year) === String(selectedYear.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(item => {
      const titleMatch = item.title && item.title.toLowerCase().includes(q)
      const yearMatch = item.tahun && String(item.tahun).includes(q)
      return titleMatch || yearMatch
    })
  }

  return list
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedYear.value = ''
}

useHead({
  title: 'Laporan Tahunan PPID - PPID Kabupaten Sinjai',
  meta: [
    { name: 'description', content: 'Daftar dokumen Laporan Tahunan Pelayanan Informasi Publik Dinas Komunikasi Informatika dan Persandian PPID Kabupaten Sinjai.' },
    { property: 'og:title', content: 'Laporan Tahunan PPID - PPID Kabupaten Sinjai' },
    { property: 'og:description', content: 'Daftar dokumen Laporan Tahunan Pelayanan Informasi Publik Dinas Komunikasi Informatika dan Persandian PPID Kabupaten Sinjai.' }
  ]
})
</script>
