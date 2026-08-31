<template>
  <div class="py-8 md:py-12 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.pejabatDaerah()" />

      <!-- Header Section -->
      <div class="mb-16 text-center mt-8">
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Daftar Pejabat Daerah</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Profil pimpinan tinggi pratama (Eselon II) dan pimpinan administrator (Eselon III) di lingkungan Pemerintah Kabupaten Sinjai.</p>
      </div>

      <div v-if="!loading && (eselon2.length === 0 && eselon3.length === 0)" class="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <i class="fas fa-users-slash text-3xl"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800">Tidak Ditemukan</h3>
        <p class="text-gray-500">Data pimpinan daerah belum tersedia atau sedang dalam proses pembaruan.</p>
      </div>

      <div v-else-if="!loading" class="space-y-24">
        <template v-for="group in groups" :key="group.id">
          <section v-if="group.items.length > 0" class="relative">
            <!-- Category Header (Sticky) -->
            <div class="sticky top-20 z-20 mb-10">
              <div class="bg-white/80 backdrop-blur-md border border-gray-100 inline-flex items-center px-8 py-4 rounded-3xl shadow-xl">
                <div :class="`w-12 h-12 ${group.iconBg} rounded-2xl flex items-center justify-center text-white mr-5 shadow-lg ${group.iconShadow}`">
                  <i :class="`${group.icon} text-xl`"></i>
                </div>
                <div>
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-1">{{ group.title }}</span>
                  <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tight">{{ group.subtitle }}</h2>
                </div>
                <div class="ml-8 pl-8 border-l border-gray-100 hidden md:block">
                  <span :class="`${group.badgeBg} ${group.badgeText} px-4 py-1 rounded-full text-xs font-black uppercase`">
                    {{ group.items.length }} Pejabat
                  </span>
                </div>
              </div>
            </div>

            <!-- Officials Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              <div v-for="official in group.items" :key="official.id" class="group h-full bg-white rounded-[2.5rem] shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 relative">
                <!-- Decorative background -->
                <div :class="`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${group.gradientFrom} to-white opacity-50`"></div>
                
                <div class="p-8 pb-8 flex flex-col items-center text-center flex-grow relative z-10">
                  <div class="relative mb-6">
                    <div :class="`absolute inset-0 ${group.blurBg} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`"></div>
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
                    <NuxtLink :to="`/profil/${official.slug}`" :class="`text-xl md:text-2xl font-black text-gray-900 ${group.hoverText} transition-colors leading-tight line-clamp-2`">
                      {{ official.full_name }}
                    </NuxtLink>
                  </div>
                  
                  <div class="mb-6 min-h-[3rem] flex items-start justify-center">
                    <span :class="`px-4 py-1.5 ${group.badgeBg} ${group.badgeText} text-[10px] font-black uppercase tracking-widest rounded-full border ${group.badgeBorder} text-center`">
                      {{ renderJabatan(official) }}
                    </span>
                  </div>

                  <!-- Bottom Section pushed to bottom -->
                  <div class="mt-auto w-full">
                    <div class="flex items-center justify-center text-gray-500 font-bold text-sm mb-6 bg-gray-50 px-5 py-2 rounded-2xl border border-gray-100 w-full">
                      <i :class="`fas fa-landmark mr-2 flex-shrink-0 ${group.iconColor}`"></i>
                      <span class="truncate">{{ official.organization?.name || 'N/A' }}</span>
                    </div>

                    <div class="space-y-3 w-full">
                      <template v-if="authStore.user && authStore.user.unit_id == official.organization?.remote_id">
                        <NuxtLink :to="`/profil/pimpinan/${official.slug}/edit`" class="inline-flex items-center justify-center w-full bg-amber-500 text-white font-black text-xs py-4 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2 shadow-lg shadow-amber-100 hover:bg-amber-600">
                          <i class="fas fa-edit text-sm"></i>
                          Edit Pejabat
                        </NuxtLink>
                      </template>
                      <NuxtLink :to="`/profil/${official.slug}`" :class="`inline-flex items-center justify-center w-full ${group.btnBg} text-white font-black text-xs py-4 rounded-2xl transition-all duration-500 uppercase tracking-widest gap-2 shadow-lg ${group.btnShadow}`">
                        Profil Lengkap <i class="fas fa-arrow-right text-sm"></i>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>
        


      </div>

    </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import api, { getStorageUrl } from '@/services/api'
