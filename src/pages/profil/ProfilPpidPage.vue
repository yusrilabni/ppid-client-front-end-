<template>
  <div class="profil-ppid-page min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Breadcrumbs -->
      <div class="mb-4">
        <Breadcrumbs :breadcrumbs="breadcrumbItems" />
      </div>

      <div v-if="!loading && profile" class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        <!-- Hero Section -->
        <div class="relative bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-700 text-white p-8 md:p-12 overflow-hidden">
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div class="relative z-10">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">Profil PPID</h1>
            <p class="text-lg md:text-xl lg:text-2xl font-light opacity-90 max-w-2xl">
              Pejabat Pengelola Informasi dan Dokumentasi
            </p>
          </div>
        </div>

        <!-- Visi Section -->
        <div class="p-8 md:p-12">
          <div class="flex items-center mb-6">
            <div class="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <i class="fas fa-eye text-2xl text-white"></i>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-gray-800">Visi</h2>
              <div class="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mt-2"></div>
            </div>
          </div>
          <div class="md:ml-18">
            <p class="text-gray-700 leading-relaxed text-lg bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
              {{ profile.vision }}
            </p>
          </div>
        </div>

        <!-- Misi Section -->
        <div v-if="profile.mission && profile.mission.length > 0" class="p-8 md:p-12 border-t border-gray-100">
          <div class="flex items-center mb-6">
            <div class="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <i class="fas fa-bullseye text-2xl text-white"></i>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-gray-800">Misi</h2>
              <div class="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mt-2"></div>
            </div>
          </div>
          <div class="md:ml-18">
            <ul class="space-y-4">
              <li v-for="(mission, index) in profile.mission" :key="index" class="flex items-start p-4 bg-green-50 rounded-xl border-l-4 border-green-500 shadow-sm transition-transform hover:-translate-y-1">
                <div class="flex-shrink-0 mr-4">
                  <div class="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-md">
                    <span class="text-white font-bold text-sm">{{ index + 1 }}</span>
                  </div>
                </div>
                <span class="text-gray-700 text-lg pt-1">{{ mission }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Struktur Organisasi Section -->
        <div class="p-8 md:p-12 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50">
          <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4">
              <i class="fas fa-sitemap text-2xl text-white"></i>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-3">Struktur Organisasi PPID</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">Diagram organisasi Pejabat Pengelola Informasi dan Dokumentasi</p>
          </div>
          
          <div v-if="profile.structure_image" class="flex justify-center">
            <div class="relative group max-w-4xl w-full">
              <div class="absolute -inset-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <img :src="profile.structure_image" alt="Struktur Organisasi PPID" class="relative w-full h-auto rounded-xl shadow-2xl border-4 border-white transform transition-transform duration-500 group-hover:scale-[1.02]" />
            </div>
          </div>
          <div v-else class="max-w-4xl mx-auto">
             <div class="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 border-2 border-dashed border-blue-300 text-center py-12">
               <i class="fas fa-project-diagram text-4xl text-blue-400 mb-4"></i>
               <h3 class="text-2xl font-bold text-gray-700 mb-2">Struktur Organisasi</h3>
               <p class="text-gray-500">Gambar struktur organisasi belum diunggah.</p>
             </div>
          </div>
        </div>

        <!-- Hubungi Kami Section -->
        <div class="p-8 md:p-12 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
          <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4">
              <i class="fas fa-address-book text-2xl text-white"></i>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-3">Hubungi Kami</h2>
            <p class="text-gray-600">Terhubung dengan PPID untuk informasi lebih lanjut</p>
          </div>

          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Kontak Detail -->
            <div class="lg:w-1/2 bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 flex flex-col">
               <h3 class="text-2xl font-bold text-gray-800 mb-8 border-b pb-4 flex items-center">
                 <i class="fas fa-info-circle text-blue-500 mr-3"></i> Detail Kontak
               </h3>
               
               <div class="space-y-6 flex-grow">
                 <div class="flex items-start">
                   <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white flex items-center justify-center flex-shrink-0 mr-4 shadow-md">
                     <i class="fas fa-map-marker-alt"></i>
                   </div>
                   <div>
                     <h4 class="font-semibold text-gray-800 mb-1">Alamat</h4>
                     <p class="text-gray-600 leading-relaxed">{{ profile.address }}</p>
                   </div>
                 </div>

                 <div class="flex items-start">
                   <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 text-white flex items-center justify-center flex-shrink-0 mr-4 shadow-md">
                     <i class="fas fa-phone"></i>
                   </div>
                   <div>
                     <h4 class="font-semibold text-gray-800 mb-1">Telepon</h4>
                     <p class="text-gray-600 font-medium">{{ profile.phone }}</p>
                   </div>
                 </div>

                 <div class="flex items-start">
                   <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 text-white flex items-center justify-center flex-shrink-0 mr-4 shadow-md">
                     <i class="fas fa-envelope"></i>
                   </div>
                   <div>
                     <h4 class="font-semibold text-gray-800 mb-1">Email</h4>
                     <a :href="`mailto:${profile.email}`" class="text-blue-600 hover:text-blue-800 font-medium transition-colors">{{ profile.email }}</a>
                   </div>
                 </div>
               </div>
            </div>

            <!-- Maps -->
            <div class="lg:w-1/2 flex flex-col">
               <div class="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100 flex-grow flex flex-col">
                 <h3 class="text-2xl font-bold text-gray-800 mb-8 border-b pb-4 flex items-center">
                   <i class="fas fa-map-marked-alt text-amber-500 mr-3"></i> Lokasi
                 </h3>
                 <div v-if="profile.maps_url" class="flex-grow relative overflow-hidden rounded-xl border border-gray-200 min-h-[300px]">
                    <iframe :src="profile.maps_url" class="absolute top-0 left-0 w-full h-full" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-12 text-center border-2 border-dashed border-blue-200 mt-8">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-300 to-blue-300 rounded-full mb-8 shadow-lg">
            <i class="fas fa-exclamation-circle text-4xl text-white"></i>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Profil PPID Tidak Ditemukan</h2>
        <p class="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Tidak ada profil PPID aktif yang dapat ditampilkan saat ini.
        </p>
        <router-link to="/" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <i class="fas fa-home mr-3"></i>
            Kembali ke Beranda
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const breadcrumbItems = [
  { title: 'Beranda', url: '/', icon: 'fas fa-home' },
  { title: 'Profil PPID', url: '', icon: 'fas fa-info-circle' }
]

const { data, isLoading: queryLoading, isFetching, error } = useQuery({
  queryKey: ['profil_ppid'],
  queryFn: async () => {
    const response = await api.get('/profil')
    return response.data
  },
  staleTime: 60000,
  refetchOnWindowFocus: true,
})

const loading = computed(() => queryLoading.value || (isFetching.value && !data.value))
useGlobalLoader(loading)

const profile = computed(() => data.value?.data)
</script>
