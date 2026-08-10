<template>
  <div class="py-8 md:py-12 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Breadcrumbs -->
      <Breadcrumbs :breadcrumbs="[
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Unit Lokal', url: '', icon: 'fas fa-map-marked-alt' }
      ]" />

      <!-- Header Section -->
      <div class="mb-16 text-center mt-8">
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Profil Pimpinan Unit Lokal</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Daftar Kepala Desa dan Kelurahan yang bertugas di seluruh wilayah Kabupaten Sinjai.</p>
      </div>

      <div v-if="!loading && Object.keys(groupedData).length === 0" class="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <i class="fas fa-map-marked-alt text-3xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">Belum Ada Data</h3>
        <p class="text-gray-500">Data unit lokal untuk kecamatan dan desa/kelurahan belum tersedia.</p>
      </div>

      <div v-else-if="!loading" class="space-y-16">
        <section v-for="(group, kecName) in groupedData" :key="kecName" class="relative">
          <!-- Kecamatan Header (Sticky) -->
          <div class="sticky top-20 z-20 mb-10">
            <div class="bg-white/80 backdrop-blur-md border border-gray-100 inline-flex items-center px-8 py-4 rounded-3xl shadow-xl">
              <div class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mr-5 shadow-lg shadow-indigo-200">
                <i class="fas fa-landmark text-xl"></i>
              </div>
              <div>
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-1">Wilayah</span>
                <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tight">Kecamatan {{ kecName }}</h2>
              </div>
              <div class="ml-8 pl-8 border-l border-gray-100 hidden md:block">
                <span class="bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-xs font-black uppercase">
                  {{ group.officials.length }} Pimpinan
                </span>
              </div>
            </div>
          </div>

          <!-- Officials Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <div v-for="official in group.officials" :key="official.id" class="group h-full bg-white rounded-[2.5rem] shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 relative">
              <!-- Decorative background -->
              <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-50 to-white opacity-50"></div>
              
              <div class="p-8 pb-8 flex flex-col items-center text-center flex-grow relative z-10">
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-indigo-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  <img v-if="official.photo"
                       :src="getStorageUrl(official.photo)"
                       :alt="official.full_name"
                       class="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105" />
                  <div v-else class="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-white shadow-2xl flex items-center justify-center text-gray-300 text-4xl md:text-5xl relative z-10">
                    <i class="fas fa-user"></i>
                  </div>
                  
                  <!-- Gender Badge -->
                  <div class="absolute bottom-1 right-1 z-20">
                    <span class="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg border border-gray-50 text-xs">
                      <i v-if="official.jenis_kelamin === 'Laki-laki'" class="fas fa-mars text-blue-500"></i>
                      <i v-else class="fas fa-venus text-pink-500"></i>
                    </span>
                  </div>
                </div>

                <div class="min-h-[4rem] flex items-center justify-center mb-2">
                  <router-link :to="`/profil/${official.slug}`" class="text-xl md:text-2xl font-black text-gray-900 hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                    {{ official.full_name }}
                  </router-link>
                </div>
                
                <div class="mb-4 min-h-[2.5rem] flex items-start justify-center">
                  <span class="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                    {{ renderJabatan(official) }}
                  </span>
                </div>

                <!-- Bottom Section pushed to bottom -->
                <div class="mt-auto w-full">
                  <div class="flex items-center justify-center text-gray-500 font-bold text-sm mb-6 bg-gray-50 px-5 py-2 rounded-2xl border border-gray-100 w-full">
                    <i class="fas fa-map-marker-alt mr-2 text-indigo-400"></i>
                    <span class="truncate">{{ official.organization?.name || 'N/A' }}</span>
                  </div>

                  <div class="space-y-3 w-full">
                    <router-link :to="`/profil/${official.slug}`" class="inline-flex items-center justify-center w-full bg-indigo-600 text-white font-black text-xs py-4 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2 shadow-lg shadow-indigo-100">
                      Profil Lengkap <i class="fas fa-arrow-right text-sm"></i>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import api, { getStorageUrl } from '@/services/api'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const groupedData = ref({})

const { isLoading: queryLoading, data: queryData, isFetching } = useQuery({
  queryKey: ['unit_lokal'],
  queryFn: async () => {
    const res = await api.get('/profil/unit-lokal')
    return res.data
  },
  staleTime: 60000,
  refetchOnWindowFocus: true
})

const loading = computed(() => queryLoading.value || (isFetching.value && !queryData.value))
useGlobalLoader(loading)

watch(queryData, (newData) => {
  if (newData && newData.groupedData) {
    groupedData.value = newData.groupedData
  }
}, { immediate: true })

const renderJabatan = (official) => {
  const orgName = official.organization?.name || ''
  const isDesa = orgName.toLowerCase().includes('desa')
  let jabatan = isDesa ? 'Kepala Desa' : 'Lurah'
  
  if (official.status_jabatan && official.status_jabatan !== 'Definitif') {
    const match = official.status_jabatan.match(/\((\w+)\)/)
    let prefix = match ? match[1] : official.status_jabatan
    prefix = prefix.replace(/\.$/, '')
    jabatan = `${prefix.trim()}. ${jabatan}`
  }
  
  return jabatan
}
</script>
