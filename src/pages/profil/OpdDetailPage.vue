<template>
  <div class="py-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Breadcrumbs -->
      <div class="mb-4 flex items-center text-sm text-gray-600 flex-wrap">
        <router-link to="/" class="hover:text-blue-600 flex items-center">
          <i class="fas fa-home h-4 w-4 mr-1"></i> Beranda
        </router-link>
        <span class="mx-2">/</span>
        <router-link to="/profil/tentang-opd" class="hover:text-blue-600 flex items-center">
          <i class="fas fa-building h-4 w-4 mr-1"></i> Tentang OPD
        </router-link>
        <span class="mx-2">/</span>
        <span v-if="organization" class="text-gray-900 font-medium flex items-center">
          <i class="fas fa-info-circle h-4 w-4 mr-1"></i> {{ organization.name ? organization.name.substring(0, 25) : '' }}
        </span>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error || !organization" class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <i class="fas fa-building h-24 w-24 text-gray-300 mb-4 text-6xl"></i>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">OPD Tidak Ditemukan</h1>
        <p class="text-gray-600 mb-6">Maaf, data OPD yang Anda cari tidak tersedia.</p>
        <router-link to="/profil/tentang-opd" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Kembali ke Daftar OPD
        </router-link>
      </div>

      <div v-else class="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Tentang OPD {{ organization.name }}
        </h1>

        <div v-if="informasi && informasi.file" class="flex justify-center">
          <img 
            :src="getStorageUrl(informasi.file)" 
            :alt="`Tentang OPD ${organization.name}`" 
            class="rounded-lg shadow-md max-w-full h-auto"
          />
        </div>
        <div v-else class="text-center py-12">
          <div class="flex flex-col items-center">
            <i class="fas fa-image text-gray-400 text-5xl mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Tentang OPD Tidak Ditemukan</h3>
            <p class="text-gray-500">Belum ada gambar tentang OPD yang diunggah untuk OPD ini.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api, { getStorageUrl } from '@/services/api'

const route = useRoute()
const organization = ref(null)
const informasi = ref(null)
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const slug = route.params.slug
    const res = await api.get(`/profil/tentang-opd/${slug}`)
    if (res.data && res.data.organization) {
      organization.value = res.data.organization
      informasi.value = res.data.informasi
    }
  } catch (err) {
    console.error('Error fetching OPD detail:', err)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
