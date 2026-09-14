<template>
  <div class="tracking-page bg-gray-50 min-h-screen pb-12">
    <div class="container mx-auto py-4 md:py-8 px-2 sm:px-4">
      <div class="max-w-6xl mx-auto">
        <!-- BREADCRUMBS (Matched with version2) -->
        <div class="mb-4">
            <div class="flex items-center space-x-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
                <NuxtLink to="/" class="hover:text-blue-600 flex items-center"><i class="fas fa-home mr-1"></i> Beranda</NuxtLink>
                <span>/</span>
                <NuxtLink to="/laporan/permohonan" class="hover:text-blue-600 flex items-center"><i class="fas fa-file-alt mr-1"></i> Permohonan Saya</NuxtLink>
                <span>/</span>
                <span class="text-gray-900 font-semibold flex items-center"><i class="fas fa-info-circle mr-1"></i> Detail</span>
            </div>
        </div>

        <!-- BIG LOGO HEADER (Matched with version2) -->
        <div class="text-center mb-6 md:mb-10 mt-4">
            <div class="inline-flex items-center justify-center w-24 h-24 md:w-36 md:h-36 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 md:mb-6 shadow-lg overflow-hidden">
                <img src="/logo/ppid.webp" alt="Logo PPID" class="w-20 h-20 md:w-32 md:h-32 object-contain">
            </div>
            <h1 class="text-2xl md:text-4xl font-extrabold text-gray-800 mb-2 px-2">Detail Permohonan</h1>
            <p class="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
                Rincian lengkap permohonan informasi Anda, status, dan riwayat tanggapan.
            </p>
        </div>
        
        <div v-if="loading" class="flex justify-center py-20">
          <span class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
        </div>
        
        <div v-else-if="result" class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 mx-1 sm:mx-0">
        <!-- Header / Nomor Resi -->
        <div class="px-4 py-5 md:px-6 md:py-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-b border-blue-500">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 class="text-lg md:text-xl font-bold text-white flex items-center">
                    <div class="bg-white/20 p-2 rounded-lg mr-3">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    #{{ result.unique_code }}
                </h2>
                <div class="flex items-center gap-2 w-full lg:w-auto">
                    <NuxtLink to="/laporan/permohonan" class="flex items-center justify-center px-3 py-2 text-xs md:text-sm font-semibold rounded-lg bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all">
                        <i class="fas fa-arrow-left mr-1.5 md:mr-2"></i> Kembali ke Daftar
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="p-4 md:p-8">
            <!-- Status Badges -->
            <div class="mb-8 flex flex-wrap gap-2 md:gap-4">
                <span :class="getStatusClass(result.status_permohonan)" class="px-4 py-2 inline-flex items-center text-sm font-medium rounded-full border">
                    <i class="fas fa-check-circle mr-2" v-if="result.status_permohonan === 'selesai'"></i>
                    <i class="fas fa-spinner fa-spin mr-2" v-else-if="result.status_permohonan === 'diproses'"></i>
                    <i class="fas fa-clock mr-2" v-else-if="result.status_permohonan === 'pending'"></i>
                    <i class="fas fa-times-circle mr-2" v-else></i>
                    {{ formatStatus(result.status_permohonan) }}
                </span>

                <span class="px-4 py-2 inline-flex items-center text-sm font-medium rounded-full border bg-sky-100 text-sky-800 border-sky-200">
                    <i class="fas fa-shield-alt mr-2"></i>
                    {{ result.privacy_status || 'Publik' }}
                </span>
            </div>

            <!-- Informasi Pemohon -->
            <div class="mb-10">
                <h3 class="text-base md:text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-blue-100 flex items-center">
                    <span class="bg-blue-500 text-white p-1.5 rounded-lg mr-3 shadow-sm">
                        <i class="fas fa-user-circle"></i>
                    </span>
                    Informasi Pemohon
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div class="space-y-5">
                        <div class="bg-gray-50/50 p-3 rounded-xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                            <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Nama Pemohon</label>
                            <div class="text-gray-900 font-semibold text-base">{{ result.nama_pemohon || '-' }}</div>
                        </div>
                        <div class="bg-gray-50/50 p-3 rounded-xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                            <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Pekerjaan</label>
                            <div class="text-gray-900 font-medium">{{ result.pekerjaan || '-' }}</div>
                        </div>
                        <div class="bg-gray-50/50 p-3 rounded-xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                            <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Nomor Telepon</label>
                            <div class="text-gray-900 font-medium">{{ result.nomor_telepon_pemohon || '-' }}</div>
                        </div>
                    </div>
                    <div class="space-y-5">
                        <div class="bg-gray-50/50 p-3 rounded-xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                            <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Alamat</label>
                            <div class="text-gray-900 font-medium text-sm leading-relaxed">{{ result.alamat_pemohon || '-' }}</div>
                        </div>
                        <div class="bg-gray-50/50 p-3 rounded-xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                            <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Email</label>
                            <div class="text-gray-900 font-medium">{{ result.email_pemohon || '-' }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detail Permohonan -->
            <div class="space-y-8 mb-10">
                <div class="group">
                    <h3 class="text-base md:text-lg font-bold text-gray-900 mb-3 flex items-center">
                        <span class="bg-indigo-500 text-white p-1.5 rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                            <i class="fas fa-search"></i>
                        </span>
                        Informasi yang Dimohon
                    </h3>
                    <div class="bg-gradient-to-br from-blue-50 to-white p-4 md:p-5 rounded-2xl border border-blue-100 shadow-sm leading-relaxed text-gray-800 text-base md:text-lg italic font-medium whitespace-pre-line">{{ result.detail_informasi }}</div>
                </div>

                <div class="group">
                    <h3 class="text-base md:text-lg font-bold text-gray-900 mb-3 flex items-center">
                        <span class="bg-emerald-500 text-white p-1.5 rounded-lg mr-3 shadow-sm group-hover:scale-110 transition-transform">
                            <i class="fas fa-bullseye"></i>
                        </span>
                        Tujuan Penggunaan
                    </h3>
                    <div class="bg-emerald-50/30 p-4 md:p-5 rounded-2xl border border-emerald-100 shadow-sm leading-relaxed text-gray-700">{{ result.tujuan_penggunaan || '-' }}</div>
                </div>
            </div>

            <!-- Riwayat Tanggapan -->
            <div v-if="result.responses && result.responses.length > 0" class="mt-12">
                <h3 class="text-base md:text-lg font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-100 flex items-center">
                    <span class="bg-purple-500 text-white p-1.5 rounded-lg mr-3 shadow-sm">
                        <i class="fas fa-history"></i>
                    </span>
                    Riwayat Tanggapan
                </h3>
                
                <div class="relative">
                    <div class="absolute left-5 md:left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-200 via-indigo-200 to-transparent"></div>
                    <div class="space-y-6 md:space-y-8 relative z-10">
                        <div v-for="(resp, index) in result.responses" :key="index" class="flex items-start gap-3 md:gap-4">
                            <div class="flex-shrink-0 z-10">
                                <div class="h-10 w-10 md:h-14 md:w-14 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                                     :class="resp.user_id === result.user_id ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600' : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'">
                                    <i class="fas text-lg md:text-2xl" :class="resp.user_id === result.user_id ? 'fa-user' : 'fa-user-tie'"></i>
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="p-4 md:p-5 rounded-2xl rounded-tl-none border shadow-sm hover:shadow-md transition-shadow"
                                     :class="isRatingMsg(resp, index) ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' : 'bg-white border-gray-100'">
                                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
                                        <p class="font-bold text-gray-900 text-sm md:text-base">
                                            {{ resp.user ? resp.user.name : (resp.user_id === result.user_id ? 'Pemohon' : 'Petugas PPID') }}
                                            
                                            <span v-if="resp.user_id === result.user_id" class="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full uppercase">Pemohon</span>
                                            <span v-else class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full uppercase">Petugas</span>
                                            
                                            <span v-if="isRatingMsg(resp, index)" class="ml-1 px-2 py-0.5 bg-yellow-500 text-white text-[10px] rounded-full uppercase font-black tracking-tighter">
                                                <i class="fas fa-star mr-1"></i>Penilaian
                                            </span>
                                        </p>
                                        <div class="flex flex-col items-end">
                                            <p class="text-[10px] md:text-xs font-medium text-gray-400 flex items-center italic">
                                                <i class="far fa-clock mr-1"></i> {{ formatDate(resp.created_at) }}
                                            </p>
                                            <div v-if="isRatingMsg(resp, index)" class="flex flex-col items-end mt-1">
                                                <div class="flex gap-0.5">
                                                    <i v-for="i in 5" :key="i" class="fas fa-star text-base md:text-xl shadow-sm"
                                                       :class="i <= result.rating ? 'text-amber-500' : 'text-gray-200'"></i>
                                                </div>
                                                <span class="text-[9px] md:text-[11px] font-black text-amber-600 uppercase tracking-tighter mt-1 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                                                    {{ getRatingLabel(result.rating) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-gray-700 text-sm md:text-base leading-relaxed mb-4 whitespace-pre-line"
                                         :class="{ 'italic font-medium': isRatingMsg(resp, index) }">
                                        {{ resp.message }}
                                    </div>
                                    
                                    <div v-if="resp.file_path || resp.link" class="pt-4 border-t border-gray-50 space-y-3">
                                        <a v-if="resp.file_path" :href="getStorageUrl(resp.file_path)" target="_blank" class="group flex items-center p-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300">
                                            <div class="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-90 transition-transform">
                                                <i class="fas fa-file-download text-lg"></i>
                                            </div>
                                            <div class="ml-3 flex-1">
                                                <p class="text-xs font-bold text-blue-800 group-hover:text-white uppercase tracking-tighter">Unduh Lampiran</p>
                                            </div>
                                        </a>
                                        <a v-if="resp.link" :href="resp.link" target="_blank" class="flex items-center text-xs md:text-sm text-indigo-600 hover:text-indigo-800 font-medium break-all">
                                            <i class="fas fa-link mr-2"></i> {{ resp.link }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div v-else-if="!loading" class="text-center py-20 bg-white rounded-2xl shadow-lg border border-red-100 mt-4">
        <i class="fas fa-search text-4xl text-red-400 mb-3"></i>
        <p class="text-xl font-bold text-gray-800">Permohonan tidak ditemukan</p>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { getStorageUrl } from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const code = ref(route.params.code || '')
const loading = ref(false)
const result = ref(null)

onMounted(() => {
  if (code.value) {
    checkStatus()
  }
})

const checkStatus = async () => {
  if (!code.value.trim()) return
  loading.value = true
  try {
    const res = await api.get(`/permohonan/status/${code.value}`)
    result.value = res.data.data
  } catch (error) {
    console.error('Error fetching status:', error)
  } finally {
    loading.value = false
  }
}

const isRatingMsg = (resp, index) => {
  if (!result.value) return false
  const isOwner = resp.user_id === result.value.user_id
  const isLast = index === result.value.responses.length - 1
  return result.value.rating !== null && isLast && isOwner
}

const getRatingLabel = (rating) => {
  const labels = {
    1: 'Tidak Puas',
    2: 'Kurang Puas',
    3: 'Cukup Puas',
    4: 'Puas',
    5: 'Sangat Puas'
  }
  return labels[rating] || ''
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date) + ' WITA'
}

const formatStatus = (status) => {
  if (!status) return '-'
  if (status === 'selesai') return 'Selesai'
  if (status === 'ditolak') return 'Ditolak'
  if (status === 'diproses') return 'Diproses'
  if (status === 'pending') return 'Menunggu'
  return status
}

const getStatusClass = (status) => {
  const s = String(status).toLowerCase()
  if (s.includes('selesai') || s.includes('diterima')) return 'bg-green-100 text-green-800 border-green-200'
  if (s.includes('tolak')) return 'bg-red-100 text-red-800 border-red-200'
  if (s.includes('proses')) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-blue-100 text-blue-800 border-blue-200'
}
</script>
