<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Notification Banner -->
    <div 
      v-if="notification.show" 
      class="mb-6 p-4 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-sm" 
      :class="notification.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'"
    >
      <i :class="notification.isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'" class="text-xl"></i>
      <p class="font-medium">{{ notification.message }}</p>
    </div>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-images text-blue-600"></i> Manajemen Galeri
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Kelola dokumentasi foto & video, serta atur visibilitas publik/privat ke beranda.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink 
          to="/galeri" 
          target="_blank" 
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition duration-200 flex items-center gap-2 text-sm"
        >
          <i class="fas fa-external-link-alt"></i> Pratinjau Publik
        </NuxtLink>
        <NuxtLink 
          to="/admin/galeri/create" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 shadow-sm flex items-center gap-2 text-sm"
        >
          <i class="fas fa-plus"></i> Tambah Galeri
        </NuxtLink>
      </div>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
          <i class="fas fa-photo-video"></i>
        </div>
        <div>
          <span class="text-xs text-gray-500 block">Total Galeri</span>
          <span class="text-lg font-bold text-gray-800">{{ stats.total }}</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
          <i class="fas fa-globe"></i>
        </div>
        <div>
          <span class="text-xs text-gray-500 block">Publik (Beranda)</span>
          <span class="text-lg font-bold text-emerald-700">{{ stats.public }}</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
          <i class="fas fa-lock"></i>
        </div>
        <div>
          <span class="text-xs text-gray-500 block">Privat (Belakang)</span>
          <span class="text-lg font-bold text-amber-700">{{ stats.private }}</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
          <i class="fas fa-thumbtack"></i>
        </div>
        <div>
          <span class="text-xs text-gray-500 block">Di-Pin Teratas</span>
          <span class="text-lg font-bold text-purple-700">{{ stats.pinned }}</span>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3 items-center justify-between">
      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <!-- Search Input -->
        <div class="relative flex-1 md:w-72">
          <i class="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari judul galeri..." 
            class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            @keyup.enter="fetchGaleri(1)"
          >
        </div>

        <!-- Filter Visibility -->
        <select 
          v-model="filterVisibility" 
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
          @change="fetchGaleri(1)"
        >
          <option value="">Semua Visibilitas</option>
          <option value="public">Publik (Beranda)</option>
          <option value="private">Privat (Belakang)</option>
        </select>

        <!-- Filter Type -->
        <select 
          v-model="filterType" 
          class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
          @change="fetchGaleri(1)"
        >
          <option value="">Semua Jenis</option>
          <option value="foto">Foto</option>
          <option value="video">Video</option>
        </select>
      </div>

      <button 
        @click="resetFilters" 
        class="text-xs text-gray-500 hover:text-gray-800 font-medium py-2 px-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
      >
        <i class="fas fa-sync-alt mr-1"></i> Reset
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="bg-white rounded-xl shadow-sm p-4 h-72 animate-pulse border border-gray-100">
        <div class="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="galeris.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-images text-2xl"></i>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-1">Tidak ada item galeri</h3>
      <p class="text-gray-500 text-sm mb-6">Belum ada foto atau video yang sesuai dengan filter pencarian Anda.</p>
      <NuxtLink 
        to="/admin/galeri/create" 
        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg text-sm transition"
      >
        <i class="fas fa-plus"></i> Tambah Galeri Sekarang
      </NuxtLink>
    </div>

    <!-- Gallery Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="item in galeris" 
        :key="item.id" 
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col group relative"
      >
        <!-- Pin Button (Floating Top Left) -->
        <button 
          @click="togglePin(item)" 
          class="absolute top-2 left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200"
          :class="item.is_pinned ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-orange-500 hover:bg-white'"
          :title="item.is_pinned ? 'Lepas Pin Teratas' : 'Sematkan ke Teratas'"
        >
          <i class="fas fa-thumbtack text-xs"></i>
        </button>

        <!-- Visibility Badge (Floating Top Right) -->
        <div class="absolute top-2 right-2 z-10">
          <span 
            v-if="item.visibility === 'private'" 
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-md border border-amber-400"
            title="Foto ini HANYA ada di belakang layar (TIDAK masuk ke beranda)"
          >
            <i class="fas fa-lock text-[10px]"></i> Privat
          </span>
          <span 
            v-else 
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md border border-emerald-500"
            title="Foto ini TAMPIL di beranda publik"
          >
            <i class="fas fa-globe text-[10px]"></i> Publik
          </span>
        </div>

        <!-- Thumbnail Media -->
        <div class="h-44 bg-gray-100 relative overflow-hidden flex items-center justify-center">
          <template v-if="item.type === 'foto' || !item.type">
            <img 
              :src="getStorageUrl(item.image) || '/placeholder.jpg'" 
              :alt="item.title" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              @error="(e) => e.target.src = '/placeholder.jpg'"
            >
            <div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
              <i class="fas fa-camera text-[9px]"></i> Foto
            </div>
          </template>
          <template v-else>
            <img 
              v-if="getYoutubeThumbnail(item.video)" 
              :src="getYoutubeThumbnail(item.video)" 
              :alt="item.title" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div v-else class="w-full h-full bg-slate-800 flex items-center justify-center text-gray-400">
              <i class="fas fa-play-circle text-4xl"></i>
            </div>
            <div class="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
              <i class="fas fa-play text-[9px]"></i> Video
            </div>
          </template>
        </div>

        <!-- Content Body -->
        <div class="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            <h3 class="font-bold text-gray-800 text-sm line-clamp-2 leading-snug mb-1" :title="item.title">
              {{ item.title }}
            </h3>
            <p v-if="item.description" class="text-xs text-gray-500 line-clamp-2">
              {{ stripHtml(item.description) }}
            </p>
            <div class="mt-2 flex items-center gap-2 flex-wrap">
              <span v-if="item.category" class="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                {{ item.category }}
              </span>
              <span class="text-[10px] text-gray-400">
                <i class="far fa-calendar-alt mr-1"></i> {{ formatDate(item.tanggal_upload || item.created_at) }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pt-3 border-t border-gray-100 flex items-center gap-2">
            <NuxtLink 
              :to="`/admin/galeri/${item.id}/edit`" 
              class="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold py-2 px-3 rounded-lg text-center transition flex items-center justify-center gap-1"
            >
              <i class="fas fa-edit"></i> Edit
            </NuxtLink>
            <button 
              @click="confirmDelete(item)" 
              class="bg-red-50 hover:bg-red-100 text-red-600 p-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center"
              title="Hapus Galeri"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
      <div class="text-xs text-gray-500">
        Menampilkan halaman <span class="font-bold text-gray-700">{{ currentPage }}</span> dari <span class="font-bold text-gray-700">{{ totalPages }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button 
          :disabled="currentPage <= 1" 
          @click="fetchGaleri(currentPage - 1)" 
          class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i class="fas fa-chevron-left mr-1"></i> Sebelumnya
        </button>
        <button 
          :disabled="currentPage >= totalPages" 
          @click="fetchGaleri(currentPage + 1)" 
          class="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Selanjutnya <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

import { ref, onMounted } from 'vue'
import api, { getStorageUrl } from '@/services/api'

const loading = ref(true)
const galeris = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const filterVisibility = ref('')
const filterType = ref('')

const stats = ref({
  total: 0,
  public: 0,
  private: 0,
  pinned: 0
})

const notification = ref({ show: false, message: '', isError: false })

const showNotification = (message, isError = false) => {
  notification.value = { show: true, message, isError }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch (e) {
    return dateStr
  }
}

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '').trim()
}

