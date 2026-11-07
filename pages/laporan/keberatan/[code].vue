<template>
  <div class="tracking-keberatan-page bg-gray-50 min-h-screen pb-12">
    <div class="container mx-auto py-4 md:py-8 px-2 sm:px-4">
      <div class="max-w-6xl mx-auto">
        
        <!-- Breadcrumbs -->
        <div class="mb-4">
          <Breadcrumbs :breadcrumbs="getBreadcrumbs.laporanKeberatanDetail(code)" />
        </div>

        <!-- Big Logo Header -->
        <div class="text-center mb-6 md:mb-10 mt-4 md:mt-6">
          <div class="inline-flex items-center justify-center w-28 h-28 md:w-40 md:h-40 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 md:mb-6 shadow-xl overflow-hidden border-4 border-white">
            <img src="/logo/ppid.webp" alt="Logo PPID" class="w-24 h-24 md:w-36 md:h-36 object-contain">
          </div>
          <h1 class="text-2xl md:text-4xl font-extrabold text-gray-800 mb-2 md:mb-3 tracking-tight">Status Keberatan Informasi</h1>
          <p class="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Rincian lengkap pengajuan keberatan Anda, proses verifikasi, serta tanggapan resmi dari Atasan PPID.
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-20">
          <span class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
        </div>

        <!-- Result Content -->
        <div v-else-if="result" class="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 mx-1 sm:mx-0">
          
          <!-- Header Bar -->
          <div class="px-4 py-5 md:px-6 md:py-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-b border-blue-500">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <h2 class="text-lg md:text-xl font-bold text-white flex items-center">
                <div class="bg-white/20 p-2 rounded-lg mr-3">
                  <i class="fas fa-balance-scale"></i>
                </div>
                Keberatan #{{ result.unique_code }}
              </h2>

              <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <NuxtLink v-if="result.nomor_pendaftaran_pemohon" 
                  :to="`/laporan/permohonan/${result.nomor_pendaftaran_pemohon}`"
                  class="flex items-center justify-center px-3 py-2 text-xs md:text-sm font-semibold rounded-lg bg-white/20 text-white hover:bg-white/30 border border-white/30 backdrop-blur-sm transition-all"
                  title="Lihat Permohonan Asal">
                  <i class="fas fa-file-alt mr-1.5 md:mr-2"></i> Permohonan Asal
                </NuxtLink>
                
                <NuxtLink to="/laporan/keberatan" 
                  class="flex items-center justify-center px-3 py-2 text-xs md:text-sm font-semibold rounded-lg bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all">
                  <i class="fas fa-arrow-left mr-1.5 md:mr-2"></i> Daftar Keberatan
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="p-4 md:p-8">
            <!-- Badges -->
            <div class="mb-8 flex flex-wrap gap-2 md:gap-4">
              <span :class="getStatusClass(result.status_keberatan)" class="px-4 py-2 inline-flex items-center text-sm font-medium rounded-full border">
                <i class="fas fa-clock mr-2" v-if="result.status_keberatan === 'pending'"></i>
                <i class="fas fa-spinner fa-spin mr-2" v-else-if="result.status_keberatan === 'proses' || result.status_keberatan === 'diproses'"></i>
                <i class="fas fa-check-circle mr-2" v-else-if="result.status_keberatan === 'selesai' || result.status_keberatan === 'dikabulkan'"></i>
                <i class="fas fa-times-circle mr-2" v-else></i>
                Status: {{ formatStatus(result.status_keberatan) }}
              </span>

              <span class="px-4 py-2 inline-flex items-center text-sm font-medium rounded-full border bg-sky-100 text-sky-800 border-sky-200">
                <i class="fas fa-shield-alt mr-2"></i>
                Privasi: {{ result.privacy_status || 'Publik' }}
              </span>

              <span class="px-4 py-2 inline-flex items-center text-sm font-medium rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                <i class="far fa-calendar-alt mr-2"></i>
                Diajukan: {{ formatDate(result.created_at) }}
              </span>
            </div>

            <!-- Detail Alasan & Kasus Posisi -->
            <div class="mb-10">
              <h3 class="text-base md:text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-blue-100 flex items-center">
                <span class="bg-blue-500 text-white p-1.5 rounded-lg mr-3 shadow-sm">
                  <i class="fas fa-gavel"></i>
                </span>
                Materi Keberatan
              </h3>

              <div class="space-y-4">
                <div class="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                  <label class="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                    Alasan Pengajuan Keberatan (UU No. 14/2008 Pasal 35)
                  </label>
                  <div class="text-gray-900 font-bold text-base md:text-lg">
                    {{ getAlasanLabel(result.alasan_keberatan) }}
                  </div>
                </div>

                <div class="bg-gray-50/80 p-5 rounded-xl border border-gray-200">
                  <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Uraian Kasus Posisi / Kronologi Keberatan
                  </label>
                  <p class="text-gray-800 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {{ result.kasus_posisi || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Informasi Pemohon & Kuasa -->
            <div class="mb-10">
              <h3 class="text-base md:text-lg font-bold text-gray-900 mb-5 pb-2 border-b-2 border-blue-100 flex items-center">
                <span class="bg-blue-500 text-white p-1.5 rounded-lg mr-3 shadow-sm">
                  <i class="fas fa-user-circle"></i>
                </span>
                Identitas Pemohon
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div class="space-y-4">
                  <div class="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                    <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Nama Pemohon</label>
                    <div class="text-gray-900 font-semibold text-base">{{ result.nama_pemohon || '-' }}</div>
                  </div>
                  <div class="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                    <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Pekerjaan</label>
                    <div class="text-gray-900 font-medium">{{ result.pekerjaan || '-' }}</div>
                  </div>
                  <div class="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                    <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Nomor Telepon</label>
                    <div class="text-gray-900 font-medium">{{ result.nomor_telepon_pemohon || '-' }}</div>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                    <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Alamat Pemohon</label>
                    <div class="text-gray-900 font-medium text-sm leading-relaxed">{{ result.alamat_pemohon || '-' }}</div>
                  </div>
                  <div class="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                    <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Email</label>
                    <div class="text-gray-900 font-medium">{{ result.email_pemohon || '-' }}</div>
                  </div>
                  <div class="bg-gray-50/50 p-3.5 rounded-xl border border-gray-100">
                    <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Nomor Registrasi Permohonan Asal</label>
                    <div class="text-gray-900 font-mono font-bold">{{ result.nomor_pendaftaran_pemohon || '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- Kuasa Pemohon jika ada -->
              <div v-if="result.nama_kuasa" class="mt-6 p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center">
                  <i class="fas fa-users-cog mr-2"></i> Identitas Kuasa Pemohon
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm">
                  <div>
                    <span class="text-gray-500 block">Nama Kuasa:</span>
                    <strong class="text-gray-800">{{ result.nama_kuasa }}</strong>
                  </div>
                  <div>
                    <span class="text-gray-500 block">Telepon Kuasa:</span>
                    <strong class="text-gray-800">{{ result.nomor_telepon_kuasa || '-' }}</strong>
                  </div>
                  <div>
                    <span class="text-gray-500 block">Alamat Kuasa:</span>
                    <span class="text-gray-800">{{ result.alamat_kuasa || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel Tanggapan Atasan PPID -->
            <div class="mb-6 p-5 md:p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-indigo-50 border border-indigo-100">
              <h3 class="text-base md:text-lg font-bold text-indigo-950 mb-3 flex items-center">
                <i class="fas fa-clipboard-check mr-2 text-indigo-600"></i> Tanggapan Resmi Atasan PPID
              </h3>

              <div v-if="result.tanggal_tanggapan || result.status_keberatan === 'selesai' || result.status_keberatan === 'ditolak'">
                <p class="text-xs text-indigo-700 font-semibold mb-2">
                  Diberikan pada: {{ formatDate(result.tanggal_tanggapan || result.updated_at) }}
                </p>
                <div class="p-4 bg-white rounded-xl border border-indigo-200 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                  {{ result.catatan_tanggapan || 'Keberatan telah ditindaklanjuti dan diputuskan oleh Atasan PPID Kabupaten Sinjai sesuai ketentuan perundang-undangan.' }}
                </div>
              </div>

              <div v-else class="text-xs md:text-sm text-gray-600 leading-relaxed">
                <p class="mb-2">
                  Saat ini pengajuan keberatan masih dalam <strong>tahap evaluasi dan telaah oleh Atasan PPID Kabupaten Sinjai</strong>.
                </p>
                <p class="text-gray-500">
                  <i class="fas fa-info-circle mr-1 text-blue-500"></i> 
                  Berdasarkan UU KIP No. 14/2008 Pasal 36 ayat (2), Atasan PPID memiliki waktu paling lama <strong>30 hari kerja</strong> untuk memberikan keputusan/tanggapan tertulis.
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Not Found State -->
        <div v-else-if="!loading" class="text-center py-20 bg-white rounded-2xl shadow-lg border border-red-100 mt-4">
          <i class="fas fa-search text-4xl text-red-400 mb-3"></i>
          <p class="text-xl font-bold text-gray-800">Data keberatan tidak ditemukan</p>
          <p class="text-sm text-gray-500 mt-2">Pastikan kode registrasi keberatan yang Anda masukkan sudah benar.</p>
          <NuxtLink to="/laporan/keberatan" class="mt-4 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition">
            Lihat Rekapitulasi Keberatan
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'
import api from '@/services/api'

const route = useRoute()
const code = ref(route.params.code || '')
const loading = ref(false)
const result = ref(null)

onMounted(() => {
  if (code.value) {
    fetchKeberatanStatus()
  }
})

const fetchKeberatanStatus = async () => {
  if (!code.value.trim()) return
  loading.value = true
  try {
    const res = await api.get(`/keberatan/status/${code.value}`)
    result.value = res.data.data
  } catch (error) {
    console.error('Error fetching keberatan status:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date) + ' WITA'
}

const getAlasanLabel = (c) => {
  const map = {
    'a': 'a. Permohonan Informasi ditolak',
    'b': 'b. Informasi berkala tidak disediakan',
    'c': 'c. Permintaan Informasi tidak ditanggapi',
    'd': 'd. Permintaan Informasi ditanggapi tidak sebagaimana diminta',
    'e': 'e. Permintaan Informasi tidak dipenuhi',
    'f': 'f. Biaya yang dikenakan tidak wajar',
    'g': 'g. Penyampaian Informasi melebihi jangka waktu yang ditentukan'
  }
  return map[c] || c || 'Alasan Keberatan'
}

const formatStatus = (status) => {
  const s = String(status || '').toLowerCase()
  if (s === 'pending') return 'Menunggu Tanggapan Atasan PPID'
  if (s === 'proses' || s === 'diproses') return 'Sedang Ditelaah / Diproses'
  if (s === 'selesai' || s === 'dikabulkan') return 'Selesai / Dikabulkan'
  if (s === 'ditolak') return 'Keberatan Ditolak'
  return status || 'Menunggu'
}

const getStatusClass = (status) => {
  const s = String(status || '').toLowerCase()
  if (s.includes('selesai') || s.includes('kabul') || s.includes('terima')) return 'bg-green-100 text-green-800 border-green-200'
  if (s.includes('tolak')) return 'bg-red-100 text-red-800 border-red-200'
  if (s.includes('proses')) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-blue-100 text-blue-800 border-blue-200'
}
</script>
