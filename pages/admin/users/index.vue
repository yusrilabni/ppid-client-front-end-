<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const users = ref([])
const loading = ref(false)
const search = ref('')
const selectedRole = ref('')
const alertMsg = ref('')

const roleFilterOptions = [
  { value: '', label: 'Semua Peran / Otoritas' },
  { value: 'superadmin', label: 'Super Administrator', badge: 'Superadmin' },
  { value: 'admin', label: 'Administrator PPID', badge: 'Admin' },
  { value: 'opd', label: 'Petugas PPID Pelaksana (OPD)', badge: 'OPD' },
  { value: 'user', label: 'Pemohon / Pengguna Biasa', badge: 'User' }
]

async function fetchUsers() {
  loading.value = true
  try {
    const params = {}
    if (search.value) params.search = search.value
    if (selectedRole.value) params.role = selectedRole.value

    const res = await api.get('/admin/users', { params })
    if (res.data?.success) {
      users.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function deleteUser(u) {
  if (!confirm(`Hapus permanen akun pengguna: "${u.name}" (${u.email})?`)) return
  try {
    const res = await api.delete(`/admin/users/${u.id}`)
    if (res.data?.success) {
      alertMsg.value = `Akun ${u.name} berhasil dihapus.`
      fetchUsers()
      setTimeout(() => alertMsg.value = '', 4000)
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menghapus pengguna')
  }
}

function getRoleBadge(role) {
  switch (role) {
    case 'superadmin':
      return { class: 'bg-purple-100 text-purple-700 border-purple-200', label: 'Super Admin', icon: 'fas fa-shield-halved' }
    case 'admin':
      return { class: 'bg-sky-100 text-sky-700 border-sky-200', label: 'PPID Admin', icon: 'fas fa-user-shield' }
    case 'opd':
      return { class: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Admin OPD', icon: 'fas fa-building' }
    default:
      return { class: 'bg-gray-100 text-gray-700 border-gray-200', label: role, icon: 'fas fa-user' }
  }
}

onMounted(() => fetchUsers())
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-purple-200">
          <i class="fas fa-users-gear"></i> Autentikasi & Otoritas Sistem
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Manajemen Pengguna & Akun</h1>
        <p class="text-sm text-purple-200/80 max-w-2xl leading-relaxed">
          Kelola hak akses Superadmin, Administrator Utama PPID Sinjai, dan Akun Petugas PPID Pelaksana tiap Perangkat Daerah (OPD).
        </p>
      </div>

      <!-- Action Button to Dedicated Create Page -->
      <NuxtLink
        to="/admin/users/create"
        class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
      >
        <i class="fas fa-user-plus text-base"></i>
        <span>Tambah Pengguna Baru</span>
      </NuxtLink>
    </div>

    <!-- Alert Message -->
    <div v-if="alertMsg" class="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm font-semibold border border-emerald-200 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="fas fa-check-circle text-emerald-600"></i>
        <span>{{ alertMsg }}</span>
      </div>
      <button @click="alertMsg = ''" class="text-emerald-600 hover:text-emerald-800"><i class="fas fa-times"></i></button>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 max-w-2xl">
        <div class="relative flex-1">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            v-model="search"
            @keyup.enter="fetchUsers"
            type="text"
            placeholder="Cari berdasarkan nama lengkap, NIP, atau email..."
            class="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all duration-200"
          />
        </div>

        <div class="w-full sm:w-64">
          <CustomSelect
            v-model="selectedRole"
            :options="roleFilterOptions"
            placeholder="Filter Role"
          />
        </div>
      </div>

      <button
        @click="fetchUsers"
        class="w-full md:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
      >
        <i class="fas fa-filter"></i>
        <span>Terapkan</span>
      </button>
    </div>

    <!-- Users Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th class="py-4 px-6">Identitas Pengguna</th>
              <th class="py-4 px-6">Peran / Otoritas</th>
              <th class="py-4 px-6">Unit OPD Penugasan</th>
              <th class="py-4 px-6 text-center">Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-normal">
            <tr v-if="loading">
              <td colspan="4" class="py-16 text-center text-gray-400">
                <i class="fas fa-circle-notch fa-spin text-2xl text-purple-600 mb-2"></i>
                <p class="font-medium text-xs">Memuat daftar pengguna...</p>
              </td>
            </tr>

            <tr v-else-if="users.length === 0">
              <td colspan="4" class="py-16 text-center text-gray-400">
                <i class="fas fa-user-slash text-3xl text-gray-300 mb-2"></i>
                <p class="font-medium">Tidak ada akun pengguna yang sesuai.</p>
              </td>
            </tr>

            <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100 flex-shrink-0">
                    {{ u.name ? u.name.charAt(0).toUpperCase() : 'U' }}
                  </div>
                  <div>
                    <div class="font-bold text-gray-900">{{ u.name }}</div>
                    <div class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span><i class="fas fa-envelope text-[10px] text-gray-400 mr-1"></i>{{ u.email }}</span>
                      <span v-if="u.nip" class="text-gray-400">• NIP: {{ u.nip }}</span>
                    </div>
                  </div>
                </div>
              </td>

              <td class="py-4 px-6">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  :class="getRoleBadge(u.role).class"
                >
                  <i :class="getRoleBadge(u.role).icon"></i>
                  <span>{{ getRoleBadge(u.role).label }}</span>
                </span>
              </td>

              <td class="py-4 px-6">
                <div v-if="u.unit" class="text-xs text-gray-700 font-medium flex items-center gap-1.5">
                  <i class="fas fa-landmark text-gray-400"></i>
                  <span>{{ u.unit.name }}</span>
                </div>
                <div v-else class="text-xs text-gray-400 italic">
                  Tidak terikat OPD khusus (Global)
                </div>
              </td>

              <td class="py-4 px-6 text-center">
                <div class="inline-flex items-center gap-2">
                  <NuxtLink
                    :to="`/admin/users/${u.id}/edit`"
                    class="p-2.5 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-xl transition-all border border-gray-100"
                    title="Edit Profil & Hak Akses"
                  >
                    <i class="fas fa-user-pen text-xs"></i>
                  </NuxtLink>
                  <button
                    @click="deleteUser(u)"
                    class="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-all border border-gray-100"
                    title="Hapus Pengguna"
                  >
                    <i class="fas fa-trash-can text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
