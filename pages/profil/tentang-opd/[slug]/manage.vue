<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <Breadcrumbs :breadcrumbs="breadcrumbsList" />
      
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight">Kelola Profil OPD</h1>
          <p class="text-sm text-gray-500 mt-2">Kelola gambar struktur dan tautan website OPD.</p>
        </div>
        <button type="button" @click="router.back()" class="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50">
          <i class="fas fa-arrow-left mr-2"></i> Kembali
        </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl shadow-sm border border-red-100">
        {{ error }}
      </div>

      <div v-else-if="organization" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl mx-auto">
        <div class="p-8 md:p-10">
          <form @submit.prevent="handleSave">
            
            <!-- Structure Image Upload -->
            <div class="mb-8">
                <label class="block text-gray-900 font-bold mb-3">Gambar Tentang OPD (.jpg, .png, .webp)</label>
                
                <div 
                    class="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                    @click="triggerImageUpload"
                >
                    <input 
                        type="file" 
                        id="structure_image" 
                        class="hidden" 
                        accept="image/*" 
                        @change="handleImageChange"
                    >
                    
                    <div v-if="imagePreview" class="flex flex-col items-center">
                        <img :src="imagePreview" class="max-h-64 object-contain rounded-xl mb-4 border border-gray-200 shadow-sm" />
                        <span class="text-sm font-bold text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-200">
                            <i class="fas fa-check-circle mr-1"></i> File Siap Diunggah
                        </span>
                    </div>
                    <div v-else-if="struktur?.image_path" class="flex flex-col items-center">
                        <img :src="getStorageUrl(struktur.image_path)" class="max-h-64 object-contain rounded-xl mb-4 border border-gray-200 shadow-sm" />
                        <span class="text-sm text-gray-500">
                            <i class="fas fa-image mb-2 text-2xl block text-gray-300"></i>
                            Klik untuk mengganti gambar struktur
                        </span>
                    </div>
                    <div v-else class="flex flex-col items-center justify-center">
                        <i class="fas fa-cloud-upload-alt text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-900 font-bold">Pilih file untuk diupload</p>
                        <p class="text-gray-500 text-sm mt-1">Maksimal 10MB</p>
                    </div>
                </div>
            </div>

            <!-- Website URL Input -->
            <div class="mb-8">
                <label class="block text-gray-900 font-bold mb-3">Link Website OPD (Opsional)</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="fas fa-link text-gray-400"></i>
                    </div>
                    <input 
                        v-model="form.website_url" 
                        type="url" 
                        class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-gray-900" 
                        placeholder="https://www.example.com"
                    >
                </div>
                <p class="mt-2 text-sm text-gray-500">Masukkan URL lengkap website resmi OPD (misal: https://sinjaikab.go.id)</p>
            </div>

            <!-- Save Button -->
            <div class="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <NuxtLink :to="`/profil/tentang-opd/${organization.slug}`" class="px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors">
                    Batal
                </NuxtLink>
                <button type="submit" :disabled="saving" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center disabled:opacity-75 disabled:cursor-not-allowed">
                    <i class="fas fa-spinner fa-spin mr-2" v-if="saving"></i>
                    <i class="fas fa-save mr-2" v-else></i>
                    {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { getStorageUrl } from '@/services/api'
import { getBreadcrumbs } from '@/config/breadcrumbs'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const loading = ref(true)
const saving = ref(false)
const error = ref('')

const organization = ref(null)
const struktur = ref(null)

const form = ref({
    website_url: ''
})

const imagePreview = ref(null)

const breadcrumbsList = computed(() => getBreadcrumbs.manageTentangOpd({ organization: organization.value }))

const triggerImageUpload = () => {
    document.getElementById('structure_image').click()
}

const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran file maksimal 10MB')
            e.target.value = ''
            return
        }
        imagePreview.value = URL.createObjectURL(file)
    }
}

onMounted(async () => {
    try {
        const res = await api.get(`/profil/kelola-opd/${slug}/edit`)
        if (res.data.success) {
            organization.value = res.data.organization
            struktur.value = res.data.struktur
            form.value.website_url = res.data.organization.website_url || ''
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'Gagal memuat data OPD.'
    } finally {
        loading.value = false
    }
})

const handleSave = async () => {
    try {
        saving.value = true
        error.value = ''
        
        const formData = new FormData()
        
        formData.append('website_url', form.value.website_url || '')
        
        const fileInput = document.getElementById('structure_image')
        if (fileInput && fileInput.files[0]) {
            formData.append('structure_image', fileInput.files[0])
        }

        const res = await api.post(`/profil/kelola-opd/${slug}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (res.data.success) {
            alert('Profil OPD berhasil diperbarui!')
            router.push(`/profil/tentang-opd/${organization.value.slug}`)
        }
    } catch (err) {
        error.value = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
        saving.value = false
    }
}
</script>
