<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const orgs = ref([])
const loading = ref(false)
const search = ref('')
const alertMsg = ref('')

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

async function deleteOrg(id, name) {
  if (!confirm(`Hapus unit kerja / OPD: "${name}"?`)) return
  try {
    await api.delete(`/admin/organizations/${id}`)
    alertMsg.value = `Unit OPD "${name}" berhasil dihapus.`
    fetchOrgs()
    setTimeout(() => alertMsg.value = '', 4000)
  } catch (e) {
    alert('Gagal menghapus unit organisasi.')
  }
}

onMounted(() => fetchOrgs())
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-sky-200">
          <i class="fas fa-sitemap"></i> Struktur Badan Publik
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Organisasi & Unit Kerja (OPD)</h1>
        <p class="text-sm text-sky-200/80 max-w-2xl leading-relaxed">
          Kelola direktori dinas, badan daerah, sekretariat, kecamatan, dan unit kerja pelaksana pelayanan informasi di Kabupaten Sinjai.
        </p>
      </div>

      <!-- Action Button to Dedicated Create Page -->
      <NuxtLink
        to="/admin/organizations/create"
        class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
      >
        <i class="fas fa-plus-circle text-base"></i>
        <span>Tambah Unit OPD</span>
      </NuxtLink>
    </div>

    <!-- Alert Message -->
    <div v-if="alertMsg" class="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm font-semibold border border-emerald-200 flex items-center justify-between animate-fadeIn">
      <div class="flex items-center gap-2">
        <i class="fas fa-check-circle text-emerald-600"></i>
        <span>{{ alertMsg }}</span>
      </div>
      <button @click="alertMsg = ''" class="text-emerald-600 hover:text-emerald-800"><i class="fas fa-times"></i></button>
    </div>

    <!-- Search Toolbar -->
    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
      <div class="relative w-full flex-1">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="search"
          @keyup.enter="fetchOrgs"
          type="text"
          placeholder="Cari nama unit dinas, singkatan alias, atau alamat..."
          class="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-50 transition-all duration-200"
        />
      </div>

      <button
        @click="fetchOrgs"
        class="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        <i class="fas fa-magnifying-glass text-xs"></i>
        <span>Cari Unit</span>
      </button>
    </div>

    <!-- Data Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="py-4 px-6">Nama Badan Publik / OPD</th>
              <th class="py-4 px-6">Singkatan</th>
              <th class="py-4 px-6">Kontak & Portal</th>
              <th class="py-4 px-6 text-center">Posisi Pejabat</th>
              <th class="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="loading">
              <td colspan="5" class="py-16 text-center text-gray-400">
                <i class="fas fa-circle-notch fa-spin text-2xl text-sky-600 mb-2"></i>
                <p class="font-medium text-xs">Memuat direktori OPD...</p>
              </td>
            </tr>
            <tr v-else-if="orgs.length === 0">
              <td colspan="5" class="py-16 text-center text-gray-400">
                <i class="fas fa-building-circle-xmark text-3xl text-gray-300 mb-2"></i>
                <p class="font-medium">Tidak ada data unit organisasi ditemukan.</p>
                <p class="text-xs text-gray-400 mt-1">Gunakan tombol "Tambah Unit OPD" untuk mendaftarkan instansi baru.</p>
              </td>
            </tr>
            <tr v-for="org in orgs" :key="org.id" class="hover:bg-slate-50/50 transition-colors group">
              <!-- Nama & Alamat -->
              <td class="py-4 px-6 max-w-sm">
                <div class="font-bold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                  {{ org.name }}
                </div>
                <div v-if="org.address" class="text-xs text-gray-400 mt-1 flex items-center gap-1.5 line-clamp-1">
                  <i class="fas fa-map-marker-alt text-[10px] text-gray-400"></i>
                  <span>{{ org.address }}</span>
                </div>
              </td>

              <!-- Alias Singkatan -->
              <td class="py-4 px-6">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700">
                  {{ org.alias || '-' }}
                </span>
              </td>

              <!-- Kontak & Website -->
              <td class="py-4 px-6 text-xs text-gray-600 space-y-1">
                <div v-if="org.website">
                  <a :href="org.website" target="_blank" class="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-medium">
                    <i class="fas fa-globe text-[11px]"></i>
                    <span>{{ org.website.replace('https://', '').replace('http://', '') }}</span>
                  </a>
                </div>
                <div v-if="org.email" class="text-gray-500 flex items-center gap-1.5">
                  <i class="fas fa-envelope text-[10px] text-gray-400"></i>
                  <span>{{ org.email }}</span>
                </div>
                <div v-if="!org.website && !org.email" class="text-gray-300 italic">-</div>
              </td>

              <!-- Posisi Pejabat -->
              <td class="py-4 px-6 text-center">
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  <i class="fas fa-user-tie text-[10px]"></i>
                  <span>{{ org.positions_count || 0 }} Pejabat</span>
                </span>
              </td>

              <!-- Aksi Edit & Hapus -->
              <td class="py-4 px-6 text-right space-x-2">
                <NuxtLink
                  :to="`/admin/organizations/${org.id}/edit`"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-xl text-xs font-bold transition-all"
                >
                  <i class="fas fa-pen-to-square text-[11px]"></i>
                  <span>Edit</span>
                </NuxtLink>
                <button
                  @click="deleteOrg(org.id, org.name)"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl text-xs font-bold transition-all"
                >
                  <i class="fas fa-trash-can text-[11px]"></i>
                  <span>Hapus</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
