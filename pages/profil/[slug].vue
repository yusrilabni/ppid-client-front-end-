<template>
  <div class="py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
    <!-- max-w-6xl for normal, max-w-4xl for not found, wait, just use 6xl and inner constraints -->
    <div :class="['mx-auto px-4 sm:px-6 lg:px-8', (error || !official && !loading) ? 'max-w-4xl' : 'max-w-6xl']">
      
      <!-- Breadcrumbs -->
      <div class="mb-4">
        <Breadcrumbs :breadcrumbs="breadcrumbData" />
      </div>

      <template v-if="!loading">
        <!-- Error / Not Found State (Matches Blade) -->
        <div v-if="error || !official" class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="p-12 text-center">
            <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <i class="fas fa-user-slash text-4xl text-gray-400"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Profil Tidak Ditemukan</h1>
            <p class="text-gray-600 mb-6">
              Belum ada pejabat aktif untuk posisi ini.
            </p>
            <NuxtLink to="/profil/pejabat-daerah" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition">
              Kembali ke Profil
            </NuxtLink>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <!-- Header Section -->
          <div class="p-8">
          <div class="flex flex-col items-center gap-8">
            <div class="w-full flex justify-center">
              <img v-if="official.photo"
                   :src="getStorageUrl(official.photo)" 
                   :alt="official.full_name"
                   class="w-64 h-80 object-contain max-w-full max-h-[320px] rounded-xl shadow-md bg-gray-50" />
              <div v-else class="w-64 h-80 bg-gray-200 flex items-center justify-center rounded-xl shadow-inner">
                <i class="fas fa-user text-gray-400 text-[6rem]"></i>
              </div>
            </div>
            <div class="text-center">
              <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{{ official.full_name }}</h1>
              <p class="text-xl md:text-2xl font-semibold text-gray-600 mb-3">{{ jabatanTampilan }}</p>
              <p v-if="official.organization" class="text-gray-500 italic">{{ official.organization.name }}</p>
            </div>
          </div>
        </div>

        <div class="p-8 text-gray-800">
          
          <!-- Personal Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div v-if="official.birth_place || official.birth_date" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-birthday-cake text-blue-500 mr-3 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-700">Lahir</p>
                  <p class="text-gray-600">
                    {{ official.birth_place }}{{ official.birth_place && official.birth_date ? ', ' : '' }}{{ formatDate(official.birth_date) }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="official.religion" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-pray text-blue-500 mr-3 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-700">Agama</p>
                  <p class="text-gray-600">{{ official.religion }}</p>
                </div>
              </div>
            </div>

            <div v-if="official.marital_status" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-heart text-blue-500 mr-3 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-700">Status</p>
                  <p class="text-gray-600">{{ official.marital_status }}</p>
                </div>
              </div>
            </div>

            <div v-if="official.nip" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-id-card text-blue-500 mr-3 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-700">NIP</p>
                  <p class="text-gray-600">{{ official.nip }}</p>
                </div>
              </div>
            </div>

            <div v-if="official.start_term" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-calendar-alt text-blue-500 mr-3 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-700">Mulai Jabatan</p>
                  <p class="text-gray-600">{{ formatDate(official.start_term) }}</p>
                </div>
              </div>
            </div>

            <div v-if="official.end_term" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-calendar-times text-blue-500 mr-3 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-700">Akhir Jabatan</p>
                  <p class="text-gray-600">{{ formatDate(official.end_term) }}</p>
                </div>
              </div>
            </div>

            <div v-if="official.email" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <i class="fas fa-envelope text-blue-500 mr-3 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-700">Email</p>
                  <p class="text-gray-600">{{ official.email }}</p>
                </div>
              </div>
            </div>

            <div v-if="official.home_address" class="bg-gray-50 p-4 rounded-lg lg:col-span-2">
              <div class="flex items-start">
                <i class="fas fa-home text-blue-500 mr-3 mt-1 text-lg"></i>
                <div>
                  <p class="font-medium text-gray-700">Alamat</p>
                  <p class="text-gray-600 whitespace-pre-line">{{ official.home_address }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Biography -->
          <div v-if="official.biography" class="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-book text-blue-500 mr-3"></i>
              Biodata
            </h2>
            <div class="text-gray-600 leading-relaxed whitespace-pre-line" v-html="official.biography"></div>
          </div>

          <!-- Family -->
          <div v-if="official.spouse_name || (official.children && official.children.length > 0)" class="mb-10">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <i class="fas fa-users text-blue-500 mr-3"></i>
              Keluarga
            </h2>
            <div class="grid grid-cols-1 gap-6">
              <div v-if="official.spouse_name" class="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all group">
                <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <i class="fas fa-heart text-xl"></i>
                </div>
                <div>
                  <h3 class="text-xs font-bold text-gray-400 mb-1">{{ spouseLabel }}</h3>
                  <p class="text-xl font-black text-gray-800">{{ official.spouse_name }}</p>
                </div>
              </div>

              <div v-if="official.children && official.children.length > 0" class="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                  <i class="fas fa-child text-blue-400"></i> Daftar Anak ({{ official.children.length }})
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="(child, index) in official.children" :key="child.id" class="bg-white p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                    <div class="flex items-center gap-3">
                      <span class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {{ index + 1 }}
                      </span>
                      <p class="font-bold text-gray-800">{{ child.name }}</p>
                    </div>
                    <p v-if="child.birth_place || child.birth_date" class="text-[10px] text-gray-400 mt-2 ml-11 font-medium italic">
                      Lahir: {{ child.birth_place || '-' }}, {{ child.birth_date ? formatDate(child.birth_date) : '-' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Education History -->
          <div v-if="official.educations && official.educations.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-graduation-cap text-blue-500 mr-3"></i>
              Pendidikan
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="edu in official.educations" :key="edu.id" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 class="font-bold text-gray-800 mb-2">{{ edu.degree }}</h3>
                <p v-if="edu.institution" class="text-gray-700 mb-1"><span class="font-medium">Institusi:</span> {{ edu.institution }}</p>
                <p v-if="edu.start_year || edu.end_year" class="text-gray-700">
                  <span class="font-medium">Tahun:</span> {{ edu.start_year || '' }} {{ edu.start_year && edu.end_year ? '-' : '' }} {{ edu.end_year || 'Sekarang' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Career History -->
          <div v-if="official.career_histories && official.career_histories.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-briefcase text-blue-500 mr-3"></i>
              Riwayat Karir
            </h2>
            <div class="space-y-4">
              <div v-for="career in official.career_histories" :key="career.id" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 class="font-bold text-gray-800 text-lg mb-2">{{ career.title }}</h3>
                <p v-if="career.organization_name" class="text-gray-700 mb-1"><span class="font-medium">Organisasi:</span> {{ career.organization_name }}</p>
                <p v-if="career.start_year || career.end_year" class="text-gray-700 mb-1">
                  <span class="font-medium">Tahun:</span> {{ career.start_year || '' }} {{ career.start_year && career.end_year ? '-' : '' }} {{ career.end_year || 'Sekarang' }}
                </p>
                <p v-if="career.description" class="text-gray-600"><span class="font-medium">Deskripsi:</span> {{ career.description }}</p>
              </div>
            </div>
          </div>

          <!-- Awards -->
          <div v-if="official.awards && official.awards.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-trophy text-blue-500 mr-3"></i>
              Penghargaan
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="award in official.awards" :key="award.id" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 class="font-bold text-gray-800 text-lg mb-2">{{ award.title }}</h3>
                <p v-if="award.issuer" class="text-gray-700 mb-1"><span class="font-medium">Pemberi:</span> {{ award.issuer }}</p>
                <p v-if="award.year" class="text-gray-700 mb-1"><span class="font-medium">Tahun:</span> {{ award.year }}</p>
                <p v-if="award.description" class="text-gray-600"><span class="font-medium">Deskripsi:</span> {{ award.description }}</p>
              </div>
            </div>
          </div>

          <!-- Training History -->
          <div v-if="official.training_histories && official.training_histories.length > 0" class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-chalkboard-teacher text-blue-500 mr-3"></i>
              Diklat
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="training in official.training_histories" :key="training.id" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 class="font-bold text-gray-800 mb-2">{{ training.name }}</h3>
                <p v-if="training.organizer" class="text-gray-700 mb-1"><span class="font-medium">Penyelenggara:</span> {{ training.organizer }}</p>
                <p v-if="training.year" class="text-gray-700"><span class="font-medium">Tahun:</span> {{ training.year }}</p>
              </div>
            </div>
          </div>

          <!-- Organizational History -->
          <div v-if="official.organizational_histories && official.organizational_histories.length > 0">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-sitemap text-blue-500 mr-3"></i>
              Organisasi
            </h2>
            <div class="space-y-4">
              <div v-for="org in official.organizational_histories" :key="org.id" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 class="font-bold text-gray-800 text-lg mb-2">{{ org.organization_name }}</h3>
                <p v-if="org.position" class="text-gray-700 mb-1"><span class="font-medium">Jabatan:</span> {{ org.position }}</p>
                <p v-if="org.start_year || org.end_year" class="text-gray-700">
                  <span class="font-medium">Tahun:</span> {{ org.start_year || '' }} {{ org.start_year && org.end_year ? '-' : '' }} {{ org.end_year || 'Sekarang' }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, computed, watch } from 'vue'

import { useQuery } from '@tanstack/vue-query'
import api, { getStorageUrl } from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

const route = useRoute()
const official = ref(null)

const { isLoading: queryLoading, data: queryData, isError: queryError, isFetching, refetch } = useQuery({
  queryKey: computed(() => ['official_profile', route.params.slug]),
  queryFn: async () => {
    const slug = route.params.slug
    if (!slug) throw new Error("Slug not found")
    const res = await api.get(`/profil/${slug}`)
    return res.data.official || res.data.data
  },
  staleTime: 60000,
  enabled: computed(() => !!route.params.slug)
})

const loading = computed(() => queryLoading.value || (isFetching.value && !queryData.value))
const error = computed(() => queryError.value)
useGlobalLoader(loading)

watch(queryData, (newData) => {
  if (newData) {
    official.value = newData
  } else {
    official.value = null
  }
}, { immediate: true })

const breadcrumbData = computed(() => {
  const slug = route.params.slug || ''
  let title = ''
  
  if (official.value) {
    title = official.value.full_name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  } else {
    title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
  
  if (error.value || !official.value) {
    return getBreadcrumbs.officialProfile(official.value?.name)
  }

  let middleTitle = 'Pejabat Daerah'
  let middleUrl = '/profil/pejabat-daerah'
  let middleIcon = 'fas fa-users'

  const orgName = (official.value.organization?.name || '').toLowerCase()
  const posSlug = (official.value.position?.slug || '').toLowerCase()

  if (orgName.includes('kecamatan') || orgName.includes('desa ') || orgName === 'desa' || orgName.includes('kelurahan')) {
    middleTitle = 'Unit Lokal'
    middleUrl = '/profil/unit-lokal'
    middleIcon = 'fas fa-map-marked-alt'
  } else if (posSlug === 'bupati') {
    middleTitle = 'Bupati'
    middleUrl = '/profil/bupati'
    middleIcon = 'fas fa-user-tie'
  } else if (posSlug === 'wakil-bupati') {
    middleTitle = 'Wakil Bupati'
    middleUrl = '/profil/wakil-bupati'
    middleIcon = 'fas fa-user-tie'
  } else if (posSlug === 'sekretaris-daerah' || posSlug === 'sekda') {
    middleTitle = 'Sekretaris Daerah'
    middleUrl = '/profil/sekretaris-daerah'
    middleIcon = 'fas fa-building'
  }
  
  return getBreadcrumbs.officialProfile(title, middleTitle, middleUrl, middleIcon)
})

const spouseLabel = computed(() => {
  if (!official.value) return 'Suami/Istri'
  return official.value.jenis_kelamin === 'Perempuan' ? 'Nama Suami' : 'Nama Istri'
})

const jabatanTampilan = computed(() => {
  if (!official.value) return ''
  let jabatan_asli = official.value.position?.name || ''
  let jabatan_tampilan = jabatan_asli
  const status_jabatan = official.value.status_jabatan || ''

  if (jabatan_asli.toLowerCase() === 'kepala opd' && official.value.organization) {
    const orgName = official.value.organization.name
    const orgNameLower = orgName.toLowerCase()
    
    if (orgNameLower.includes('dinas')) {
      jabatan_tampilan = 'Kepala ' + orgName
    } else if (orgNameLower.includes('kecamatan')) {
      const nama_kecamatan = orgName.replace(/Kantor Kecamatan /i, '')
      jabatan_tampilan = 'Camat ' + nama_kecamatan
    } else if (orgNameLower.includes('badan')) {
      jabatan_tampilan = 'Kepala ' + orgName
    }
  }

  if (status_jabatan !== 'Definitif' && status_jabatan) {
    const match = status_jabatan.match(/\((\w+)\)/)
    const prefix = match ? match[1] : ''
    if (prefix) {
      jabatan_tampilan = `${prefix.trim()}. ${jabatan_tampilan}`
    }
  }

  return jabatan_tampilan
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