import { useGlobalLoader } from '@/composables/useGlobalLoader'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const eselon2 = ref([])
const eselon3 = ref([])
const totalUnassigned = ref(0)

const { isLoading: queryLoading, data: queryData, isFetching, isError, refetch } = useQuery({
  queryKey: ['pejabat_daerah'],
  queryFn: async () => {
    const res = await api.get('/profil/pejabat-daerah')
    return res.data
  },
  staleTime: 60000
})


const loading = computed(() => queryLoading.value || (isFetching.value && !queryData.value))
useGlobalLoader(loading)

watch(queryData, (newData) => {
  if (newData && newData.kepalaOpds) {
    eselon2.value = newData.kepalaOpds.eselon2 || []
    eselon3.value = newData.kepalaOpds.eselon3 || []
  }
}, { immediate: true })


const groups = computed(() => [
  { 
    id: 'eselon2', title: 'Eselon II', subtitle: 'Kepala Badan / Dinas / Inspektorat', items: eselon2.value,
    icon: 'fas fa-building',
    iconBg: 'bg-blue-600',
    iconShadow: 'shadow-blue-200',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-100',
    gradientFrom: 'from-blue-50',
    blurBg: 'bg-blue-600',
    hoverText: 'hover:text-blue-600',
    iconColor: 'text-blue-400',
    btnBg: 'bg-blue-600',
    btnShadow: 'shadow-blue-100'
  },
  { 
    id: 'eselon3', title: 'Eselon III', subtitle: 'Camat (Pimpinan Wilayah)', items: eselon3.value,
    icon: 'fas fa-map-marked-alt',
    iconBg: 'bg-green-600',
    iconShadow: 'shadow-green-200',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-700',
    badgeBorder: 'border-green-100',
    gradientFrom: 'from-green-50',
    blurBg: 'bg-green-600',
    hoverText: 'hover:text-green-600',
    iconColor: 'text-green-400',
    btnBg: 'bg-green-600',
    btnShadow: 'shadow-green-100'
  }
])

const renderJabatan = (official) => {
  let jabatan_asli = official.position?.name || ''
  let jabatan_tampilan = jabatan_asli
  let status_jabatan = official.status_jabatan || ''

  if (jabatan_asli.toLowerCase() === 'kepala opd' && official.organization) {
    const orgName = official.organization.name
    const orgNameLower = orgName.toLowerCase()

    if (orgNameLower.includes('dinas')) {
      const cleanedOrgName = orgName.replace(/dinas /i, '')
      jabatan_tampilan = 'Kepala Dinas ' + cleanedOrgName
    } else if (orgNameLower.includes('kecamatan')) {
      const cleanedOrgName = orgName.replace(/kantor kecamatan /i, '')
      jabatan_tampilan = 'Camat ' + cleanedOrgName
    } else if (orgNameLower.includes('badan')) {
      const cleanedOrgName = orgName.replace(/badan /i, '')
      jabatan_tampilan = 'Kepala Badan ' + cleanedOrgName
    } else if (orgNameLower.includes('inspektorat')) {
      jabatan_tampilan = 'Kepala ' + orgName + ' Kabupaten Sinjai'
    } else if (orgNameLower.includes('satuan polisi pamong praja dan pemadam kebakaran')) {
      jabatan_tampilan = 'Kepala ' + orgName
    } else if (orgNameLower.includes('rumah sakit umum daerah') || orgNameLower.includes('rsud')) {
      let cleanedOrgName = orgNameLower.replace(/pejabat |kabupaten sinjai/gi, '')
      cleanedOrgName = cleanedOrgName.replace(/\b\w/g, l => l.toUpperCase()) // ucwords
      jabatan_tampilan = 'Direktur ' + cleanedOrgName.trim() + ' Sinjai'
    } else if (orgNameLower.includes('sekretariat dprd')) {
      jabatan_tampilan = 'Sekretaris DPRD (Sekwan) Kabupaten Sinjai'
    }
  }

  if (status_jabatan !== 'Definitif' && status_jabatan !== '') {
    const match = status_jabatan.match(/\((\w+)\)/)
    let prefix = match ? match[1] : status_jabatan
    prefix = prefix.replace(/\.$/, '')
    jabatan_tampilan = `${prefix.trim()}. ${jabatan_tampilan}`
  }

  return jabatan_tampilan
}
</script>

