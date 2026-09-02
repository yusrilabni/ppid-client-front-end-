<template>
  <div>
    <div class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 pt-6 md:pt-10 pb-24 overflow-hidden">
        <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div class="container max-w-6xl mx-auto px-4 relative z-10 text-center">
            <!-- Breadcrumbs -->
            <Breadcrumbs :breadcrumbs="getBreadcrumbs.informasiPemkab()" theme="dark" />

            <!-- Logo Sinjai Besar -->
            <div class="flex justify-center mb-6 mt-2">
                <img
                    src="https://ppidkab.sinjaikab.go.id/storage/logo/Lambang_Kabupaten_Sinjai.png"
                    alt="Logo Kabupaten Sinjai"
                    class="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl"
                />
            </div>

            <div class="flex justify-center items-center mb-4">
                <div class="w-full relative">
                    <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
                        Informasi Pemkab
                    </h1>
                </div>
            </div>
            <p class="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-light mt-4">
                Transparansi Dokumen Pemerintah Kabupaten yang dapat Anda akses, telusuri, dan unduh dengan mudah.
            </p>
        </div>
        
        <div class="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-1">
            <svg class="relative block w-full h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,121.22,201.2,110.53Z" class="fill-gray-50"></path>
            </svg>
        </div>
    </div>

    <div class="bg-gray-50 pb-16">
        <div class="container max-w-6xl mx-auto px-4 -mt-8 relative z-20">
            <!-- Notifikasi -->
            <div v-if="notification.message" 
                 :class="[
                   'mb-6 px-6 py-4 rounded-2xl shadow-sm flex items-start backdrop-blur-sm relative z-50 border',
                   notification.type === 'red' ? 'bg-red-50/90 border-red-200 text-red-700' : 'bg-green-50/90 border-green-200 text-green-700'
                 ]">
                <div class="flex-shrink-0 mt-0.5">
                    <i :class="notification.type === 'red' ? 'fas fa-exclamation-circle text-red-500 text-xl' : 'fas fa-check-circle text-green-500 text-xl'"></i>
                </div>
                <div class="ml-4 flex-1">
                    <h3 class="text-sm font-bold" :class="notification.type === 'red' ? 'text-red-800' : 'text-green-800'">
                        {{ notification.type === 'red' ? 'Perhatian' : 'Berhasil' }}
                    </h3>
                    <p class="mt-1 text-sm">{{ notification.message }}</p>
                </div>
                <button @click="notification.message = ''" class="ml-auto pl-3 text-gray-400 hover:text-gray-500 focus:outline-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-white mb-6 relative z-50">
                    <div class="flex-1 relative" style="z-index: 50;">
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-2">
                            <i class="fas fa-layer-group text-blue-500 mr-1"></i> Kategori
                        </label>
                        <CustomSelect 
                            v-model="filters.kategori" 
                            :options="kategoriOptions" 
                            labelKey="label" 
                            valueKey="value" 
                            placeholder="Semua Kategori"
                            @change="resetJenis"
                            class="w-full"
                        />
                    </div>
                    
                    <div class="flex-1 relative" style="z-index: 49;">
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-2">
                            <i class="fas fa-file-alt text-blue-500 mr-1"></i> Jenis Dokumen
                        </label>
                        <CustomSelect 
                            v-model="filters.jenis_dokumen" 
                            :options="jenisDokumenOptions" 
                            labelKey="label" 
                            valueKey="value" 
                            placeholder="Semua Jenis Dokumen"
                            @change="applyFilters"
                            class="w-full transition-opacity"
                        />
                    </div>

                    <div class="flex-1 relative" style="z-index: 48;">
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-2">
                            <i class="fas fa-calendar-alt text-blue-500 mr-1"></i> Tahun
                        </label>
                        <CustomSelect 
                            v-model="filters.tahun" 
                            :options="tahunOptions" 
                            labelKey="label" 
                            valueKey="value" 
                            placeholder="Semua Tahun"
                            @change="applyFilters"
                            class="w-full"
                        />
                    </div>

                    <div class="flex-1 relative" style="z-index: 47;">
                        <label class="block text-sm font-semibold text-gray-700 mb-2 ml-2">
                            <i class="fas fa-search text-blue-500 mr-1"></i> Pencarian
                        </label>
                        <div class="relative">
                            <input 
                                type="text" 
                                v-model="filters.search" 
                                @keyup.enter="applyFilters"
                                placeholder="Cari judul..." 
                                class="w-full h-[44px] pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                            >
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i class="fas fa-search"></i>
                            </div>
                        </div>
                    </div>

                    <div class="w-full lg:w-48 flex-none pt-2 lg:pt-0 flex gap-2">
                        <button @click="applyFilters" class="flex-1 lg:flex-none w-full lg:w-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 rounded-xl h-[44px] transition-all flex items-center justify-center font-bold" title="Terapkan Filter">
                            <i class="fas fa-search lg:mr-0"></i> <span class="inline lg:hidden ml-2">Cari</span>
                        </button>
                        <button @click="resetFilters" class="flex-1 lg:flex-none w-full lg:w-14 bg-gray-100 hover:bg-gray-200 text-gray-600 shadow-sm rounded-xl h-[44px] transition-all flex items-center justify-center border border-gray-200" title="Reset Filter">
                            <i class="fas fa-undo-alt lg:mr-0"></i> <span class="inline lg:hidden ml-2 font-semibold">Reset</span>
                        </button>
                    </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 relative z-10">
                <h2 class="text-xl font-bold text-gray-800">Daftar Dokumen</h2>
                <NuxtLink v-if="isAdmin" to="/admin/informasi-pemkab/create" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition duration-200 flex items-center justify-center shadow-md">
                    <i class="fas fa-plus mr-2"></i> Tambah Informasi Pemkab
                </NuxtLink>
            </div>

            <!-- Daftar Dokumen -->
            <div class="bg-white/80 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]" style="z-index: 10;">
                
                <div class="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" style="opacity: 0.03;">
                    <div class="w-full h-full" :style="{ backgroundImage: `url(${getAssetUrl('storage/logo/Lambang_Kabupaten_Sinjai.png')})`, backgroundRepeat: 'repeat-y', backgroundPosition: 'center top', backgroundSize: 'contain', minHeight: '800px', filter: 'grayscale(100%)' }"></div>
                </div>

                <div v-if="isLoading" class="p-12 text-center relative z-10">
                    <i class="fas fa-circle-notch fa-spin text-4xl text-blue-500 mb-4"></i>
                    <p class="text-gray-500">Memuat data...</p>
                </div>

                <template v-else-if="items.length > 0">
                    <div class="hidden md:block overflow-x-auto relative z-10">
                        <table class="min-w-full w-full whitespace-nowrap bg-transparent">
                            <thead>
                                <tr class="bg-gray-100/60 border-b border-gray-200 text-left backdrop-blur-sm">
                                    <th class="py-4 px-4 font-bold text-gray-700 text-sm tracking-wide uppercase w-12 text-center">No</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase min-w-[350px] w-[45%]">Detail Dokumen</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-40">Kategori</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-40">Sumber</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase w-28 text-center">Tanggal</th>
                                    <th class="py-4 px-6 font-bold text-gray-700 text-sm tracking-wide uppercase min-w-[140px] text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100/50">
                                <tr v-for="(dokumen, index) in items" :key="dokumen.id" class="transition-colors group hover:bg-blue-50/60">
                                    <td class="py-4 px-4 text-center align-middle font-medium text-gray-500">
                                        {{ (currentPage - 1) * Number(filters.per_page) + index + 1 }}
                                    </td>
                                    <td class="py-4 px-6 whitespace-normal align-middle">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0">
                                                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-50 border-blue-100 text-blue-600 flex items-center justify-center border shadow-sm">
                                                    <i class="fas fa-file-pdf text-lg"></i>
                                                </div>
                                            </div>
                                            <div class="ml-4">
                                                <NuxtLink :to="`/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}`" class="block text-base font-bold text-gray-800 hover:text-blue-700 transition-all duration-300 leading-tight line-clamp-1 group-hover:line-clamp-none">
                                                    {{ dokumen.judul }}
                                                </NuxtLink>
                                                <p v-if="dokumen.deskripsi" class="text-sm text-gray-500 mt-1 transition-all duration-300 line-clamp-1 group-hover:line-clamp-none">
                                                    {{ dokumen.deskripsi }}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-4 px-6 whitespace-normal align-middle">
                                        <span class="inline-block px-3 py-1 bg-white/80 text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 mb-1 shadow-sm">
                                            {{ dokumen.kategori }}
                                        </span>
                                        <br>
                                        <span class="inline-block px-3 py-1 bg-blue-50/80 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100 mt-1 shadow-sm">
                                            {{ dokumen.jenis_dokumen }}
                                        </span>
                                    </td>
                                    <td class="py-4 px-6 whitespace-normal align-middle">
                                        <div v-if="dokumen.user" class="mb-1.5 text-xs text-gray-600 font-medium whitespace-nowrap">
                                            <i class="fas fa-user-circle mr-1 text-gray-400"></i>
                                            <template v-if="dokumen.user.role === 'superadmin' || (dokumen.user.admin_kabupaten && dokumen.user.admin_kabupaten == 1)">
                                                Admin Kabupaten ({{ dokumen.user.name }})
                                            </template>
                                            <template v-else>
                                                {{ dokumen.user.name }}
                                            </template>
                                        </div>
                                        <span v-if="dokumen.organization" class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <i class="fas fa-building mr-1.5"></i> {{ dokumen.organization.name }}
                                        </span>
                                        <span v-else class="text-xs text-gray-400 italic">Pemerintah Kabupaten</span>
                                    </td>
                                    <td class="py-4 px-6 text-center align-middle">
                                        <span class="inline-block bg-white/80 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 shadow-sm whitespace-nowrap">
                                            {{ formatDate(dokumen.published_at || dokumen.created_at) }}
                                        </span>
                                    </td>
                                    <td class="py-4 px-6 text-center align-middle">
                                        <div class="flex items-center justify-center space-x-2">
                                            <NuxtLink :to="`/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}`" class="inline-flex items-center justify-center w-9 h-9 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm transition-all duration-300" title="Lihat Detail">
                                                <i class="fas fa-eye"></i>
                                            </NuxtLink>
                                            <a v-if="dokumen.file_path" :href="getDownloadUrl(dokumen)" target="_blank" class="inline-flex items-center justify-center w-9 h-9 bg-green-50 border border-green-200 text-green-600 hover:bg-green-600 hover:text-white rounded-lg text-sm transition-all duration-300" title="Unduh">
                                                <i :class="dokumen.file_path.startsWith('http') ? 'fas fa-external-link-alt' : 'fas fa-cloud-download-alt'"></i>
                                            </a>
                                            <template v-if="isAdmin && canEditOrDelete(dokumen)">
                                                <NuxtLink :to="`/admin/informasi-pemkab/${dokumen.id}/edit`" class="inline-flex items-center justify-center w-9 h-9 bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-600 hover:text-white rounded-lg text-sm transition-all duration-300" title="Edit">
                                                    <i class="fas fa-edit"></i>
                                                </NuxtLink>
                                                <button @click="deleteItem(dokumen)" class="inline-flex items-center justify-center w-9 h-9 bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-sm transition-all duration-300" title="Hapus">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
      
                    <div class="block md:hidden relative z-10 p-3 sm:p-4 space-y-4 bg-gray-50/50">
                          <div v-for="dokumen in items" :key="'mob-'+dokumen.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative flex flex-col group transition-all duration-300">
                              <div class="flex items-start">
                                  <div class="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-600 border-blue-100 flex items-center justify-center border shadow-sm mt-0.5">
                                      <i class="fas fa-file-pdf text-lg"></i>
                                  </div>
                                  <div class="ml-3 flex-grow min-w-0">
                                      <NuxtLink :to="`/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}`" class="block text-sm sm:text-base font-bold text-gray-800 hover:text-blue-700 transition-all duration-300 leading-snug line-clamp-1 group-hover:line-clamp-none">
                                          {{ dokumen.judul }}
                                      </NuxtLink>
                                      <p v-if="dokumen.deskripsi" class="text-xs text-gray-500 mt-1.5 transition-all duration-300 line-clamp-1 group-hover:line-clamp-none leading-relaxed">
                                        {{ dokumen.deskripsi }}
                                    </p>
                                </div>
                            </div>
      
                            <div class="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                                <span class="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-semibold rounded-md border border-gray-200">
                                    {{ dokumen.kategori }}
                                </span>
                                <span class="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-semibold rounded-md border border-blue-100">
                                    {{ dokumen.jenis_dokumen }}
                                </span>
                                <span v-if="dokumen.user" class="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] sm:text-xs font-semibold rounded-md border border-purple-200">
                                    <i class="fas fa-user-circle mr-1"></i> 
                                    <template v-if="dokumen.user.role === 'superadmin' || (dokumen.user.admin_kabupaten && dokumen.user.admin_kabupaten == 1)">
                                        Admin Kabupaten ({{ dokumen.user.name }})
                                    </template>
                                    <template v-else>
                                        {{ dokumen.user.name }}
                                    </template>
                                </span>
                                <span v-if="dokumen.organization" class="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-semibold rounded-md border border-emerald-200">
                                    <i class="fas fa-building mr-1"></i> {{ dokumen.organization.name }}
                                </span>
                                <span class="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] sm:text-xs font-semibold rounded-md border border-gray-200">
                                    <i class="fas fa-calendar mr-1 text-gray-400"></i> {{ formatDate(dokumen.published_at || dokumen.created_at) }}
                                </span>
                            </div>
      
                            <div class="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                                <a v-if="dokumen.file_path" :href="getDownloadUrl(dokumen)" target="_blank" class="inline-flex flex-1 sm:flex-none items-center justify-center h-9 px-3 bg-green-50 border border-green-200 text-green-600 hover:bg-green-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                                    <i :class="dokumen.file_path.startsWith('http') ? 'fas fa-external-link-alt' : 'fas fa-cloud-download-alt'"></i> <span class="hidden sm:inline sm:ml-1.5">Unduh</span>
                                </a>
                                <NuxtLink :to="`/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}`" class="inline-flex flex-1 sm:flex-none items-center justify-center h-9 px-3 bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors">
                                    <i class="fas fa-eye sm:mr-1.5"></i> <span class="hidden sm:inline">Detail</span>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </template>

                <div v-else class="py-20 text-center relative z-10">
                    <div class="flex flex-col items-center justify-center">
                        <div class="w-24 h-24 bg-white/80 shadow-sm rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-folder-open text-4xl text-gray-300"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-700 mb-2">Belum Ada Dokumen</h3>
                        <p class="text-gray-500 font-medium">Silakan sesuaikan filter pencarian Anda.</p>
                    </div>
                </div>
                
                <!-- Pagination -->
                <div v-if="lastPage > 1" class="relative z-10 px-6 py-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm flex justify-center mt-4">
                    <nav class="inline-flex rounded-xl shadow-sm border border-gray-100 bg-white p-1">
                        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 text-sm font-bold text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <template v-for="page in visiblePages" :key="page">
                            <span v-if="page === '...'" class="px-4 py-2 text-sm font-bold text-gray-400">...</span>
                            <button v-else @click="changePage(page)" :class="['px-4 py-2 text-sm font-bold rounded-lg transition-colors', page === currentPage ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600']">
                                {{ page }}
                            </button>
                        </template>
                        <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage" class="px-4 py-2 text-sm font-bold text-gray-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'
