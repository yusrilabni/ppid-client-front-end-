<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const items = ref([])
const categories = ref([])
const units = ref([])
const loading = ref(false)
const search = ref('')
const selectedCategory = ref('')
const alertMsg = ref('')

const categoryOptions = computed(() => {
  return [
    { value: '', label: 'Semua Kategori Standar', icon: 'fas fa-layer-group' },
    ...categories.value.map(c => ({
      value: c.id,
      label: c.nama || c.title,
      icon: 'fas fa-bookmark'
    }))
  ]
})

async function fetchData() {
  loading.value = true
  try {
    const res = await api.get('/admin/standar-layanan', {
      params: {
        search: search.value,
        category_id: selectedCategory.value
      }
    })
    if (res.data?.success) {
      items.value = res.data.data.data || []
      categories.value = res.data.categories || []
      units.value = res.data.units || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function deleteItem(id, nama) {
  if (!confirm(`Hapus permanen dokumen standar layanan: "${nama}"?`)) return
  try {
    await api.delete(`/admin/standar-layanan/${id}`)
    alertMsg.value = `Dokumen "${nama}" berhasil dihapus.`
    fetchData()
    setTimeout(() => alertMsg.value = '', 4000)
  } catch (e) {
    alert('Gagal menghapus dokumen')
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200">
          <i class="fas fa-shield-halved"></i> Tata Kelola Informasi Publik
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Standar Layanan Informasi</h1>
        <p class="text-sm text-blue-200/80 max-w-2xl leading-relaxed">
          Kelola seluruh pedoman, maklumat, SOP, biaya, dan tata cara pelayanan informasi publik Pemkab Sinjai secara terstruktur.
        </p>
      </div>

      <!-- Action Button to Dedicated Create Page -->
      <NuxtLink
        to="/admin/standar-layanan/create"
        class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
      >
        <i class="fas fa-plus-circle text-base"></i>
        <span>Tambah Standar Baru</span>
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

    <!-- Filter & Search Toolbar with Custom Select -->
    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
      <div class="w-full md:w-72">
        <CustomSelect
          v-model="selectedCategory"
          :options="categoryOptions"
          placeholder="Filter Kategori"
          @change="fetchData"
        />
      </div>

      <div class="relative w-full flex-1">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="search"
          @keyup.enter="fetchData"
          type="text"
          placeholder="Cari judul dokumen, jenis, atau deskripsi SOP..."
          class="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all duration-200"
        />
      </div>

      <button
        @click="fetchData"
        class="w-full md:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        <i class="fas fa-filter text-xs"></i>
        <span>Terapkan</span>
      </button>
    </div>

    <!-- Data Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th class="py-4 px-6">Informasi Dokumen</th>
              <th class="py-4 px-6">Kategori & OPD</th>
              <th class="py-4 px-6">Tahun & Jenis</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-center">Berkas</th>
              <th class="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="loading">
              <td colspan="6" class="py-16 text-center text-gray-400">
                <i class="fas fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
                <p class="font-medium text-xs">Memuat daftar standar layanan...</p>
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="6" class="py-16 text-center text-gray-400">
                <i class="fas fa-folder-open text-3xl text-gray-300 mb-2"></i>
                <p class="font-medium">Tidak ada dokumen standar layanan ditemukan.</p>
                <p class="text-xs text-gray-400 mt-1">Gunakan tombol "Tambah Standar Baru" untuk mengunggah dokumen baru.</p>
              </td>
            </tr>
            <tr v-for="it in items" :key="it.id" class="hover:bg-slate-50/50 transition-colors group">
              <!-- Judul & Deskripsi -->
              <td class="py-4 px-6 max-w-sm">
                <div class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {{ it.nama || it.title }}
                </div>
                <div v-if="it.deskripsi" class="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {{ it.deskripsi }}
                </div>
              </td>

              <!-- Kategori & Unit -->
              <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                  <i class="fas fa-bookmark text-[10px]"></i>
                  {{ it.standar_layanan?.nama || it.standar_layanan?.title || 'Umum' }}
                </span>
                <div v-if="it.unit" class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <i class="fas fa-building text-[10px] text-gray-400"></i>
                  <span>{{ it.unit.name }}</span>
                </div>
              </td>

              <!-- Tahun & Jenis Dokumen -->
              <td class="py-4 px-6 text-xs text-gray-600">
                <div class="font-medium">{{ it.tahun_dokumen ? new Date(it.tahun_dokumen).getFullYear() : '-' }}</div>
                <div class="text-gray-400 mt-0.5">{{ it.jenis_dokumen || 'Standard File' }}</div>
              </td>

              <!-- Status -->
              <td class="py-4 px-6 text-center">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  :class="it.status === 'active' || !it.status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600'"
                >
                  {{ it.status || 'Active' }}
                </span>
              </td>

              <!-- Berkas Dokumen -->
              <td class="py-4 px-6 text-center">
                <a
                  v-if="it.file_path"
                  :href="`https://ppidkab.sinjaikab.go.id/storage/${it.file_path}`"
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <i class="fas fa-file-pdf text-red-500"></i>
                  <span>Lihat PDF</span>
                </a>
                <span v-else class="text-xs text-gray-300 italic">Tanpa berkas</span>
              </td>

              <!-- Aksi Edit & Hapus -->
              <td class="py-4 px-6 text-right space-x-2">
                <NuxtLink
                  :to="`/admin/standar-layanan/${it.id}/edit`"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-all"
                >
                  <i class="fas fa-pen-to-square text-[11px]"></i>
                  <span>Edit</span>
                </NuxtLink>
                <button
                  @click="deleteItem(it.id, it.nama || it.title)"
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
