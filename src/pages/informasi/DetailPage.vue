<template>
  <div class="detail-page bg-gray-50 min-h-screen pb-24 lg:pb-8">
    <div class="container mx-auto py-4 px-4 max-w-7xl">
      <div v-if="loading" class="space-y-4">
        <LoadingSkeleton class="h-8 w-3/4" />
        <LoadingSkeleton class="h-4 w-1/4 mb-8" />
        <LoadingSkeleton class="h-64 w-full mb-8" />
        <LoadingSkeleton v-for="i in 5" :key="i" class="h-4 w-full" />
      </div>

      <div v-else-if="item">
        <!-- Breadcrumbs -->
        <div class="mb-4">
          <Breadcrumbs :breadcrumbs="[
            { title: 'Beranda', url: '/' },
            { title: item.category, url: `/informasi/${getCategorySlug(item.category)}` },
            { title: truncate(item.title, 25), url: '' }
          ]" />
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
                      {{ item.category }}
                    </span>
                    <span v-if="item.status?.toUpperCase() === 'ARSIP'" class="bg-red-500 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                      ARSIP
                    </span>
                  </div>
                  <h1 class="text-2xl sm:text-4xl font-black leading-tight">{{ item.title }}</h1>
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
                      <p class="text-xs font-bold text-gray-700 truncate w-32">{{ item.organization_name }}</p>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="mb-12">
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-900 flex items-center">
                      <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
                      Ringkasan
                    </h2>
                  </div>
                  <div class="text-gray-600 leading-relaxed text-base sm:text-lg bg-slate-50 p-6 rounded-3xl border border-slate-100 italic" v-html="stripTags(item.deskripsi) || 'Tidak ada deskripsi tersedia.'">
                  </div>
                </div>

                <!-- Full Content -->
                <div v-if="item.content" class="mb-12">
                  <h2 class="text-xl font-bold text-gray-900 flex items-center mb-6">
                    <span class="w-1 h-6 bg-indigo-600 rounded-full mr-3"></span>
                    Informasi Lengkap
                  </h2>
                  <div class="prose prose-slate max-w-none text-gray-700" v-html="item.content">
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
                      <a v-if="item.url" :href="item.url" target="_blank" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl text-center shadow-xl shadow-blue-200 transition-all active:scale-95">
                        BUKA TAUTAN <i class="fas fa-external-link-alt ml-2"></i>
                      </a>
                      <a v-else :href="getStorageUrl(item.file)" target="_blank" download class="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-4 px-8 rounded-2xl text-center shadow-xl shadow-green-200 transition-all active:scale-95">
                        UNDUH DOKUMEN <i class="fas fa-download ml-2"></i>
                      </a>
                    </div>
                  </template>
                  <div v-else class="p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] text-center">
                    <i class="fas fa-file-excel text-4xl text-gray-300 mb-4"></i>
                    <p class="font-bold text-gray-400">Belum ada lampiran tersedia</p>
                  </div>
                </div>

                <!-- Related Documents -->
                <div v-if="item.related_informasis?.length" class="mt-16 pt-12 border-t border-gray-100">
                  <h2 class="text-xl font-bold text-gray-900 flex items-center mb-8">
                    <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
                    Dokumen Terkait dari Unit Ini
                  </h2>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <router-link v-for="related in item.related_informasis" :key="related.id" :to="`/informasi/detail/${related.slug}`" class="group flex items-center p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-blue-100 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
                      <div class="w-10 h-10 bg-white group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300">
                        <i class="fas fa-file-alt text-sm"></i>
                      </div>
                      <div class="ml-4 min-w-0">
                        <p class="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{{ related.title }}</p>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{{ formatDate(related.tanggal_upload) }}</p>
                      </div>
                      <i class="fas fa-chevron-right ml-auto text-gray-300 group-hover:text-blue-600 text-[10px] transition-all group-hover:translate-x-1"></i>
                    </router-link>
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
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Unit Kerja</p>
                    <div class="flex items-start">
                      <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-1">
                        <i class="fas fa-building text-blue-600 text-xs"></i>
                      </div>
                      <p class="text-sm font-bold text-gray-800 ml-3 leading-snug">{{ item.organization_name }}</p>
                    </div>
                  </div>

                  <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tanggal Publikasi</p>
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                        <i class="far fa-calendar-alt text-purple-600 text-xs"></i>
                      </div>
                      <p class="text-sm font-bold text-gray-800 ml-3">{{ formatDate(item.tanggal_upload) }}</p>
                    </div>
                  </div>

                  <div v-if="item.official">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Penanggung Jawab</p>
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        <img v-if="item.official.photo" :src="getStorageUrl(item.official.photo)" class="w-full h-full object-cover">
                        <i v-else class="fas fa-user-tie text-emerald-600 text-xs"></i>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-bold text-gray-800">{{ item.official.name }}</p>
                        <p class="text-[10px] text-gray-500 font-medium">{{ item.official.position?.name }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="pt-6 border-t border-gray-100">
                    <div class="flex justify-between items-center">
                      <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dilihat</p>
                        <p class="text-lg font-black text-gray-800">{{ item.views_count || 0 }}<span class="text-xs font-bold text-gray-400 ml-1">kali</span></p>
                      </div>
                      <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                        <i class="far fa-eye text-gray-400"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <div v-else class="py-20 text-center">
        <i class="fas fa-exclamation-triangle text-4xl text-yellow-400 mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Dokumen Tidak Ditemukan</h2>
        <p class="text-gray-500">Dokumen yang Anda cari tidak tersedia atau telah dihapus.</p>
        <button @click="$router.go(-1)" class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          Kembali
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import api, { getStorageUrl } from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const route = useRoute()
const item = ref(null)
const loading = ref(true)

const fetchDetail = async () => {
  loading.value = true
  try {
    const res = await api.get('/informasi/' + route.params.slug)
    item.value = res.data.data
  } catch (error) {
    console.error('Error fetching detail:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})

// Watch slug to refetch when clicking related links
watch(() => route.params.slug, () => {
  if (route.params.slug) {
    fetchDetail()
    window.scrollTo(0, 0)
  }
})

const fileUrl = computed(() => {
  if (!item.value) return null
  return item.value.url || (item.value.file ? getStorageUrl(item.value.file) : null)
})

const fileExtension = computed(() => {
  if (!fileUrl.value) return null
  const url = fileUrl.value.split('?')[0]
  const ext = url.split('.').pop().toLowerCase()
  return ext
})

const isPdf = computed(() => fileExtension.value === 'pdf')
const isImage = computed(() => ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(fileExtension.value))
const isOffice = computed(() => ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExtension.value))
const isGoogleDrive = computed(() => fileUrl.value && fileUrl.value.includes('drive.google.com'))

const previewUrl = computed(() => {
  if (!isGoogleDrive.value) return fileUrl.value
  return fileUrl.value.replace('/view', '/preview')
})

const getCategorySlug = (category) => {
  if (!category) return ''
  return category.replace('Informasi ', '').toLowerCase().replace(/\s+/g, '-')
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const stripTags = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
</script>