import { ref, computed, watch } from 'vue'

import { useQuery, useQueryClient } from '@tanstack/vue-query'
import api, { getStorageUrl, getAssetUrl } from '@/services/api'
import CustomSelect from '@/components/CustomSelect.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const queryClient = useQueryClient()

const isAdmin = computed(() => authStore.isAuthenticated && (authStore.isAdmin || authStore.user?.unit_id))

const canEditOrDelete = (dokumen) => {
  if (!authStore.isAuthenticated) return false
  if (authStore.isSuperAdmin) return true
  const userUnitId = authStore.user?.unit_id || authStore.user?.organization_id
  if (!userUnitId) return false
  return String(dokumen.unit_id) === String(userUnitId) || String(dokumen.organization_id) === String(userUnitId)
}

const notification = ref({ type: '', message: '' })

const deleteItem = async (dokumen) => {
  if (!canEditOrDelete(dokumen)) {
    notification.value = { type: 'red', message: 'Akses ditolak. Anda hanya dapat menghapus dokumen unit Anda sendiri.' }
    return
  }
  if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${dokumen.judul}"?`)) {
    try {
      const res = await api.delete('/informasi-pemkab-crud/' + dokumen.id)
      if (res.data?.success || res.status === 200) {
        notification.value = { type: 'red', message: `Dokumen "${dokumen.judul}" berhasil dihapus.` }
        queryClient.invalidateQueries({ queryKey: ['informasi-pemkab'] })
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
      notification.value = { type: 'red', message: 'Gagal menghapus dokumen: ' + (error.response?.data?.message || error.message) }
    }
  }
}

