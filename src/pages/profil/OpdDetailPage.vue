<template>
  <div class="py-8 md:py-12 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-8">
        <Breadcrumbs :breadcrumbs="getBreadcrumbs.opdDetail(organization?.nama_organisasi)" />
      </div>

      <template v-if="!loading">
        <div v-if="error || !organization" class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <i class="fas fa-building h-24 w-24 text-gray-300 mb-4 text-6xl"></i>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">OPD Tidak Ditemukan</h1>
          <p class="text-gray-600 mb-6">Maaf, data OPD yang Anda cari tidak tersedia.</p>
          <router-link to="/profil/tentang-opd" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Kembali ke Daftar OPD
          </router-link>
        </div>

        <div v-else class="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 md:p-12 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <i class="fas fa-building text-[150px]"></i>
                </div>
                <div class="relative z-10 text-center">
                    <span class="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/20">Profil Organisasi Perangkat Daerah</span>
                    <h1 class="text-3xl md:text-5xl font-black mb-6 leading-tight">{{ organization.name }}</h1>
                    
                    <div v-if="organization.website_url" class="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                        <div class="flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                            <i class="fas fa-globe mr-3 text-blue-300"></i>
                            <span class="text-sm font-bold tracking-wide">{{ organization.website_url.replace(/^https?:\/\//, '') }}</span>
                        </div>
                        <a :href="organization.website_url" target="_blank" class="inline-flex items-center justify-center bg-white text-blue-700 font-black text-xs px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-xl uppercase tracking-widest gap-2">
                            <i class="fas fa-external-link-alt"></i> Kunjungi Website Resmi
                        </a>
                    </div>
                </div>
            </div>

            <!-- Content Section -->
            <div class="p-8 md:p-16">
                <div class="mb-12 flex items-center gap-4">
                    <div class="h-10 w-2 bg-blue-600 rounded-full"></div>
                    <h2 class="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Struktur Organisasi</h2>
                </div>

                <div v-if="informasi && informasi.file" class="relative group">
                    <div class="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[3rem] opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500"></div>
                    <div class="relative bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-gray-100 overflow-hidden">
                        <img :src="getStorageUrl(informasi.file)" 
                             :alt="`Struktur Organisasi ${organization.name}`" 
                             class="w-full h-auto rounded-[1.5rem] shadow-sm group-hover:scale-[1.01] transition-transform duration-700">
                        
                        <!-- Zoom/Download Overlay -->
                        <div class="mt-8 flex justify-center">
                            <a :href="getStorageUrl(informasi.file)" target="_blank" class="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-800 transition-colors">
                                <i class="fas fa-search-plus text-lg"></i> Lihat Gambar Ukuran Penuh
                            </a>
                        </div>
                    </div>
                </div>
                <div v-else class="bg-gray-50 rounded-[3rem] p-16 md:p-24 text-center border-2 border-dashed border-gray-200">
                    <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <i class="fas fa-sitemap text-gray-300 text-4xl"></i>
                    </div>
                    <h3 class="text-2xl font-black text-gray-900 mb-4">Struktur Belum Tersedia</h3>
                    <p class="text-gray-500 max-w-sm mx-auto leading-relaxed">Saat ini belum ada gambar struktur organisasi yang diunggah untuk unit kerja ini.</p>
                    
                    <div v-if="authStore.user && (authStore.user.role === 'superadmin' || authStore.user.unit_id == organization.remote_id)" class="mt-10">
                        <a :href="`http://ppidkab.sinjaikab.go.id/profil/tentang-opd/${organization.id}/manage`" target="_blank" class="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100">
                            <i class="fas fa-upload"></i> Unggah Struktur Sekarang
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Footer Info -->
            <div class="bg-gray-50/50 p-8 border-t border-gray-100 text-center">
                <p class="text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <i class="fas fa-info-circle mr-2 text-blue-400"></i> Sumber Data: PPID Kabupaten Sinjai <span v-if="organization.updated_at">- Terakhir Diperbarui: {{ formatDate(organization.updated_at) }}</span>
                </p>
            </div>
        </div>
        
        <div class="mt-12 text-center">
            <router-link to="/profil/tentang-opd" class="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors">
                <i class="fas fa-arrow-left"></i> Kembali ke Daftar OPD
            </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import api, { getStorageUrl } from '@/services/api'
import { useGlobalLoader } from '@/composables/useGlobalLoader'
import { useAuthStore } from '@/stores/auth'
import Breadcrumbs from '@/components/Breadcrumbs.vue'

const route = useRoute()
const authStore = useAuthStore()
const organization = ref(null)
const informasi = ref(null)

const { isLoading: queryLoading, data: queryData, isFetching, isError: error } = useQuery({
  queryKey: computed(() => ['opd_detail', route.params.slug]),
  queryFn: async () => {
    const slug = route.params.slug
    const res = await api.get(`/profil/tentang-opd/${slug}`)
    return res.data
  },
  staleTime: 60000,
  enabled: computed(() => !!route.params.slug)
})

const loading = computed(() => queryLoading.value || (isFetching.value && !queryData.value))
useGlobalLoader(loading)

watch(queryData, (newData) => {
  if (newData && newData.organization) {
    organization.value = newData.organization
    informasi.value = newData.informasi
  }
}, { immediate: true })

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}
</script>
