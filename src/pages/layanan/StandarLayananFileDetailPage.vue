<template>
  <div class="detail-page bg-gray-50 min-h-screen pb-24 lg:pb-8">
    <div class="container mx-auto py-4 px-4 max-w-7xl">
      <div v-if="data && data.subStandarLayanan">
        <!-- Breadcrumbs -->
        <div class="mb-4">
          <Breadcrumbs :breadcrumbs="getBreadcrumbs.detailInformasi(item.category, getCategorySlug(item.category), getCategoryIcon(item.category), item.title)" />
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- MAIN CONTENT AREA -->
          <div class="flex-1 min-w-0">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              
              <!-- Premium Header -->
              <div class="bg-gradient-to-br from-blue-600 to-blue-800 p-6 sm:p-10 text-white relative">
                <div class="relative z-10">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="bg-white/20 backdrop-blur-sm text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest border border-white/20">
                      {{ data.subStandarLayanan?.category || 'Dokumen' }}
                    </span>
                    <span v-if="data.subStandarLayanan?.status_tampil?.toUpperCase() === 'ARSIP'" class="bg-red-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                      ARSIP
                    </span>
                  </div>
                  <h1 class="text-2xl sm:text-4xl font-black leading-tight">{{ data.subStandarLayanan?.title }}</h1>
                </div>
                <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl text-blue-500"></div>
              </div>

              <!-- Content Body -->
              <div class="p-6 sm:p-10">
                
                <!-- Quick Info Mobile Only Bar -->
                <div class="lg:hidden flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-3">
                            <i class="fas fa-building text-blue-600 text-xs"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Unit Kerja</p>
                            <p class="text-xs font-bold text-gray-700 truncate w-32">{{ data.subStandarLayanan?.informasi?.organization?.name || 'PPID Kabupaten Sinjai' }}</p>
                        </div>
                    </div>
                    <button @click="sideMenuOpen = true" class="bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg shadow-lg shadow-blue-100">
                        INFO <i class="fas fa-chevron-right ml-1"></i>
                    </button>
                </div>

                <!-- Description -->
                <div class="mb-12" v-if="data.subStandarLayanan?.informasi?.ringkasan">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-900 flex items-center">
                      <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
                      Ringkasan
                    </h2>
                  </div>
                  <div class="text-gray-600 leading-relaxed text-base sm:text-lg bg-slate-50 p-6 rounded-3xl border border-slate-100 italic" v-html="stripTags(data.subStandarLayanan?.informasi?.ringkasan)">
                  </div>
                </div>

                <!-- Attachment -->
                <div class="mb-6">
                  <h2 class="text-xl font-bold text-gray-900 flex items-center mb-6">
                    <span class="w-1 h-6 bg-orange-600 rounded-full mr-3"></span>
                    Dokumen Lampiran
                  </h2>
                  
                  <template v-if="fileUrl">
                    <div class="mb-8">
                      <div v-if="isPdf" class="rounded-3xl overflow-hidden border border-gray-100 shadow-2xl bg-gray-100 h-[500px] sm:h-[800px] relative group/preview">
                        <iframe :src="fileUrl + '#toolbar=0'" class="w-full h-full border-0"></iframe>
                        <div class="absolute top-4 right-4 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                          <a :href="fileUrl" target="_blank" class="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg text-xs font-bold text-blue-600 flex items-center">
                            <i class="fas fa-expand mr-2"></i> LAYAR PENUH
                          </a>
                        </div>
                      </div>
                      <div v-else-if="isImage" class="rounded-3xl overflow-hidden border border-gray-100 p-2 sm:p-4 bg-gray-50 flex justify-center shadow-inner">
                        <img :src="fileUrl" alt="Preview" class="max-w-full h-auto rounded-2xl shadow-2xl border-4 border-white">
                      </div>
                      <div v-else-if="isGoogleDrive" class="rounded-3xl overflow-hidden border border-gray-100 shadow-2xl bg-gray-100 h-[500px] sm:h-[800px] relative">
                        <iframe :src="previewUrl" class="w-full h-full border-0" allow="autoplay"></iframe>
                      </div>
                      <div v-else-if="isOffice" class="rounded-3xl overflow-hidden border border-gray-100 shadow-2xl bg-gray-100 h-[500px] sm:h-[800px] relative">
                        <iframe :src="'https://docs.google.com/viewer?url=' + encodeURIComponent(fileUrl) + '&embedded=true'" class="w-full h-full border-0"></iframe>
                      </div>
                      <div v-else class="p-10 sm:p-16 bg-gradient-to-br from-gray-50 to-slate-100 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-center">
                        <div class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
                          <i class="fas fa-link text-3xl text-blue-500"></i>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 mb-2">Pratinjau Tidak Tersedia</h3>
                        <p class="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">Dokumen ini merupakan tautan eksternal yang memerlukan akses langsung ke situs penyedia.</p>
                      </div>
                    </div>

                    <div class="mt-8 flex flex-col sm:flex-row gap-4">
                      <a v-if="data.subStandarLayanan?.file_type === 'url'" :href="downloadActionUrl" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl text-center shadow-xl shadow-blue-200 transition-all active:scale-95">
                        BUKA TAUTAN <i class="fas fa-external-link-alt ml-2"></i>
                      </a>
                      <a v-else :href="downloadActionUrl" target="_blank" download class="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl text-center shadow-xl shadow-green-200 transition-all active:scale-95">
                        UNDUH DOKUMEN <i class="fas fa-download ml-2"></i>
                      </a>
                    </div>
                  </template>
                  <div v-else class="p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] text-center">
                    <i class="fas fa-file-excel text-4xl text-gray-300 mb-4"></i>
                    <p class="font-bold text-gray-400">Belum ada lampiran tersedia</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- DESKTOP SIDEBAR -->
          <aside class="hidden lg:block w-80 shrink-0">
            <div class="sticky top-24 space-y-6">
              <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Metadata Dokumen</h3>
                
                <div class="space-y-8">
                  <div>
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                            <i class="fas fa-building text-blue-600 text-sm"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unit Kerja</p>
                            <p class="text-sm font-bold text-gray-800 leading-tight">{{ data.subStandarLayanan?.informasi?.organization?.name || 'PPID Kabupaten Sinjai' }}</p>
                        </div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                            <i class="fas fa-file-signature text-orange-600 text-sm"></i>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jenis Dokumen</p>
                            <p class="text-sm font-bold text-gray-800 leading-tight">{{ data.subStandarLayanan?.jenis_dokumen || 'Informasi Publik' }}</p>
                        </div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                            <i class="fas fa-user-check text-emerald-600 text-sm"></i>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pengunggah</p>
                            <p class="text-sm font-bold text-gray-800 leading-tight">{{ data.subStandarLayanan?.informasi?.user?.name || 'Admin PPID' }}</p>
                        </div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                            <i class="fas fa-calendar-alt text-purple-600 text-sm"></i>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tanggal</p>
                            <p class="text-sm font-bold text-gray-800 leading-tight">{{ formatDate(data.subStandarLayanan?.tahun_dokumen) }}</p>
                        </div>
                    </div>
                  </div>

                  <div class="pt-8 border-t border-gray-50">
                      <div class="grid grid-cols-2 gap-4">
                          <div class="bg-gray-50 rounded-2xl p-4 text-center">
                              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Dilihat</p>
                              <p class="text-xl font-black text-slate-800">{{ formatNumber(data.subStandarLayanan?.views_count) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-2xl p-4 text-center">
                              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unduh</p>
                              <p class="text-xl font-black text-slate-800">{{ formatNumber(data.subStandarLayanan?.download_count) }}</p>
                          </div>
                      </div>
                  </div>
                  
                  <button @click="goBack" class="flex items-center justify-center w-full py-4 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-black transition-all">
                      <i class="fas fa-arrow-left mr-2"></i> KEMBALI
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <div v-else-if="!isLoading && (!data || !data.subStandarLayanan)" class="py-20 text-center">
        <i class="fas fa-exclamation-triangle text-4xl text-yellow-400 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Dokumen Tidak Ditemukan</h2>
        <p class="text-gray-500">Dokumen standar layanan yang Anda cari tidak tersedia atau telah dihapus.</p>
        <button @click="goBack" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Kembali
        </button>
      </div>
    </div>
    
    <!-- MOBILE FLOATING INFO BUTTON -->
    <transition enter-active-class="transition duration-200 transform" enter-from-class="scale-0" enter-to-class="scale-100" leave-active-class="transition duration-200 transform" leave-from-class="scale-100" leave-to-class="scale-0">
      <button 
          v-show="!sideMenuOpen"
          @click="sideMenuOpen = true" 
          class="lg:hidden fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-transform active:scale-90 border-4 border-white"
      >
          <i class="fas fa-info-circle text-2xl"></i>
      </button>
    </transition>

    <!-- MOBILE DRAWER -->
    <div v-show="sideMenuOpen" class="fixed inset-0 z-50 lg:hidden overflow-hidden">
        <!-- Overlay -->
        <transition enter-active-class="transition-opacity ease-linear duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity ease-linear duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div v-show="sideMenuOpen" @click="sideMenuOpen = false" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        </transition>
        
        <!-- Drawer Panel -->
        <transition enter-active-class="transition ease-in-out duration-300 transform" enter-from-class="-translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition ease-in-out duration-300 transform" leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
          <div v-show="sideMenuOpen" class="absolute inset-y-0 left-0 max-w-full w-[80%] max-w-xs bg-white shadow-2xl flex flex-col border-r border-gray-100">
              <!-- Close Button Header -->
              <div class="p-6 bg-slate-900 text-white flex items-center justify-between">
                  <div>
                      <h2 class="text-lg font-black uppercase tracking-tighter">Widget Info</h2>
                      <p class="text-[10px] text-slate-400 font-bold">Detail Dokumen PPID</p>
                  </div>
                  <button @click="sideMenuOpen = false" aria-label="Tutup Menu" class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                      <i class="fas fa-times text-white"></i>
                  </button>
              </div>

              <div class="flex-1 overflow-y-auto p-6 space-y-8">
                  <!-- Unit Kerja -->
                  <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div class="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                          <i class="fas fa-building text-sm"></i>
                      </div>
                      <div class="min-w-0">
                          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unit Kerja</p>
                          <p class="text-sm font-bold text-slate-800 leading-tight break-words">{{ data.subStandarLayanan?.informasi?.organization?.name || 'PPID Kabupaten Sinjai' }}</p>
                      </div>
                  </div>

                  <!-- Jenis Dokumen -->
                  <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div class="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-100">
                          <i class="fas fa-file-signature text-sm"></i>
                      </div>
                      <div>
                          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jenis Dokumen</p>
                          <p class="text-sm font-bold text-slate-800 leading-tight">{{ data.subStandarLayanan?.jenis_dokumen || 'Informasi Publik' }}</p>
                      </div>
                  </div>

                  <!-- Pengunggah -->
                  <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div class="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100">
                          <i class="fas fa-user-shield text-sm"></i>
                      </div>
                      <div>
                          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pengunggah</p>
                          <p class="text-sm font-bold text-slate-800 leading-tight">{{ data.subStandarLayanan?.informasi?.user?.name || 'Admin PPID' }}</p>
                      </div>
                  </div>

                  <!-- Tanggal -->
                  <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div class="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-100">
                          <i class="fas fa-calendar-day text-sm"></i>
                      </div>
                      <div>
                          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tanggal</p>
                          <p class="text-sm font-bold text-slate-800 leading-tight">{{ formatDate(data.subStandarLayanan?.tahun_dokumen) }}</p>
                      </div>
                  </div>

                  <!-- Stats -->
                  <div class="grid grid-cols-2 gap-4">
                      <div class="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                          <p class="text-[10px] font-black text-blue-400 uppercase mb-1">Dilihat</p>
                          <p class="text-xl font-black text-blue-700">{{ formatNumber(data.subStandarLayanan?.views_count) }}</p>
                      </div>
                      <div class="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100">
                          <p class="text-[10px] font-black text-emerald-400 uppercase mb-1">Unduhan</p>
                          <p class="text-xl font-black text-emerald-700">{{ formatNumber(data.subStandarLayanan?.download_count) }}</p>
                      </div>
                  </div>
              </div>

              <!-- Footer Action -->
              <div class="p-6 space-y-3">
                  <button @click="sideMenuOpen = false" class="w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] tracking-widest shadow-xl">
                      KEMBALI KE BACAAN
                  </button>
              </div>
          </div>
        </transition>
    </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api, { getAssetUrl } from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug)
const sideMenuOpen = ref(false)

// Format number (e.g., 1000 -> 1.000)
const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

// Format Date
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const stripTags = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '')
}

