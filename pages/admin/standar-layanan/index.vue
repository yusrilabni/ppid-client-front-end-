<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const items = ref([])
const categories = ref([])
const loading = ref(false)
const search = ref('')
const showModal = ref(false)
const form = ref({ standar_layanan_id: '', nama: '', deskripsi: '', file: null })
const alertMsg = ref('')

async function fetchData() {
  loading.value = true
  try {
    const res = await api.get('/admin/standar-layanan', { params: { search: search.value } })
    if (res.data?.success) {
      items.value = res.data.data.data || []
      categories.value = res.data.categories || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function handleFile(e) {
  form.value.file = e.target.files[0]
}

async function submitForm() {
  if (!form.value.nama || !form.value.standar_layanan_id) return
  const fd = new FormData()
  fd.append('standar_layanan_id', form.value.standar_layanan_id)
  fd.append('nama', form.value.nama)
  if (form.value.deskripsi) fd.append('deskripsi', form.value.deskripsi)
  if (form.value.file) fd.append('file', form.value.file)

  try {
    const res = await api.post('/admin/standar-layanan', fd)
    if (res.data?.success) {
      alertMsg.value = 'Standar layanan berhasil ditambahkan!'
      showModal.value = false
      form.value = { standar_layanan_id: '', nama: '', deskripsi: '', file: null }
      fetchData()
      setTimeout(() => alertMsg.value = '', 3000)
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan')
  }
}

async function deleteItem(id) {
  if (!confirm('Yakin ingin menghapus dokumen standar layanan ini?')) return
  try {
    await api.delete(`/admin/standar-layanan/${id}`)
    fetchData()
  } catch (e) {
    alert('Gagal menghapus')
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-book-open text-blue-600"></i> Standar Layanan
        </h1>
        <p class="text-sm text-gray-500 mt-1">Kelola Maklumat, Prosedur/SOP, Biaya, dan Waktu Pelayanan Informasi Publik</p>
      </div>
      <button @click="showModal = true" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
        <i class="fas fa-plus"></i> Tambah Dokumen
      </button>
    </div>

    <div v-if="alertMsg" class="p-4 bg-green-50 text-green-800 rounded-xl text-sm border border-green-200">{{ alertMsg }}</div>

    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
      <input v-model="search" @keyup.enter="fetchData" placeholder="Cari dokumen standar layanan..." class="w-full md:w-80 px-4 py-2 bg-gray-50 border rounded-lg text-sm">
      <button @click="fetchData" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Cari</button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 border-b text-gray-600 uppercase text-xs">
          <tr>
            <th class="py-3 px-4">Nama Dokumen</th>
            <th class="py-3 px-4">Kategori Standar</th>
            <th class="py-3 px-4">Berkas</th>
            <th class="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="loading"><td colspan="4" class="py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i> Memuat...</td></tr>
          <tr v-else-if="items.length === 0"><td colspan="4" class="py-8 text-center text-gray-400">Belum ada dokumen standar layanan.</td></tr>
          <tr v-for="it in items" :key="it.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 font-medium text-gray-800">{{ it.nama }}</td>
            <td class="py-3 px-4 text-gray-600"><span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{{ it.standar_layanan?.nama || 'Umum' }}</span></td>
            <td class="py-3 px-4">
              <a v-if="it.file_path" :href="`https://ppidkab.sinjaikab.go.id/storage/${it.file_path}`" target="_blank" class="text-blue-600 text-xs underline"><i class="fas fa-file-pdf mr-1"></i>Lihat PDF</a>
              <span v-else class="text-gray-400 text-xs">Tidak ada file</span>
            </td>
            <td class="py-3 px-4 text-center">
              <button @click="deleteItem(it.id)" class="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium"><i class="fas fa-trash"></i> Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tambah -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
        <h3 class="font-bold text-lg text-gray-800">Tambah Standar Layanan</h3>
        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Kategori Standar *</label>
            <select v-model="form.standar_layanan_id" class="w-full p-2 bg-gray-50 border rounded-lg">
              <option value="">Pilih Kategori</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nama }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Nama Dokumen / SOP *</label>
            <input v-model="form.nama" type="text" placeholder="Contoh: Maklumat Pelayanan PPID 2026" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
            <textarea v-model="form.deskripsi" rows="2" class="w-full p-2 bg-gray-50 border rounded-lg"></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Upload Berkas PDF</label>
            <input type="file" @change="handleFile" class="w-full text-xs text-gray-500">
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-3 border-t">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">Batal</button>
          <button @click="submitForm" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>
