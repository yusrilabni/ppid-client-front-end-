<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const orgs = ref([])
const loading = ref(false)
const search = ref('')
const showModal = ref(false)
const form = ref({ name: '', alias: '', address: '', website: '', email: '' })

async function fetchOrgs() {
  loading.value = true
  try {
    const res = await api.get('/admin/organizations', { params: { search: search.value } })
    if (res.data?.success) {
      orgs.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function submitOrg() {
  if (!form.value.name) return
  try {
    const res = await api.post('/admin/organizations', form.value)
    if (res.data?.success) {
      showModal.value = false
      form.value = { name: '', alias: '', address: '', website: '', email: '' }
      fetchOrgs()
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan organisasi')
  }
}

async function deleteOrg(id) {
  if (!confirm('Yakin ingin menghapus unit organisasi / OPD ini?')) return
  try {
    await api.delete(`/admin/organizations/${id}`)
    fetchOrgs()
  } catch (e) {
    alert('Gagal menghapus')
  }
}

onMounted(() => fetchOrgs())
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-sitemap text-blue-600"></i> Unit Kerja & Organisasi (OPD)
        </h1>
        <p class="text-sm text-gray-500 mt-1">Kelola data Dinas, Badan, Kecamatan, dan Unit Pelaksana Teknis PPID Pelaksana</p>
      </div>
      <button @click="showModal = true" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
        <i class="fas fa-plus"></i> Tambah Unit Kerja
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
      <input v-model="search" @keyup.enter="fetchOrgs" placeholder="Cari nama dinas atau singkatan..." class="w-full md:w-80 px-4 py-2 bg-gray-50 border rounded-lg text-sm">
      <button @click="fetchOrgs" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Cari</button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 border-b text-gray-600 uppercase text-xs">
          <tr>
            <th class="py-3 px-4">Nama Unit Kerja / OPD</th>
            <th class="py-3 px-4">Singkatan</th>
            <th class="py-3 px-4">Website Resmi</th>
            <th class="py-3 px-4 text-center">Jabatan</th>
            <th class="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="loading"><td colspan="5" class="py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i> Memuat data OPD...</td></tr>
          <tr v-else-if="orgs.length === 0"><td colspan="5" class="py-8 text-center text-gray-400">Belum ada unit kerja.</td></tr>
          <tr v-for="org in orgs" :key="org.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 font-medium text-gray-800">{{ org.name }}</td>
            <td class="py-3 px-4 text-gray-600"><span class="px-2 py-0.5 bg-gray-100 rounded text-xs font-semibold">{{ org.alias || '-' }}</span></td>
            <td class="py-3 px-4 text-xs">
              <a v-if="org.website" :href="org.website" target="_blank" class="text-blue-600 underline">{{ org.website }}</a>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="py-3 px-4 text-center font-semibold text-xs text-blue-600">{{ org.positions_count || 0 }} Posisi</td>
            <td class="py-3 px-4 text-center">
              <button @click="deleteOrg(org.id)" class="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium"><i class="fas fa-trash"></i> Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tambah -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
        <h3 class="font-bold text-lg text-gray-800">Tambah Unit Kerja / OPD</h3>
        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Nama OPD *</label>
            <input v-model="form.name" type="text" placeholder="Dinas Komunikasi Informatika dan Persandian" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Singkatan / Alias</label>
            <input v-model="form.alias" type="text" placeholder="Diskominfo" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Alamat Kantor</label>
            <input v-model="form.address" type="text" placeholder="Jl. Persatuan Raya No. 1..." class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Website Resmi</label>
            <input v-model="form.website" type="text" placeholder="https://diskominfo.sinjaikab.go.id" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-3 border-t">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">Batal</button>
          <button @click="submitOrg" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>
