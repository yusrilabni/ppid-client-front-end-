<template>
  <div class="py-8 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs v-if="!isLoading && data" :breadcrumbs="[
              { title: 'Beranda', url: '/', icon: 'fas fa-home' },
              { title: data.subStandarLayanan?.standar_layanan?.title || 'Kategori', url: '/standar-layanan/' + getSlug(data.subStandarLayanan?.standar_layanan?.title), icon: data.categoryIcon },
              { title: data.subStandarLayanan?.title, url: '#', icon: 'fas fa-file-alt' }
          ]" class="mb-4" />

          <div v-if="!isLoading && data" class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="p-6 md:p-8">
                  <!-- Header -->
                  <div class="mb-8">
                      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div class="flex-1">
                              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                                  {{ data.subStandarLayanan?.title }}
                              </h1>
                              
                              <!-- Desktop Badges -->
                              <div class="hidden md:flex flex-wrap items-center space-x-4 mt-4 text-sm text-gray-500">
                                  <span class="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                      <i class="fas fa-folder-open mr-2 text-blue-600"></i>
                                      {{ data.subStandarLayanan?.standar_layanan?.title || 'Tidak Diketahui' }}
                                  </span>
                                  <span class="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                                      <i class="fas fa-calendar-alt mr-2 text-gray-600"></i>
                                      Tahun {{ data.subStandarLayanan?.tahun_dokumen }}
                                  </span>
                                  <span class="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                                      <i class="fas fa-eye mr-2 text-purple-600"></i>
                                      Dilihat: {{ formatNumber(data.subStandarLayanan?.views_count) }}
                                  </span>
                                  <span class="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                      <i class="fas fa-download mr-2 text-green-600"></i>
                                      Diunduh: {{ formatNumber(data.subStandarLayanan?.download_count) }}
                                  </span>
                              </div>
                          </div>
                      </div>

                      <!-- Mobile Grid Cards -->
                      <div class="grid grid-cols-3 md:hidden gap-2 mt-6">
                          <div class="flex flex-col items-center bg-gray-50 border border-gray-100 p-2 rounded-lg text-center">
                              <i class="fas fa-calendar-alt text-blue-500 mb-1 text-xs"></i>
                              <div class="flex flex-col">
                                  <span class="text-[8px] uppercase text-gray-400 font-bold leading-none">Tahun</span>
                                  <span class="text-[10px] font-bold text-gray-700 leading-tight">
                                      {{ data.subStandarLayanan?.tahun_dokumen }}
                                  </span>
                              </div>
                          </div>
                          <div class="flex flex-col items-center bg-gray-50 border border-gray-100 p-2 rounded-lg text-center">
                              <i class="fas fa-eye text-purple-500 mb-1 text-xs"></i>
                              <div class="flex flex-col">
                                  <span class="text-[8px] uppercase text-gray-400 font-bold leading-none">Lihat</span>
                                  <span class="text-[10px] font-bold text-gray-700 leading-tight">{{ formatNumber(data.subStandarLayanan?.views_count) }}</span>
                              </div>
                          </div>
                          <div class="flex flex-col items-center bg-gray-50 border border-gray-100 p-2 rounded-lg text-center">
                              <i class="fas fa-download text-green-500 mb-1 text-xs"></i>
                              <div class="flex flex-col">
                                  <span class="text-[8px] uppercase text-gray-400 font-bold leading-none">Unduh</span>
                                  <span class="text-[10px] font-bold text-gray-700 leading-tight">{{ formatNumber(data.subStandarLayanan?.download_count) }}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <!-- File Preview / Download Block -->
                  <div class="mt-6">
                      <template v-if="fileUrl">
                          <!-- PDF Preview -->
                          <template v-if="isPdf">
                              <div class="border rounded-lg overflow-hidden">
                                  <iframe :src="fileUrl" width="100%" height="600px" frameborder="0">
                                      <p>Browser Anda tidak mendukung pratinjau PDF. Anda bisa <a :href="fileUrl">mengunduhnya di sini</a>.</p>
                                  </iframe>
                              </div>
                              <div class="mt-4 text-center">
                                  <a :href="downloadActionUrl" target="_blank" class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                                      <i class="fas fa-download mr-2"></i> Unduh PDF
                                  </a>
                              </div>
                          </template>
                          <!-- Image Preview -->
                          <template v-else-if="isImage">
                              <div class="border rounded-lg p-4 flex justify-center bg-gray-50">
                                  <img :src="fileUrl" :alt="data.subStandarLayanan?.title" class="max-w-full h-auto rounded-md shadow-md">
                              </div>
                              <div class="mt-4 text-center">
                                  <a :href="downloadActionUrl" target="_blank" class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                                      <i class="fas fa-download mr-2"></i> Unduh Gambar
                                  </a>
                              </div>
                          </template>
                          <!-- URL or Other File Types -->
                          <template v-else>
                              <div class="p-6 bg-gray-50 border rounded-lg flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                                  <div class="flex items-center">
                                      <i :class="['fas', data.subStandarLayanan?.file_type === 'url' ? 'fa-link' : 'fa-file-alt', 'text-gray-500 text-3xl mr-4']"></i>
                                      <div>
                                          <p class="font-semibold text-gray-800">File tersedia untuk diakses.</p>
                                          <p class="text-sm text-gray-600">{{ data.subStandarLayanan?.file_type === 'url' ? 'Tautan eksternal' : 'File untuk diunduh' }}</p>
                                      </div>
                                  </div>
                                  <a :href="downloadActionUrl"
                                     target="_blank"
                                     class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition whitespace-nowrap">
                                      <i :class="['fas', data.subStandarLayanan?.file_type === 'url' ? 'fa-external-link-alt' : 'fa-download', 'mr-2']"></i>
                                      {{ data.subStandarLayanan?.file_type === 'url' ? 'Kunjungi Tautan' : 'Unduh File' }}
                                  </a>
                              </div>
                          </template>
                      </template>
                      <template v-else>
                          <div class="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                              <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-2"></i>
                              <p class="font-semibold text-red-800">File atau tautan tidak tersedia.</p>
                          </div>
                      </template>
                  </div>
                  
                  <!-- Back Button -->
                  <div class="mt-8 text-right border-t pt-4">
                      <button @click="goBack" class="text-gray-600 hover:text-gray-800 hover:underline">
                          <i class="fas fa-arrow-left mr-1"></i> Kembali
                      </button>
                  </div>
              </div>
          </div>
          
          <div v-else-if="!isLoading && !data" class="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-exclamation-triangle text-orange-400 text-3xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Dokumen Tidak Ditemukan</h3>
              <p class="text-gray-500">File standar layanan yang Anda cari tidak dapat ditemukan.</p>
          </div>
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api, { getAssetUrl } from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug)

// Format number (e.g., 1000 -> 1.000)
const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
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
  if (!data.value?.subStandarLayanan?.file) return null
  const parts = data.value.subStandarLayanan.file.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : null
})

const isPdf = computed(() => {
  return fileUrl.value && fileExtension.value === 'pdf'
})

const isImage = computed(() => {
  return fileUrl.value && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension.value)
})

const downloadActionUrl = computed(() => {
  if (!data.value?.subStandarLayanan) return '#'
  const sub = data.value.subStandarLayanan
  if (sub.file_type === 'url') return getApiUrl(`/standar-layanan/url/${sub.id}`)
  return getApiUrl(`/standar-layanan/download/${sub.id}`)
})

const goBack = () => {
  router.back()
}
</script>