// OG meta dinamis berbasis filter aktif
const pageTitle = computed(() => {
  let title = 'PPID - Informasi Pemkab'
  const kat = route.query.kategori
  const jenis = route.query.jenis_dokumen

  if (kat && jenis) {
    title += ` - Kategori ${kat} Dokumen ${jenis}`
  } else if (kat) {
    title += ` - Kategori ${kat}`
  } else if (jenis) {
    title += ` - Dokumen ${jenis}`
  }
  return title
})

const pageDescription = computed(() => {
  return 'Pejabat Pengelola Informasi dan Dokumentasi Kabupaten Sinjai - Transparansi dokumen Pemerintah Kabupaten Sinjai'
})

const ogImageUrl = 'https://ppid.sinjaikab.go.id/logo/Lambang_Kabupaten_Sinjai_OG.jpg'

useHead(computed(() => ({
  title: pageTitle.value,
  meta: [
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:image', content: ogImageUrl },
    { property: 'og:type', content: 'website' },
    { name: 'description', content: pageDescription.value },
    { property: 'og:description', content: pageDescription.value },
    { name: 'twitter:description', content: pageDescription.value },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle.value },
    { name: 'twitter:image', content: ogImageUrl },
  ]
})))

const filters = ref({
  kategori: route.query.kategori || '',
  jenis_dokumen: route.query.jenis_dokumen || '',
  tahun: route.query.tahun || '',
  search: route.query.search || '',
  per_page: route.query.per_page || '10',
  page: route.query.page || 1
})

