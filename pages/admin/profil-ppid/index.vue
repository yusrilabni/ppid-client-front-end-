<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(false)
const saving = ref(false)
const alertMsg = ref('')
const form = ref({
  visi: '',
  misi: '',
  tugas_fungsi: '',
  struktur_organisasi: '',
  file_sk: null,
  file_struktur: null,
  sk_ppid: '',
  bagan_struktur: ''
})

async function fetchProfile() {
  loading.value = true
  try {
    const res = await api.get('/admin/profil-ppid')
    if (res.data?.success && res.data.data) {
      const d = res.data.data
      form.value.visi = d.visi || ''
      form.value.misi = d.misi || ''
      form.value.tugas_fungsi = d.tugas_fungsi || ''
      form.value.struktur_organisasi = d.struktur_organisasi || ''
      form.value.sk_ppid = d.sk_ppid || ''
      form.value.bagan_struktur = d.bagan_struktur || ''
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  const fd = new FormData()
  fd.append('visi', form.value.visi)
  fd.append('misi', form.value.misi)
  fd.append('tugas_fungsi', form.value.tugas_fungsi)
  fd.append('struktur_organisasi', form.value.struktur_organisasi)
  if (form.value.file_sk) fd.append('file_sk', form.value.file_sk)
  if (form.value.file_struktur) fd.append('file_struktur', form.value.file_struktur)

  try {
    const res = await api.post('/admin/profil-ppid', fd)
    if (res.data?.success) {
      alertMsg.value = 'Profil PPID berhasil diperbarui!'
      fetchProfile()
      setTimeout(() => alertMsg.value = '', 3000)
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan profil')
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchProfile())
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-id-card text-blue-600"></i> Profil PPID Sinjai
        </h1>
        <p class="text-sm text-gray-500 mt-1">Kelola Visi, Misi, Tugas & Fungsi, SK PPID, dan Struktur Organisasi PPID</p>
      </div>
      <button @click="saveProfile" :disabled="saving" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
        <i v-if="saving" class="fas fa-spinner fa-spin"></i>
        <i v-else class="fas fa-save"></i> Simpan Perubahan
      </button>
    </div>

    <div v-if="alertMsg" class="p-4 bg-green-50 text-green-800 rounded-xl text-sm border border-green-200">{{ alertMsg }}</div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h2 class="font-bold text-gray-800 text-base border-b pb-2">Visi & Misi</h2>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Visi PPID</label>
          <textarea v-model="form.visi" rows="3" class="w-full p-3 bg-gray-50 border rounded-xl text-sm"></textarea>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Misi PPID</label>
          <textarea v-model="form.misi" rows="6" class="w-full p-3 bg-gray-50 border rounded-xl text-sm"></textarea>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h2 class="font-bold text-gray-800 text-base border-b pb-2">Tugas, Fungsi & SK</h2>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Tugas & Fungsi PPID</label>
          <textarea v-model="form.tugas_fungsi" rows="5" class="w-full p-3 bg-gray-50 border rounded-xl text-sm"></textarea>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Upload SK PPID Baru (PDF)</label>
          <input type="file" @change="e => form.file_sk = e.target.files[0]" class="w-full text-xs text-gray-500">
          <p v-if="form.sk_ppid" class="text-xs text-blue-600 mt-1">
            <a :href="`https://ppidkab.sinjaikab.go.id/storage/${form.sk_ppid}`" target="_blank" class="underline">Lihat Dokumen SK Terpasang</a>
          </p>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Upload Bagan Struktur (Gambar / PDF)</label>
          <input type="file" @change="e => form.file_struktur = e.target.files[0]" class="w-full text-xs text-gray-500">
          <p v-if="form.bagan_struktur" class="text-xs text-blue-600 mt-1">
            <a :href="`https://ppidkab.sinjaikab.go.id/storage/${form.bagan_struktur}`" target="_blank" class="underline">Lihat Bagan Struktur Terpasang</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
