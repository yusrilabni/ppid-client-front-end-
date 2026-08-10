<template>
  <div class="py-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Breadcrumbs -->
      <div class="mb-4 flex items-center text-sm text-gray-600">
        <router-link to="/" class="hover:text-blue-600 flex items-center">
          <i class="fas fa-home h-4 w-4 mr-1"></i> Beranda
        </router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-900 font-medium flex items-center">
          <i class="fas fa-building h-4 w-4 mr-1"></i> DIP OPD
        </span>
      </div>

      <div class="mb-10 text-center">
        <h1 class="text-3xl font-extrabold text-gray-900 md:text-4xl mb-4">Daftar Informasi Publik (DIP) Per OPD</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Pilih Organisasi Perangkat Daerah (OPD) untuk melihat Daftar Informasi Publik yang telah mereka sediakan.
        </p>
      </div>

      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <template v-if="organizations.length > 0">
          <div v-for="org in organizations" :key="org.id" class="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full border border-gray-100 hover:border-blue-100 transform hover:-translate-y-2">
            <div class="p-8 flex-grow flex flex-col">
              <div class="flex items-center justify-center mb-6">
                <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <i class="fas fa-building text-blue-600 text-3xl group-hover:text-white transition-colors duration-300"></i>
                </div>
              </div>
              
              <h2 class="text-xl font-bold text-gray-800 mb-3 text-center leading-tight">
                {{ org.name }}
              </h2>
              
              <div class="flex items-start text-gray-500 mb-6 text-center justify-center text-sm">
                <i class="fas fa-map-marker-alt text-blue-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <p class="flex-grow line-clamp-2" v-html="org.api_address || 'Alamat belum ditambahkan.'"></p>
              </div>
              
              <div class="mt-auto space-y-3">
                <router-link :to="`/profil/organisasi/${org.slug}`" class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 w-full shadow-lg shadow-blue-100 hover:shadow-blue-200">
                  <i class="fas fa-book-open mr-2"></i> Lihat DIP OPD
                </router-link>
                
                <a v-if="org.website_url" :href="org.website_url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 w-full border border-gray-100">
                  <i class="fas fa-globe mr-2 text-blue-500"></i> Website Resmi
                </a>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
            <div class="flex flex-col items-center">
              <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-search text-gray-300 text-4xl"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Belum ada OPD yang berpartisipasi</h3>
              <p class="text-gray-500">Saat ini belum ada data organisasi yang mengunggah informasi publik.</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const organizations = ref([])

const { isLoading: queryLoading, data: queryData, isFetching } = useQuery({
  queryKey: ['tentang_opd'],
  queryFn: async () => {
    const res = await api.get('/profil/tentang-opd')
    return res.data
  },
  staleTime: 60000,
  refetchOnWindowFocus: true
})

const loading = computed(() => queryLoading.value || (isFetching.value && !queryData.value))
useGlobalLoader(loading)

watch(queryData, (newData) => {
  if (newData && newData.organizations) {
    organizations.value = newData.organizations
  }
}, { immediate: true })
</script>