const getYoutubeThumbnail = (url) => {
  if (!url) return null
  let videoId = null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      if (parsed.searchParams.has('v')) {
        videoId = parsed.searchParams.get('v')
      } else {
        const parts = parsed.pathname.split('/').filter(Boolean)
        videoId = parts[parts.length - 1]
      }
    }
  } catch (e) {}
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
}

const fetchGaleri = async (page = 1) => {
  loading.value = true
  currentPage.value = page
  try {
    const params = {
      page,
      per_page: 12
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterVisibility.value) params.visibility = filterVisibility.value
    if (filterType.value) params.type = filterType.value

    const res = await api.get('/admin/galeri', { params })
    const data = res.data
    galeris.value = data.data || []
    totalPages.value = data.last_page || 1

    // Update stats from overall or current payload
    calculateStats(galeris.value, data.total)
  } catch (err) {
    console.error('Failed to load galeri:', err)
    showNotification('Gagal memuat data galeri.', true)
  } finally {
    loading.value = false
  }
}

const calculateStats = (items, totalCount) => {
  stats.value.total = totalCount || items.length
  stats.value.public = items.filter(i => !i.visibility || i.visibility === 'public').length
  stats.value.private = items.filter(i => i.visibility === 'private').length
  stats.value.pinned = items.filter(i => i.is_pinned).length
}

const resetFilters = () => {
  searchQuery.value = ''
  filterVisibility.value = ''
  filterType.value = ''
  fetchGaleri(1)
}

const togglePin = async (item) => {
  try {
    const res = await api.post(`/admin/galeri/${item.id}/toggle-pin`)
    item.is_pinned = res.data.is_pinned
    showNotification(res.data.message || 'Status pin berhasil diperbarui')
  } catch (err) {
    showNotification('Gagal mengubah pin status.', true)
  }
}

const confirmDelete = async (item) => {
  if (confirm(`Apakah Anda yakin ingin menghapus galeri "${item.title}"?`)) {
    try {
      await api.delete(`/admin/galeri/${item.id}`)
      showNotification('Galeri berhasil dihapus.')
      fetchGaleri(currentPage.value)
    } catch (err) {
      showNotification('Gagal menghapus galeri.', true)
    }
  }
}

onMounted(() => {
  fetchGaleri(1)
})
</script>
