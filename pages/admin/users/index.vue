<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const users = ref([])
const loading = ref(false)
const search = ref('')
const showModal = ref(false)
const form = ref({ name: '', email: '', role: 'opd', nip: '', password: '' })

async function fetchUsers() {
  loading.value = true
  try {
    const res = await api.get('/admin/users', { params: { search: search.value } })
    if (res.data?.success) {
      users.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function submitUser() {
  if (!form.value.name || !form.value.email || !form.value.password) {
    alert('Nama, email, dan password wajib diisi!')
    return
  }
  try {
    const res = await api.post('/admin/users', form.value)
    if (res.data?.success) {
      showModal.value = false
      form.value = { name: '', email: '', role: 'opd', nip: '', password: '' }
      fetchUsers()
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menambahkan user')
  }
}

async function deleteUser(id) {
  if (!confirm('Yakin ingin menghapus pengguna ini?')) return
  try {
    await api.delete(`/admin/users/${id}`)
    fetchUsers()
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menghapus user')
  }
}

onMounted(() => fetchUsers())
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-users-cog text-blue-600"></i> Manajemen Pengguna & Hak Akses
        </h1>
        <p class="text-sm text-gray-500 mt-1">Kelola akun Admin Utama, Petugas PPID Pelaksana (OPD), dan Tingkat Otoritas</p>
      </div>
      <button @click="showModal = true" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
        <i class="fas fa-user-plus"></i> Tambah Pengguna
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
      <input v-model="search" @keyup.enter="fetchUsers" placeholder="Cari nama, email atau NIP pengguna..." class="w-full md:w-80 px-4 py-2 bg-gray-50 border rounded-lg text-sm">
      <button @click="fetchUsers" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Cari</button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 border-b text-gray-600 uppercase text-xs">
          <tr>
            <th class="py-3 px-4">Nama Lengkap</th>
            <th class="py-3 px-4">Email</th>
            <th class="py-3 px-4">Role / Peran</th>
            <th class="py-3 px-4">Unit / OPD</th>
            <th class="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="loading"><td colspan="5" class="py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i> Memuat data user...</td></tr>
          <tr v-else-if="users.length === 0"><td colspan="5" class="py-8 text-center text-gray-400">Pengguna tidak ditemukan.</td></tr>
          <tr v-for="u in users" :key="u.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 font-semibold text-gray-800">{{ u.name }}</td>
            <td class="py-3 px-4 text-gray-600 text-xs">{{ u.email }}</td>
            <td class="py-3 px-4">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold uppercase"
                :class="{
                  'bg-purple-100 text-purple-700': u.role === 'superadmin',
                  'bg-blue-100 text-blue-700': u.role === 'admin',
                  'bg-emerald-100 text-emerald-700': u.role === 'opd',
                  'bg-gray-100 text-gray-700': !['superadmin', 'admin', 'opd'].includes(u.role)
                }">
                {{ u.role }}
              </span>
            </td>
            <td class="py-3 px-4 text-gray-500 text-xs">{{ u.unit?.name || '-' }}</td>
            <td class="py-3 px-4 text-center">
              <button @click="deleteUser(u.id)" class="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold">
                <i class="fas fa-trash"></i> Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Tambah -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
        <h3 class="font-bold text-lg text-gray-800">Tambah Akun Pengguna</h3>
        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
            <input v-model="form.name" type="text" placeholder="Nama Operator / Admin" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
            <input v-model="form.email" type="email" placeholder="admin@sinjaikab.go.id" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">NIP (Optional)</label>
            <input v-model="form.nip" type="text" placeholder="198xxxx..." class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Hak Akses / Role *</label>
            <select v-model="form.role" class="w-full p-2 bg-gray-50 border rounded-lg">
              <option value="opd">Admin OPD (PPID Pelaksana)</option>
              <option value="admin">Admin PPID Utama</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
            <input v-model="form.password" type="password" placeholder="Minimal 6 karakter" class="w-full p-2 bg-gray-50 border rounded-lg">
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-3 border-t">
          <button @click="showModal = false" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">Batal</button>
          <button @click="submitUser" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>
