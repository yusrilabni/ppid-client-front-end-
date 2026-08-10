<template>
  <div class="tracking-page">
    <PageHeader title="Lacak Permohonan" />
    <div class="container mx-auto px-4 py-12 max-w-2xl">
      <div class="bg-white rounded-xl shadow-lg p-8 border">
        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Cek Status Permohonan Anda</h2>
        
        <form @submit.prevent="checkStatus" class="mb-8">
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
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-800">Detail Permohonan</h3>
            <span :class="getStatusClass(result.status)" class="px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
              {{ result.status }}
            </span>
          </div>
          
          <div class="space-y-4 text-sm bg-gray-50 p-6 rounded-lg">
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 font-medium col-span-1">Pemohon</span>
              <span class="font-semibold text-gray-900 col-span-2">: {{ result.nama }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 font-medium col-span-1">Tanggal Masuk</span>
              <span class="text-gray-900 col-span-2">: {{ result.created_at }}</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <span class="text-gray-500 font-medium col-span-1">Informasi</span>
              <span class="text-gray-900 col-span-2 truncate" :title="result.rincian_informasi">: {{ result.rincian_informasi }}</span>
            </div>
            
            <div v-if="result.alasan_penolakan" class="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md">
              <p class="font-bold mb-1">Catatan/Alasan:</p>
              <p>{{ result.alasan_penolakan }}</p>
            </div>
          </div>
        </div>
        
        <div v-else-if="searched && !loading" class="text-center py-8 text-red-500 bg-red-50 rounded-lg border border-red-100">
          <i class="fas fa-exclamation-circle text-3xl mb-2"></i>
          <p>Permohonan dengan kode <strong>{{ code }}</strong> tidak ditemukan.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'

const code = ref('')
const loading = ref(false)
const searched = ref(false)
const result = ref(null)

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

const getStatusClass = (status) => {
  const s = String(status).toLowerCase()
  if (s.includes('selesai') || s.includes('diterima')) return 'bg-green-100 text-green-800 border border-green-200'
  if (s.includes('tolak')) return 'bg-red-100 text-red-800 border border-red-200'
  if (s.includes('proses')) return 'bg-blue-100 text-blue-800 border border-blue-200'
  return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
}
</script>
