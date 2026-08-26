<template>
  <div class="py-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.laporanPermohonan()" class="mb-4" />

      <div class="bg-white rounded-2xl shadow-lg border border-gray-100">
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 class="text-xl font-bold text-white flex items-center">
            <i class="fas fa-list-ul mr-3"></i> Daftar Semua Permohonan
          </h2>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <NuxtLink v-if="authStore.isAuthenticated" to="#" class="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-bold rounded-xl bg-yellow-300 text-yellow-900 shadow-md hover:bg-yellow-400 transition-all duration-200">
              <i class="fas fa-user-check mr-2"></i> Permohonan Saya
            </NuxtLink>
            <NuxtLink to="/permohonan-informasi" class="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-bold rounded-xl bg-white text-blue-600 shadow-md hover:bg-gray-100 transition-all duration-200">
              <i class="fas fa-plus-circle mr-2"></i> Buat Permohonan
            </NuxtLink>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="mt-6 p-4 bg-gray-50 border-y border-gray-100">
          <form @submit.prevent="applyFilters" class="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-end">
            <!-- Search Input -->
            <div class="w-full md:flex-1 md:min-w-[250px]">
              <label class="block text-xs font-medium text-gray-600 mb-1">Pencarian</label>
              <div class="border border-gray-300 rounded-2xl bg-white">
                <CustomInput 
                  v-model="filters.search" 
                  placeholder="Cari nama, rincian..." 
                  icon="fas fa-search"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 md:contents gap-3">
              <!-- Date From -->
              <div class="md:flex-1 md:min-w-[130px]">
                <label class="block text-xs font-medium text-gray-600 mb-1">Tgl Awal</label>
                <div class="border border-gray-300 rounded-2xl bg-white">
                  <CustomDate v-model="filters.date_from" />
                </div>
              </div>

              <!-- Date To -->
              <div class="md:flex-1 md:min-w-[130px]">
                <label class="block text-xs font-medium text-gray-600 mb-1">Tgl Akhir</label>
                <div class="border border-gray-300 rounded-2xl bg-white">
                  <CustomDate v-model="filters.date_to" />
                </div>
              </div>

              <!-- Sort -->
              <div class="md:flex-1 md:min-w-[150px]">
                <label for="sort" class="block text-xs font-medium text-gray-600 mb-1">Urutkan</label>
                <div class="border border-gray-300 rounded-2xl bg-white">
                  <CustomSelect
                    v-model="filters.sort"
                    :options="sortOptions"
                    :searchable="false"
                  />
                </div>
              </div>

              <!-- Items Per Page -->
              <div class="md:flex-1 md:min-w-[100px]">
                <label for="per_page" class="block text-xs font-medium text-gray-600 mb-1">Tampilan</label>
                <div class="border border-gray-300 rounded-2xl bg-white">
                  <CustomSelect
                    v-model="filters.per_page"
                    :options="perPageOptions"
                    :searchable="false"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 md:flex gap-2 mb-1">
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-md transition flex items-center justify-center">
                <i class="fas fa-search mr-2"></i> Cari
              </button>
              <button type="button" @click="resetFilters" class="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-1.5 px-4 rounded-md transition flex items-center justify-center">
                <i class="fas fa-eraser mr-2"></i> Reset
              </button>
            </div>
          </form>
        </div>

        <!-- Table Data -->
        <div v-if="isLoading" class="p-12 flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        <template v-else>
          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pemohon</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rincian Informasi</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sifat</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in data?.data || []" :key="item.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ (data?.current_page - 1) * data?.per_page + index + 1 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                    {{ formatName(item) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ truncate(item.detail_informasi, 100) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getStatusClass(item.status_permohonan)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ formatStatus(item.status_permohonan) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span :class="getPrivacyClass(item.privacy_status)" class="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full">
                      <i :class="getPrivacyIcon(item.privacy_status)" class="mr-1"></i> {{ item.privacy_status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div class="flex items-center space-x-3">
                      <NuxtLink :to="`/tracking/${item.unique_code}`" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg transition-colors">
                        <i class="fas fa-eye mr-1"></i> Detail
                      </NuxtLink>
                    </div>
                  </td>
                </tr>
                <tr v-if="!data?.data?.length">
                  <td colspan="6" class="px-6 py-12 text-center text-gray-500">Data tidak ditemukan</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card List -->
          <div class="md:hidden divide-y divide-gray-100">
            <div v-for="(item, index) in data?.data || []" :key="item.id" class="p-4 bg-white hover:bg-gray-50 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center">
                  <span class="text-[10px] font-bold text-blue-600 mr-2">#{{ (data?.current_page - 1) * data?.per_page + index + 1 }}</span>
                  <h3 class="text-sm font-bold text-gray-900">{{ formatName(item) }}</h3>
                </div>
                <span :class="getStatusClass(item.status_permohonan)" class="px-2 py-0.5 text-[9px] font-bold rounded-full uppercase">
                  {{ formatStatus(item.status_permohonan) }}
                </span>
              </div>
              <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                {{ item.detail_informasi }}
              </p>
              <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                <div class="flex gap-3">
                  <span class="text-[10px] text-gray-500 flex items-center">
                    <i :class="getPrivacyIcon(item.privacy_status)" class="mr-1"></i> {{ item.privacy_status }}
                  </span>
                  <span class="text-[10px] text-gray-500 flex items-center">
                    <i class="far fa-calendar-alt mr-1"></i> {{ formatDate(item.created_at) }}
                  </span>
                </div>
                <div class="flex gap-2">
                  <NuxtLink :to="`/tracking/${item.unique_code}`" class="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white shadow-sm">
                    Detail
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div v-if="!data?.data?.length" class="p-8 text-center text-gray-500 text-sm">
              Tidak ada permohonan ditemukan
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="data?.last_page > 1" class="mt-6 p-4 border-t border-gray-100 flex justify-center">
            <nav class="flex items-center gap-1">
              <button 
                @click="changePage(data.current_page - 1)" 
                :disabled="data.current_page === 1"
                class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                &laquo;
              </button>
              <button 
                v-for="page in paginationPages" 
                :key="page"
                @click="changePage(page)"
                :class="['px-3 py-1 rounded text-sm', data.current_page === page ? 'bg-blue-600 text-white font-bold' : 'border border-gray-300 hover:bg-gray-50']"
              >
                {{ page }}
              </button>
              <button 
                @click="changePage(data.current_page + 1)" 
                :disabled="data.current_page === data.last_page"
                class="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                &raquo;
              </button>
            </nav>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import CustomDate from '@/components/CustomDate.vue'
import CustomInput from '@/components/CustomInput.vue'
import { useGlobalLoader } from '@/composables/useGlobalLoader'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const currentPage = ref(1)

const sortOptions = [
  { value: 'created_at_desc', label: 'Terbaru' },
  { value: 'created_at_asc', label: 'Terlama' },
  { value: 'nama_pemohon_asc', label: 'Pemohon (A-Z)' },
  { value: 'nama_pemohon_desc', label: 'Pemohon (Z-A)' }
]

const perPageOptions = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' }
]

const filters = ref({
  search: '',
  date_from: '',
  date_to: '',
  sort: 'created_at_desc',
  per_page: '10'
})

const queryParams = computed(() => {
  return {
    page: currentPage.value,
    search: filters.value.search,
    date_from: filters.value.date_from,
    date_to: filters.value.date_to,
    sort: filters.value.sort,
    per_page: filters.value.per_page
  }
})

const fetchPermohonan = async ({ queryKey }) => {
  const [_key, params] = queryKey
  const res = await api.get('/laporan-permohonan', { params })
  return res.data.data
}

const { data, isLoading, refetch } = useQuery({
  queryKey: ['laporan-permohonan', queryParams],
  queryFn: fetchPermohonan,
  keepPreviousData: true
})

useGlobalLoader(isLoading)

const applyFilters = () => {
  currentPage.value = 1
  refetch()
}

const resetFilters = () => {
  filters.value = {
    search: '',
    date_from: '',
    date_to: '',
    sort: 'created_at_desc',
    per_page: '10'
  }
  currentPage.value = 1
  refetch()
}

const changePage = (page) => {
  if (page >= 1 && page <= data.value?.last_page) {
    currentPage.value = page
  }
}

const paginationPages = computed(() => {
  if (!data.value) return []
  const current = data.value.current_page
  const last = data.value.last_page
  const delta = 2
  const range = []
  
  for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
    range.push(i)
  }
  return range
})

// Format Helpers
const formatName = (item) => {
  if (item.privacy_status === 'Anonim') {
    return item.nama_pemohon.charAt(0) + '*****'
  }
  return item.nama_pemohon
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).format(date)
}

const formatStatus = (status) => {
  if (status === 'selesai') return 'Selesai'
  if (status === 'ditolak') return 'Ditolak'
  return status
}

const getStatusClass = (status) => {
  if (status === 'selesai') return 'bg-green-100 text-green-800'
  if (status === 'ditolak') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const getPrivacyClass = (privacy) => {
  if (privacy === 'Publik') return 'bg-sky-100 text-sky-800'
  if (privacy === 'Anonim') return 'bg-slate-100 text-slate-800'
  if (privacy === 'Rahasia') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const getPrivacyIcon = (privacy) => {
  if (privacy === 'Publik') return 'fas fa-globe-asia'
  if (privacy === 'Anonim') return 'fas fa-user-secret'
  if (privacy === 'Rahasia') return 'fas fa-lock'
  return 'fas fa-shield-alt'
}
</script>

