<template>
  <div class="permohonan-page">
    <PageHeader title="Permohonan Informasi Publik" />
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-100">
        
        <div v-if="success" class="bg-green-50 text-green-700 p-6 rounded-lg mb-8 text-center border border-green-200">
          <i class="fas fa-check-circle text-4xl mb-3 text-green-500"></i>
          <h3 class="text-xl font-bold mb-2">Permohonan Berhasil Dikirim!</h3>
          <p class="mb-4">Terima kasih, permohonan Anda telah kami terima.</p>
          <div class="bg-white p-4 rounded-md shadow-inner text-xl font-mono tracking-widest text-gray-800 border">
            Kode Registrasi: <strong>{{ trackingCode }}</strong>
          </div>
          <p class="text-sm mt-4 text-green-600">Simpan kode registrasi ini untuk melacak status permohonan Anda.</p>
          <button @click="resetForm" class="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Ajukan Permohonan Baru</button>
        </div>

        <form v-else @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Pemohon <span class="text-red-500">*</span></label>
              <select v-model="form.kategori" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="Perorangan">Perorangan</option>
                <option value="Lembaga/Organisasi">Lembaga / Organisasi</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">NIK / No. Identitas <span class="text-red-500">*</span></label>
              <input v-model="form.nik" type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan NIK">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
            <input v-model="form.nama" type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Sesuai KTP">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="email@contoh.com">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp <span class="text-red-500">*</span></label>
              <input v-model="form.no_hp" type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="08xxxxxxxxxx">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap <span class="text-red-500">*</span></label>
            <textarea v-model="form.alamat" required rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Alamat lengkap sesuai identitas"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Informasi yang Dibutuhkan <span class="text-red-500">*</span></label>
            <textarea v-model="form.rincian_informasi" required rows="4" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Jelaskan secara rinci informasi yang Anda butuhkan"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan Penggunaan Informasi <span class="text-red-500">*</span></label>
            <textarea v-model="form.tujuan_penggunaan" required rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Jelaskan untuk apa informasi tersebut digunakan"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cara Memperoleh Informasi</label>
              <select v-model="form.cara_memperoleh" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="Melihat/Membaca/Mendengarkan/Mencatat">Melihat / Membaca / Mencatat</option>
                <option value="Mendapatkan Salinan Hardcopy">Mendapatkan Salinan Hardcopy</option>
                <option value="Mendapatkan Salinan Softcopy">Mendapatkan Salinan Softcopy</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cara Mengirim Informasi</label>
              <select v-model="form.cara_mengirim" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="Mengambil Langsung">Mengambil Langsung</option>
                <option value="Email">Email</option>
                <option value="Kurir/Pos">Kurir / Pos</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Upload KTP/Identitas (Maks 2MB) <span class="text-red-500">*</span></label>
            <input @change="handleFileUpload" type="file" accept="image/*,.pdf" required class="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          </div>

          <div class="pt-4">
            <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center">
              <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              {{ loading ? 'Mengirim...' : 'Kirim Permohonan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'

const loading = ref(false)
const success = ref(false)
const trackingCode = ref('')
const fileInput = ref(null)

const initialFormState = {
  kategori: 'Perorangan',
  nik: '',
  nama: '',
  email: '',
  no_hp: '',
  alamat: '',
  rincian_informasi: '',
  tujuan_penggunaan: '',
  cara_memperoleh: 'Melihat/Membaca/Mendengarkan/Mencatat',
  cara_mengirim: 'Email',
}

const form = ref({ ...initialFormState })
let fileToUpload = null

const handleFileUpload = (event) => {
  fileToUpload = event.target.files[0]
}

const submitForm = async () => {
  loading.value = true
  const formData = new FormData()
  
  Object.keys(form.value).forEach(key => {
    formData.append(key, form.value[key])
  })
  
  if (fileToUpload) {
    formData.append('file_identitas', fileToUpload)
  }

  try {
    const res = await api.post('/permohonan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    success.value = true
    trackingCode.value = res.data.data.kode_registrasi || res.data.tracking_code || 'BERHASIL'
  } catch (error) {
    console.error('Error submitting form:', error)
    alert(error.response?.data?.message || 'Terjadi kesalahan saat mengirim formulir.')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = { ...initialFormState }
  fileToUpload = null
  success.value = false
  trackingCode.value = ''
}
</script>
