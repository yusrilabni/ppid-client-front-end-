<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const sliders = ref([])
const loading = ref(false)
const showModal = ref(false)
const form = ref({ title: '', subtitle: '', link: '', order: 0, image: null })

async function fetchSliders() {
  loading.value = true
  try {
    const res = await api.get('/admin/sliders')
    if (res.data?.success) {
      sliders.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function submitSlider() {
  if (!form.value.title || !form.value.image) {
    alert('Judul dan file gambar banner wajib diisi!')
    return
  }
  const fd = new FormData()
  fd.append('title', form.value.title)
  if (form.value.subtitle) fd.append('subtitle', form.value.subtitle)
  if (form.value.link) fd.append('link', form.value.link)
  fd.append('order', form.value.order || 0)
  fd.append('image', form.value.image)

  try {
    const res = await api.post('/admin/sliders', fd)
    if (res.data?.success) {
      showModal.value = false
      form.value = { title: '', subtitle: '', link: '', order: 0, image: null }
      fetchSliders()
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan banner')
  }
}

async function deleteSlider(id) {
  if (!confirm('Hapus banner slider ini?')) return
  try {
    await api.delete(`/admin/sliders/${id}`)
    fetchSliders()
  } catch (e) {
    alert('Gagal menghapus')
  }
}

onMounted(() => fetchSliders())
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-sliders-h text-blue-600"></i> Sliders / Banner Beranda
        </h1>
        <p class="text-sm text-gray-500 mt-1">Kelola gambar slide carousel promosi di halaman utama portal PPID</p>
      </div>
      <button @click="showModal = true" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
        <i class="fas fa-plus"></i> Tambah Banner
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="loading" class="col-span-full py-12 text-center text-gray-400">
        <i class="fas fa-spinner fa-spin mr-2"></i> Memuat banner...
      </div>
      <div v-else-if="sliders.length === 0" class="col-span-full py-12 text-center text-gray-400">
        Belum ada slider yang aktif.
      </div>
      <div v-for="sl in sliders" :key="sl.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <img :src="`https://ppidkab.sinjaikab.go.id/storage/${sl.image}`" class="w-full h-44 object-cover bg-gray-100">
        <div class="p-4 flex-1">
          <h3 class="font-bold text-gray-800 text-sm line-clamp-1">{{ sl.title }}</h3>
          <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ sl.subtitle || 'Tanpa subjudul' }}</p>
        </div>
        <div class="p-4 pt-0 flex justify-between items-center border-t mt-3 pt-3">
          <span class="text-xs text-gray-400">Urutan: #{{ sl.order }}</span>
          <button @click="deleteSlider(sl.id)" class="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold">
            <i class="fas fa-trash mr-1"></i> Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
        <h3 class="font-bold text-lg text-gray-800">Tambah Banner Beranda</h3>
        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Judul Banner *</label>
            <input v-model="form.title" type="text" placeholder="Layanan Informasi Publik Cepat & Akurat" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Subjudul / Keterangan</label>
            <input v-model="form.subtitle" type="text" placeholder="Menuju Sinjai yang lebih transparan..." class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Tautan URL (Optional)</label>
            <input v-model="form.link" type="text" placeholder="https://..." class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">File Gambar Banner (Landscape) *</label>
            <input type="file" @change="e => form.image = e.target.files[0]" class="w-full text-xs text-gray-500">
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-3 border-t">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">Batal</button>
          <button @click="submitSlider" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>
