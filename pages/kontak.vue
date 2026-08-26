<template>
  <div class="kontak-page">
    <PageHeader title="Hubungi Kami" />
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <Breadcrumbs :breadcrumbs="getBreadcrumbs.kontak()" class="mb-6" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        <!-- Info Kontak -->
        <div class="space-y-8">
          <div v-if="loading" class="space-y-4">
            <LoadingSkeleton class="h-32 w-full" />
            <LoadingSkeleton class="h-32 w-full" />
            <LoadingSkeleton class="h-32 w-full" />
          </div>
          <template v-else>
            <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Alamat</h3>
                <p class="text-gray-600">{{ settings.address || 'Kompleks Kantor Bupati Sinjai, Sulawesi Selatan' }}</p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <i class="fas fa-phone"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Telepon / WhatsApp</h3>
                <p class="text-gray-600">{{ settings.phone || '(0482) 21000' }}</p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <i class="fas fa-envelope"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Email</h3>
                <p class="text-gray-600">{{ settings.email || 'ppid@sinjaikab.go.id' }}</p>
              </div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                <i class="fas fa-clock"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Jam Pelayanan</h3>
                <p class="text-gray-600">Senin - Kamis: 08.00 - 16.00 WITA</p>
                <p class="text-gray-600">Jumat: 08.00 - 16.30 WITA</p>
              </div>
            </div>
          </template>
        </div>

        <!-- Form Pesan -->
        <div class="bg-white p-8 rounded-xl shadow-lg border">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h2>
          <div v-if="success" class="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-200">
            Pesan Anda berhasil dikirim. Kami akan segera meresponnya.
          </div>
          <form @submit.prevent="submitPesan" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input v-model="form.name" type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
              <input v-model="form.subject" type="text" required class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
              <textarea v-model="form.message" required rows="5" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button type="submit" :disabled="submitting" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center">
              <span v-if="submitting" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
      
      <!-- Peta -->
      <div class="mt-12 bg-white rounded-xl shadow-lg p-2 h-96 overflow-hidden">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.344474776114!2d120.2483861!3d-5.2676011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbc3c9a42f63f5f%3A0xc3f345eb651147a5!2sKantor%20Bupati%20Sinjai!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import { getBreadcrumbs } from '@/config/breadcrumbs'

import { ref, onMounted } from 'vue'
import api from '@/services/api'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'

const settings = ref({})
const loading = ref(true)
const submitting = ref(false)
const success = ref(false)

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

onMounted(async () => {
  try {
    const res = await api.get('/settings')
    settings.value = res.data.data
  } catch (error) {
    console.error('Error fetching settings:', error)
  } finally {
    loading.value = false
  }
})

const submitPesan = async () => {
  submitting.value = true
  try {
    await api.post('/pesan', form.value)
    success.value = true
    form.value = { name: '', email: '', subject: '', message: '' }
    setTimeout(() => success.value = false, 5000)
  } catch (error) {
    console.error('Error sending message:', error)
    alert('Terjadi kesalahan saat mengirim pesan.')
  } finally {
    submitting.value = false
  }
}
</script>