// Transform title to slug
const getSlug = (title) => {
  if (!title) return ''
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

const getApiUrl = (path) => {
  return getAssetUrl(path.replace(/^\//, ''))
}

const fetchFileDetail = async ({ queryKey }) => {
  const [_key, currentSlug] = queryKey
  const res = await api.get(`/standar-layanan/file/${currentSlug}`)
  return res.data
}

const { data: response, isLoading } = useQuery({
  queryKey: ['standar-layanan-file', slug],
  queryFn: fetchFileDetail,
  staleTime: 30000,
  retry: false
})

useGlobalLoader(isLoading)

const data = computed(() => response.value?.data)

const fileUrl = computed(() => {
  if (!data.value?.subStandarLayanan) return null
  const sub = data.value.subStandarLayanan
  if (sub.file_type === 'url') return sub.url
  if (sub.file) return getAssetUrl(`storage/${sub.file}`)
  return null
})

const fileExtension = computed(() => {
  if (!fileUrl.value) return null
  const url = fileUrl.value.split('?')[0]
  return url.split('.').pop().toLowerCase()
})

const isPdf = computed(() => fileExtension.value === 'pdf')
const isImage = computed(() => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExtension.value))
const isOffice = computed(() => ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExtension.value))
const isGoogleDrive = computed(() => fileUrl.value && fileUrl.value.includes('drive.google.com'))

const previewUrl = computed(() => {
  if (!isGoogleDrive.value) return fileUrl.value
  return fileUrl.value.replace('/view', '/preview')
})

const downloadActionUrl = computed(() => {
  if (!data.value?.subStandarLayanan) return '#'
  const sub = data.value.subStandarLayanan
  if (sub.file_type === 'url') return getApiUrl(`/standar-layanan/visit-url/${sub.id}`)
  return getApiUrl(`/standar-layanan/download/${sub.id}`)
})

const goBack = () => {
  router.back()
}
</script>