const fetchInformasiPemkab = async () => {
  const res = await api.get('/informasi-pemkab', { params: filters.value })
  
  return res.data
}

const getDownloadUrl = (dokumen) => {
  if (!dokumen) return '#'
  return `${api.defaults.baseURL.replace('/api/v1', '')}/transparansi/informasi-pemkab/${dokumen.slug || dokumen.id}/download`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const { data, isLoading } = useQuery({
  queryKey: computed(() => ['informasi-pemkab', filters.value]),
  queryFn: fetchInformasiPemkab,
  keepPreviousData: true
})
const kategori_jenis = computed(() => data.value?.kategori_jenis || {})

const availableYears = computed(() => {
  const years = []
  const current = new Date().getFullYear()
  for (let y = current; y >= 2000; y--) years.push(y)
  return years
})

const kategoriOptions = computed(() => {
    const opts = [{ label: 'Semua Kategori', value: '' }]
    Object.keys(kategori_jenis.value).forEach(k => opts.push({ label: k, value: k }))
    return opts
})

const jenisDokumenOptions = computed(() => {
    const opts = [{ label: 'Semua Jenis Dokumen', value: '' }]
    if (filters.value.kategori && kategori_jenis.value[filters.value.kategori]) {
        kategori_jenis.value[filters.value.kategori].forEach(j => opts.push({ label: j, value: j }))
    } else if (kategori_jenis.value) {
        let allTypesSet = new Set()
        for (let cat in kategori_jenis.value) {
            kategori_jenis.value[cat].forEach(t => allTypesSet.add(t))
        }
        const allTypes = Array.from(allTypesSet).sort()
        allTypes.forEach(j => opts.push({ label: j, value: j }))
    }
    return opts
})

const tahunOptions = computed(() => {
    const opts = [{ label: 'Semua Tahun', value: '' }]
    availableYears.value.forEach(y => opts.push({ label: y.toString(), value: y.toString() }))
    return opts
})

const perPageOptions = [
    { label: '10 Baris', value: '10' },
    { label: '25 Baris', value: '25' },
    { label: '50 Baris', value: '50' },
    { label: '100 Baris', value: '100' },
]


const items = computed(() => data.value?.data?.data || [])
const currentPage = computed(() => data.value?.data?.current_page || 1)
const lastPage = computed(() => data.value?.data?.last_page || 1)

const visiblePages = computed(() => {
  const current = currentPage.value
  const last = lastPage.value
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1)
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', last]
  }
  if (current >= last - 3) {
    return [1, '...', last - 4, last - 3, last - 2, last - 1, last]
  }
  return [1, '...', current - 1, current, current + 1, '...', last]
})

