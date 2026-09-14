<template>
  <div class="tracking-page">
    <PageHeader title="Lacak Permohonan" />
    <div class="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.trackingPage()" class="mb-6" />
      <div class="bg-white rounded-xl shadow-lg p-8 border">
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Cek Status Permohonan Anda</h2>
        
        <form @submit.prevent="checkStatus" class="mb-8 max-w-2xl mx-auto">
          <div class="flex flex-col md:flex-row gap-4">
            <input 
              v-model="code" 
              type="text" 
              placeholder="Masukkan Kode Registrasi" 
              class="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-mono tracking-wider uppercase"
              required
            />
            <button 
              type="submit" 
              :disabled="loading"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center whitespace-nowrap"
            >
              <span v-if="loading" class="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              <i v-else class="fas fa-search mr-2"></i> Lacak
            </button>
          </div>
        </form>

        <div v-if="result" class="border-t pt-8 mt-4">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h3 class="text-xl font-bold text-gray-800">Detail Permohonan #{{ result.unique_code }}</h3>
              <p class="text-sm text-gray-500 mt-1"><i class="fas fa-shield-alt mr-1"></i> Privasi: <span class="font-semibold">{{ result.privacy_status }}</span></p>
            </div>
            <span :class="getStatusClass(result.status_permohonan)" class="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide">
              {{ formatStatus(result.status_permohonan) }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
            <!-- Data Pemohon -->
            <div class="space-y-4">
              <h4 class="font-bold text-blue-800 border-b pb-2 mb-3"><i class="fas fa-user mr-2"></i>Data Pemohon</h4>
              
              <div>
                <span class="block text-xs text-gray-500 font-semibold uppercase">Nama Lengkap</span>
                <span class="font-medium text-gray-900">{{ result.nama_pemohon || '-' }}</span>
              </div>
              
              <div>
                <span class="block text-xs text-gray-500 font-semibold uppercase">Email</span>
                <span class="font-medium text-gray-900">{{ result.email_pemohon || '-' }}</span>
              </div>
              
              <div>
                <span class="block text-xs text-gray-500 font-semibold uppercase">No. Telepon / WA</span>
                <span class="font-medium text-gray-900">{{ result.nomor_telepon_pemohon || '-' }}</span>
              </div>
              
              <div>
                <span class="block text-xs text-gray-500 font-semibold uppercase">Alamat</span>
                <span class="font-medium text-gray-900 text-sm">{{ result.alamat_pemohon || '-' }}</span>
              </div>
            </div>

            <!-- Detail Informasi -->
            <div class="space-y-4">
              <h4 class="font-bold text-blue-800 border-b pb-2 mb-3"><i class="fas fa-file-alt mr-2"></i>Data Informasi</h4>
              
              <div>
                <span class="block text-xs text-gray-500 font-semibold uppercase">Kategori Informasi</span>
                <span class="font-medium text-gray-900">{{ result.kategori_informasi || '-' }}</span>
              </div>
              
              <div>
                <span class="block text-xs text-gray-500 font-semibold uppercase">Tanggal Pengajuan</span>
                <span class="font-medium text-gray-900">{{ formatDate(result.created_at) }}</span>
              </div>
              
              <div>
                <span class="block text-xs text-gray-500 font-semibold uppercase">Rincian Informasi</span>
                <p class="font-medium text-gray-900 text-sm whitespace-pre-line mt-1 bg-white p-3 border rounded-md">{{ result.detail_informasi }}</p>
              </div>
              
              <div>
                <span class="block text-xs text-gray-500 font-semibold uppercase">Tujuan Penggunaan</span>
                <p class="font-medium text-gray-900 text-sm mt-1">{{ result.tujuan_penggunaan || '-' }}</p>
              </div>
            </div>
          </div>
            
          <!-- Responses / Tanggapan Admin -->
          <div v-if="result.responses && result.responses.length > 0" class="mt-8">
            <h4 class="font-bold text-gray-800 mb-4"><i class="fas fa-comments mr-2"></i>Tanggapan Petugas</h4>
            <div class="space-y-4">
              <div v-for="(resp, index) in result.responses" :key="index" class="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <span class="font-bold text-blue-900 text-sm">{{ resp.user ? resp.user.name : 'Admin/Petugas' }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(resp.created_at) }}</span>
                </div>
                <p class="text-gray-800 text-sm whitespace-pre-line">{{ resp.message }}</p>
                <div v-if="resp.file_path || resp.link" class="mt-3 pt-3 border-t border-blue-200">
                  <a v-if="resp.file_path" :href="getStorageUrl(resp.file_path)" target="_blank" class="inline-flex items-center text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 mr-2">
                    <i class="fas fa-download mr-1"></i> Unduh Lampiran
                  </a>
                  <a v-if="resp.link" :href="resp.link" target="_blank" class="inline-flex items-center text-xs bg-gray-600 text-white px-3 py-1.5 rounded hover:bg-gray-700">
                    <i class="fas fa-external-link-alt mr-1"></i> Buka Tautan
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div v-if="result.status_permohonan === 'ditolak'" class="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
            <p class="font-bold mb-1"><i class="fas fa-times-circle mr-2"></i>Permohonan Ditolak</p>
            <p class="text-sm">Silakan periksa tanggapan petugas di atas untuk alasan penolakan.</p>
          </div>
        </div>
        
        <div v-else-if="searched && !loading" class="text-center py-8 text-red-500 bg-red-50 rounded-lg border border-red-100 mt-4">
          <i class="fas fa-exclamation-circle text-3xl mb-2"></i>
          <p>Permohonan dengan kode <strong>{{ code }}</strong> tidak ditemukan.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'
import { ref, onMounted } from 'vue'
import api, { getStorageUrl } from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'

const route = useRoute()
const code = ref(route.params.code || '')
const loading = ref(false)
const searched = ref(false)
const result = ref(null)

onMounted(() => {
  if (code.value) {
    checkStatus()
  }
})

const checkStatus = async () => {
  if (!code.value.trim()) return
  
  loading.value = true
  searched.value = true
  result.value = null
  
  try {
    const res = await api.get(`/permohonan/status/${code.value}`)
    result.value = res.data.data
  } catch (error) {
    console.error('Error fetching status:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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
  if (s.includes('selesai') || s.includes('diterima')) return 'bg-green-100 text-green-800 border border-green-200'
  if (s.includes('tolak')) return 'bg-red-100 text-red-800 border border-red-200'
  if (s.includes('proses')) return 'bg-blue-100 text-blue-800 border border-blue-200'
  return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
}
</script>

