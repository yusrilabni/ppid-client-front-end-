<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const officials = ref([])
const loading = ref(false)
const search = ref('')
const showModal = ref(false)
const form = ref({ name: '', position: '', nip: '', order: 0, photo: null })

async function fetchOfficials() {
  loading.value = true
  try {
    const res = await api.get('/admin/officials', { params: { search: search.value } })
    if (res.data?.success) {
      officials.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function submitOfficial() {
  if (!form.value.name || !form.value.position) return
  const fd = new FormData()
  fd.append('name', form.value.name)
  fd.append('position', form.value.position)
  if (form.value.nip) fd.append('nip', form.value.nip)
  fd.append('order', form.value.order || 0)
  if (form.value.photo) fd.append('photo', form.value.photo)

  try {
    const res = await api.post('/admin/officials', fd)
    if (res.data?.success) {
      showModal.value = false
      form.value = { name: '', position: '', nip: '', order: 0, photo: null }
      fetchOfficials()
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan profil pimpinan')
  }
}

async function deleteOfficial(id) {
  if (!confirm('Yakin ingin menghapus data pejabat ini?')) return
  try {
    await api.delete(`/admin/officials/${id}`)
    fetchOfficials()
  } catch (e) {
    alert('Gagal menghapus')
  }
}

onMounted(() => fetchOfficials())
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-user-tie text-blue-600"></i> Profil Pimpinan & LHKPN
        </h1>
        <p class="text-sm text-gray-500 mt-1">Kelola data pimpinan daerah, pejabat struktural, dan integrasi LHKPN</p>
      </div>
      <button @click="showModal = true" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
        <i class="fas fa-plus"></i> Tambah Pejabat
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
      <input v-model="search" @keyup.enter="fetchOfficials" placeholder="Cari nama atau jabatan pejabat..." class="w-full md:w-80 px-4 py-2 bg-gray-50 border rounded-lg text-sm">
      <button @click="fetchOfficials" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Cari</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="loading" class="col-span-full py-12 text-center text-gray-400">
        <i class="fas fa-spinner fa-spin mr-2"></i> Memuat data pimpinan...
      </div>
      <div v-else-if="officials.length === 0" class="col-span-full py-12 text-center text-gray-400">
        Belum ada profil pimpinan.
      </div>
      <div v-for="off in officials" :key="off.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
        <div class="flex items-start gap-4">
          <img :src="off.photo ? `https://ppidkab.sinjaikab.go.id/storage/${off.photo}` : '/images/avatar-default.png'" class="w-16 h-16 rounded-xl object-cover bg-gray-100">
          <div>
            <h3 class="font-bold text-gray-800 text-sm">{{ off.name }}</h3>
            <p class="text-xs text-blue-600 font-semibold">{{ off.position }}</p>
            <p v-if="off.nip" class="text-xs text-gray-400 mt-1">NIP: {{ off.nip }}</p>
            <span class="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700">
              {{ off.lhkpn_list?.length || 0 }} Riwayat LHKPN
            </span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t flex justify-end gap-2">
          <button @click="deleteOfficial(off.id)" class="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold">
            <i class="fas fa-trash mr-1"></i> Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
        <h3 class="font-bold text-lg text-gray-800">Tambah Profil Pimpinan</h3>
        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap & Gelar *</label>
            <input v-model="form.name" type="text" placeholder="Contoh: Andi Jefrianto Asapa, S.Sos., M.Si." class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Jabatan *</label>
            <input v-model="form.position" type="text" placeholder="Contoh: Pj. Bupati Sinjai" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">NIP</label>
            <input v-model="form.nip" type="text" placeholder="197xxxx..." class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Foto Pejabat</label>
            <input type="file" @change="e => form.photo = e.target.files[0]" class="w-full text-xs text-gray-500">
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-3 border-t">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">Batal</button>
          <button @click="submitOfficial" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>
