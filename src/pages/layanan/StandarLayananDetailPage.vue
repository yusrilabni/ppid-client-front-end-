<template>
  <div class="py-8 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Breadcrumbs v-if="!isLoading && data" :breadcrumbs="getBreadcrumbs.standarLayananDetail(data?.standarLayanan?.title, data?.categoryIcon)" class="mb-4" />

          <div v-if="!isLoading && data" class="bg-white rounded-xl shadow-lg overflow-hidden">
              <div class="p-6 md:p-8">
                  <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{{ data.standarLayanan?.title }}</h1>
                  
                  <!-- Desktop Table View -->
                  <div class="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
                      <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                              <tr>
                                  <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">No.</th>
                                  <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Judul Dokumen</th>
                                  <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Aktivitas</th>
                                  <th class="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Aksi</th>
                              </tr>
                          </thead>
                          <tbody class="bg-white divide-y divide-gray-200">
                              <tr v-for="(file, index) in data.subLayanans" :key="file.id" class="hover:bg-gray-50 transition duration-150 ease-in-out">
                                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ index + 1 }}</td>
                                  <td class="px-6 py-4 whitespace-normal text-sm font-semibold text-gray-900">{{ file.title }}</td>
                                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                      <div class="flex flex-col space-y-1">
                                          <div class="flex items-center">
                                              <i class="fas fa-eye text-purple-500 mr-2 text-xs"></i>
                                              <span class="text-xs">Lihat: {{ file.views_count || 0 }}</span>
                                          </div>
                                          <div class="flex items-center">
                                              <i class="fas fa-download text-blue-500 mr-2 text-xs"></i>
                                              <span class="text-xs">Unduh: {{ file.download_count || 0 }}</span>
                                          </div>
                                      </div>
                                  </td>
                                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <div class="flex flex-wrap gap-2">
                                          <router-link :to="`/standar-layanan/file/${file.slug}`"
                                             class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-2 rounded transition duration-150"
                                             title="Lihat Detail">
                                              <i class="fas fa-eye"></i>
                                          </router-link>
                                          
                                          <a v-if="file.file_type === 'url'" :href="getApiUrl(`/standar-layanan/url/${file.id}`)"
                                             target="_blank"
                                             class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded transition duration-150"
                                             title="Buka File Eksternal">
                                              <i class="fas fa-external-link-alt"></i>
                                          </a>
                                          <a v-else-if="file.file" :href="getApiUrl(`/standar-layanan/download/${file.id}`)"
                                             target="_blank"
                                             class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded transition duration-150"
                                             title="Download File">
                                              <i class="fas fa-download"></i>
                                          </a>
                                      </div>
                                  </td>
                              </tr>
                              <tr v-if="!data.subLayanans || data.subLayanans.length === 0">
                                  <td colspan="4" class="px-6 py-12 text-center text-gray-500">Tidak ada dokumen</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>

                  <!-- Mobile Card View -->
                  <div class="md:hidden space-y-4">
                      <div v-for="(file, index) in data.subLayanans" :key="file.id" class="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <h3 class="text-sm font-bold text-gray-900 leading-tight mb-3">{{ file.title }}</h3>

                          <div class="flex items-center justify-between pt-3 border-t border-gray-200">
                              <div class="flex items-center gap-4 text-[10px] text-gray-500">
                                  <span class="flex items-center"><i class="far fa-eye mr-1"></i> {{ file.views_count || 0 }}</span>
                                  <span class="flex items-center"><i class="far fa-arrow-alt-circle-down mr-1"></i> {{ file.download_count || 0 }}</span>
                              </div>
                              
                              <div class="flex items-center gap-2">
                                  <router-link :to="`/standar-layanan/file/${file.slug}`" class="p-2 text-blue-600 bg-white border border-blue-100 rounded-md shadow-sm">
                                      <i class="fas fa-eye text-sm"></i>
                                  </router-link>
                                  <a v-if="file.file_type === 'url'" :href="getApiUrl(`/standar-layanan/url/${file.id}`)" target="_blank" class="p-2 text-green-600 bg-white border border-green-100 rounded-md shadow-sm">
                                      <i class="fas fa-external-link-alt text-sm"></i>
                                  </a>
                                  <a v-else-if="file.file" :href="getApiUrl(`/standar-layanan/download/${file.id}`)" target="_blank" class="p-2 text-green-600 bg-white border border-green-100 rounded-md shadow-sm">
                                      <i class="fas fa-download text-sm"></i>
                                  </a>
                              </div>
                          </div>
                      </div>
                      <div v-if="!data.subLayanans || data.subLayanans.length === 0" class="text-center py-8 text-gray-500 text-sm">
                          Tidak ada dokumen ditemukan
                      </div>
                  </div>

              </div>
          </div>
          
          <div v-else-if="!isLoading && !data" class="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <div class="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-exclamation-triangle text-orange-400 text-3xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h3>
              <p class="text-gray-500">Data standar layanan tidak ditemukan.</p>
          </div>
      </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api, { getAssetUrl } from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug)

// Gunakan base API URL dari backend
const getApiUrl = (path) => {
  return getAssetUrl(path.replace(/^\//, ''))
}

const fetchStandarLayanan = async ({ queryKey }) => {
  const [_key, currentSlug] = queryKey
  const res = await api.get(`/standar-layanan/${currentSlug}`)
  
  if (res.data.success && res.data.redirect) {
      router.replace(res.data.redirectUrl)
      throw new Error('Redirecting')
  }
  
  return res.data
}

const { data: response, isLoading } = useQuery({
  queryKey: ['standar-layanan', slug],
  queryFn: fetchStandarLayanan,
  staleTime: 30000,
  retry: false
})

useGlobalLoader(isLoading)

const data = computed(() => response.value?.data)
</script>
