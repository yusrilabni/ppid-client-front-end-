<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const officials = ref([])
const loading = ref(false)
const search = ref('')
const alertMsg = ref('')

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

async function deleteOfficial(id, name) {
  if (!confirm(`Hapus permanen profil pejabat: "${name}"?`)) return
  try {
    await api.delete(`/admin/officials/${id}`)
    alertMsg.value = `Profil "${name}" berhasil dihapus.`
    fetchOfficials()
    setTimeout(() => alertMsg.value = '', 4000)
  } catch (e) {
    alert('Gagal menghapus profil pejabat.')
  }
}

onMounted(() => fetchOfficials())
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200">
          <i class="fas fa-users-viewfinder"></i> Manajemen Pejabat & Transparansi
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Profil Pimpinan & LHKPN</h1>
        <p class="text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
          Kelola data pimpinan daerah Pemkab Sinjai, foto resmi, jabatan, NIP, serta pelaporan riwayat LHKPN secara transparan.
        </p>
      </div>

      <!-- Action Button to Dedicated Create Page -->
      <NuxtLink
        to="/admin/officials/create"
        class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
      >
        <i class="fas fa-user-plus text-base"></i>
        <span>Tambah Pejabat Baru</span>
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
          @keyup.enter="fetchOfficials"
          type="text"
          placeholder="Cari nama pejabat, jabatan, atau NIP..."
          class="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all duration-200"
        />
      </div>

      <button
        @click="fetchOfficials"
        class="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        <i class="fas fa-magnifying-glass text-xs"></i>
        <span>Cari Pejabat</span>
      </button>
    </div>

    <!-- Officials Card Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="loading" class="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
        <i class="fas fa-circle-notch fa-spin text-2xl text-indigo-600 mb-2"></i>
        <p class="font-medium text-xs">Memuat data pimpinan & pejabat...</p>
      </div>

      <div v-else-if="officials.length === 0" class="col-span-full py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
        <i class="fas fa-user-slash text-3xl text-gray-300 mb-2"></i>
        <p class="font-medium">Tidak ada data pimpinan ditemukan.</p>
        <p class="text-xs text-gray-400 mt-1">Gunakan tombol "Tambah Pejabat Baru" untuk menginput data pimpinan.</p>
      </div>

      <div
        v-for="off in officials"
        :key="off.id"
        class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
      >
        <div class="space-y-4">
          <!-- Top Row: Avatar & Details -->
          <div class="flex items-start gap-4">
            <div class="relative flex-shrink-0">
              <img
                :src="off.photo ? `https://ppidkab.sinjaikab.go.id/storage/${off.photo}` : '/images/avatar-default.png'"
                class="w-16 h-16 rounded-2xl object-cover bg-slate-100 ring-2 ring-indigo-50 shadow-sm"
                :alt="off.name"
              />
              <span
                class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                :class="off.status === 'inactive' ? 'bg-gray-400' : 'bg-emerald-500'"
              ></span>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                {{ off.name }}
              </h3>
              <p class="text-xs font-semibold text-indigo-600 mt-0.5 line-clamp-1">
                {{ off.position }}
              </p>
              <div class="text-[11px] text-gray-400 font-mono mt-1">
                NIP: {{ off.nip || '-' }}
              </div>
            </div>
          </div>

          <!-- OPD / Instansi Badge -->
          <div v-if="off.organization" class="px-3 py-1.5 bg-slate-50 rounded-xl text-xs text-gray-600 flex items-center gap-2">
            <i class="fas fa-building text-slate-400 text-xs"></i>
            <span class="truncate">{{ off.organization.name }}</span>
          </div>

          <!-- LHKPN Badge -->
          <div class="flex items-center justify-between text-xs pt-2 border-t border-gray-50">
            <span class="text-gray-400 font-medium">Riwayat LHKPN:</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              <i class="fas fa-file-shield text-[10px]"></i>
              {{ off.lhkpn_list?.length || 0 }} Laporan
            </span>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span class="text-[11px] font-bold text-gray-400">Urutan: #{{ off.order || 0 }}</span>

          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/admin/officials/${off.id}/edit`"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all"
            >
              <i class="fas fa-pen-to-square text-[11px]"></i>
              <span>Edit</span>
            </NuxtLink>
            <button
              @click="deleteOfficial(off.id, off.name)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl text-xs font-bold transition-all"
            >
              <i class="fas fa-trash-can text-[11px]"></i>
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
