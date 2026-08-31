<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Edit Profil Pejabat</h1>
        <p class="text-sm text-gray-500 mt-2">Perbarui data profil, riwayat karir, dan penghargaan pimpinan daerah.</p>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl shadow-sm border border-red-100">
        {{ error }}
      </div>

      <div v-else-if="official" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        <!-- Tabs (Placeholder for now) -->
        <div class="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
          <button class="px-8 py-5 text-sm font-bold border-b-2 border-blue-600 text-blue-600 bg-blue-50/30 whitespace-nowrap">
            <i class="fas fa-user-circle mr-2"></i> Biodata Utama
          </button>
          <button class="px-8 py-5 text-sm font-bold text-gray-500 hover:text-gray-700 whitespace-nowrap opacity-50 cursor-not-allowed">
            <i class="fas fa-graduation-cap mr-2"></i> Pendidikan (Segera hadir)
          </button>
          <button class="px-8 py-5 text-sm font-bold text-gray-500 hover:text-gray-700 whitespace-nowrap opacity-50 cursor-not-allowed">
            <i class="fas fa-briefcase mr-2"></i> Karir (Segera hadir)
          </button>
        </div>

        <form @submit.prevent="handleSave" class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
              <input v-model="form.full_name" type="text" required class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">NIP</label>
              <input v-model="form.nip" type="text" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tempat Lahir</label>
              <input v-model="form.birth_place" type="text" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tanggal Lahir</label>
              <input v-model="form.birth_date" type="date" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Agama</label>
              <select v-model="form.religion" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                <option value="Islam">Islam</option>
                <option value="Kristen Protestan">Kristen Protestan</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jenis Kelamin</label>
              <select v-model="form.jenis_kelamin" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Biografi Singkat</label>
              <textarea v-model="form.biography" rows="4" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

          </div>

          <div class="pt-8 mt-8 border-t border-gray-100 flex justify-end gap-4">
            <button type="button" @click="router.back()" class="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700">
              Batal
            </button>
            <button type="submit" :disabled="saving" class="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200">
              <i v-if="saving" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const official = ref(null)

const form = ref({
  full_name: '',
  nip: '',
  birth_place: '',
  birth_date: '',
  religion: '',
  jenis_kelamin: '',
  biography: '',
  status: 'active'
})

onMounted(async () => {
  try {
    const res = await api.get(`/profil/pimpinan/${id}/edit`)
    if (res.data.success) {
      official.value = res.data.official
      
      // Populate form
      Object.keys(form.value).forEach(key => {
        if (official.value[key] !== undefined) {
          form.value[key] = official.value[key]
        }
      })
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengambil data pimpinan.'
  } finally {
    loading.value = false
  }
})

const handleSave = async () => {
  try {
    saving.value = true
    error.value = ''
    
    // We send data without relationships for now
    const formData = new FormData()
    formData.append('_method', 'POST')
    
    Object.keys(form.value).forEach(key => {
      formData.append(key, form.value[key] || '')
    })

    const res = await api.post(`/profil/pimpinan/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (res.data.success) {
      alert('Data Pimpinan berhasil diperbarui!')
      router.push(`/profil/${official.value.slug}`)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    saving.value = false
  }
}
</script>