const resetJenis = () => {
  filters.value.jenis_dokumen = ''
  applyFilters()
}

const applyFilters = () => {
  filters.value.page = 1
  updateRoute()
}

const resetFilters = () => {
  filters.value = {
    kategori: '',
    jenis_dokumen: '',
    tahun: '',
    search: '',
    per_page: '10',
    page: 1
  }
  updateRoute()
}

const changePage = (p) => {
  if (p >= 1 && p <= lastPage.value) {
    filters.value.page = p
    updateRoute()
  }
}

const updateRoute = () => {
  router.push({ query: { ...filters.value } })
}



import { onMounted } from 'vue'

onMounted(() => {
  // sync filter dari URL query saat pertama load
  filters.value = {
    kategori: route.query.kategori || '',
    jenis_dokumen: route.query.jenis_dokumen || '',
    tahun: route.query.tahun || '',
    search: route.query.search || '',
    per_page: route.query.per_page || '10',
    page: route.query.page || 1
  }

  // Cek notifikasi dari URL (create/edit)
  if (route.query.message) {
    notification.value = { type: 'green', message: route.query.message }
    // Bersihkan URL dari parameter message
    const query = { ...route.query }
    delete query.message
    router.replace({ query })
  }
  if (route.query.error) {
    notification.value = { type: 'red', message: route.query.error }
    const query = { ...route.query }
    delete query.error
    router.replace({ query })
  }
})

watch(
  () => route.query,
  (newQuery) => {
    filters.value = {
      kategori: newQuery.kategori || '',
      jenis_dokumen: newQuery.jenis_dokumen || '',
      tahun: newQuery.tahun || '',
      search: newQuery.search || '',
      per_page: newQuery.per_page || '10',
      page: newQuery.page || 1
    }
    // OG meta otomatis reaktif via useHead computed, tidak perlu updateTitle
  },
  { deep: true }
)
</script>

