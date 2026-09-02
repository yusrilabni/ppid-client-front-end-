<template>
  <div class="p-6 pb-32">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/twibbon" class="text-gray-500 hover:text-blue-600 transition">
        <i class="fas fa-arrow-left text-xl"></i>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-800">Edit Twibbon</h1>
    </div>

    <div v-if="pageLoading" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex justify-center items-center">
      <i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full">
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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Custom Slug (URL) <span class="text-red-500">*</span></label>
            <div class="flex">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">/twibbon/</span>
              <input 
                v-model="form.slug" 
                type="text" 
                required
                class="flex-1 w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="contoh-slug-kustom"
              >
            </div>
            <p class="text-xs text-gray-500 mt-1">Hanya boleh berisi huruf, angka, dan strip (-).</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status Visibilitas <span class="text-red-500">*</span></label>
            <select 
              v-model="form.status" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            >
              <option value="public">🌐 Publik (Bisa diakses siapa saja)</option>
              <option value="private">🔒 Privat (Hanya untuk Admin)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ganti Frame Twibbon (Opsional)</label>
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
                  <input id="file-upload" type="file" class="sr-only" accept="image/*" @change="handleFileUpload">
                </label>
              </div>
              <p class="text-xs text-gray-500 mt-2">PNG, JPG maksimal 10MB. Biarkan kosong jika tidak ingin mengganti frame.</p>
            </div>
          </div>
          
          <div v-if="previewUrl" class="mt-4 p-4 border rounded-lg bg-gray-50 text-center">
            <p class="text-sm font-medium text-gray-700 mb-2">Preview Frame:</p>
            <img :src="previewUrl" alt="Preview" class="max-h-64 mx-auto object-contain shadow-sm rounded checkerboard">
          </div>
        </div>

        <div class="sticky bottom-0 bg-white border-t p-4 -mx-6 -mb-6 mt-6 flex justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-b-xl">
          <NuxtLink to="/admin/twibbon" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Batal</NuxtLink>
          <button 
            type="submit" 
            :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.checkerboard {
  background-image: 
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
    linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
    linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>

<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api, { getStorageUrl } from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const pageLoading = ref(true)
const loading = ref(false)
const isDragging = ref(false)
const form = ref({
  judul: '',
  slug: '',
  status: 'public',
  file: null
})
const previewUrl = ref(null)

onMounted(async () => {
  if (!authStore.isSuperAdmin) {
    router.push('/admin')
    return
  }
  await fetchTwibbon()
})

const fetchTwibbon = async () => {
  try {
    const res = await api.get(`/twibbon/${route.params.slug}`)
    const data = res.data?.data || res.data
    if (data) {
      form.value.judul = data.judul
      form.value.slug = data.slug
      form.value.status = data.status || 'public'
      if (data.file_path) {
        previewUrl.value = getStorageUrl(data.file_path)
      }
    }
  } catch (error) {
    console.error(error)
    alert('Twibbon tidak ditemukan')
    router.push('/admin/twibbon')
  } finally {
    pageLoading.value = false
  }
}

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
  if (!form.value.judul || !form.value.slug) return
  
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('judul', form.value.judul)
    formData.append('slug', form.value.slug)
    formData.append('status', form.value.status)
    if (form.value.file) {
      formData.append('file', form.value.file)
    }

    await api.post(`/twibbon/${route.params.slug}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    router.push({ path: '/admin/twibbon', query: { success: 'updated' } })
  } catch (error) {
    console.error('Update error:', error)
    alert(error.response?.data?.message || 'Gagal memperbarui twibbon')
  } finally {
    loading.value = false
  }
}
</script>
