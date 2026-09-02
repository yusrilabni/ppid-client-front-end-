<template>
  <div class="p-6 pb-32">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/twibbon" class="text-gray-500 hover:text-blue-600 transition">
        <i class="fas fa-arrow-left text-xl"></i>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-800">Tambah Twibbon Baru</h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full">
      <form @submit.prevent="submitTwibbon" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Judul Twibbon <span class="text-red-500">*</span></label>
          <input 
            v-model="form.judul" 
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Contoh: Hari Kemerdekaan RI ke-79"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Frame Twibbon (PNG transparan) <span class="text-red-500">*</span></label>
          <div 
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors bg-gray-50 relative"
            :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <div class="space-y-1 text-center pointer-events-none">
              <i class="fas fa-image text-3xl mb-3" :class="isDragging ? 'text-blue-500' : 'text-gray-400'"></i>
              <div class="flex text-sm text-gray-600 justify-center pointer-events-auto">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-2 py-1 shadow-sm border border-blue-100">
                  <span>Pilih File atau Tarik (Drag & Drop) Kesini</span>
                  <input id="file-upload" type="file" class="sr-only" accept="image/*" @change="handleFileUpload" :required="!form.file">
                </label>
              </div>
              <p class="text-xs text-gray-500 mt-2">PNG, JPG maksimal 10MB (Otomatis dikonversi ke WebP)</p>
            </div>
          </div>
          
          <div v-if="previewUrl" class="mt-4 p-4 border rounded-lg bg-gray-50 text-center">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview Frame:</p>
            <img :src="previewUrl" alt="Preview" class="max-h-64 mx-auto object-contain shadow-sm rounded">
          </div>
        </div>

        <div class="flex justify-end pt-6 mt-4 border-t pb-2">
          <NuxtLink to="/admin/twibbon" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3 hover:bg-gray-50 transition">Batal</NuxtLink>
          <button 
            type="submit" 
            :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Menyimpan...' : 'Simpan Twibbon' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const isDragging = ref(false)
const form = ref({
  judul: '',
  file: null
})
const previewUrl = ref(null)

onMounted(() => {
  if (!authStore.isSuperAdmin) {
    router.push('/admin')
  }
})

const handleFileUpload = (e) => {
  processFile(e.target.files[0])
}

const handleDrop = (e) => {
  isDragging.value = false
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processFile(e.dataTransfer.files[0])
  }
}

const processFile = (file) => {
  if (file && file.type.startsWith('image/')) {
    form.value.file = file
    previewUrl.value = URL.createObjectURL(file)
  } else if (file) {
    alert('Harap unggah file gambar yang valid.')
  }
}

const submitTwibbon = async () => {
  if (!form.value.file || !form.value.judul) return
  
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('judul', form.value.judul)
    formData.append('file', form.value.file)

    await api.post('/twibbon', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    alert('Twibbon berhasil ditambahkan!')
    router.push('/admin/twibbon')
  } catch (error) {
    console.error('Upload error:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan twibbon')
  } finally {
    loading.value = false
  }
}
</script>
