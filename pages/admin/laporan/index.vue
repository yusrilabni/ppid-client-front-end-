<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'

const items = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedYear = ref('')
const selectedType = ref('tahunan')
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0
})

const stats = ref({
  total: 0,
  published: 0,
  draft: 0
})

async function fetchLaporan(page = 1) {
  loading.value = true
  try {
    const params = {
      page,
      per_page: 10,
      q: searchQuery.value,
      tahun: selectedYear.value,
      type: selectedType.value
    }
    const res = await api.get('/admin/laporan', { params })
    if (res.data?.success && res.data?.data) {
      const data = res.data.data
      items.value = data.data || []
      pagination.value = {
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || 0
      }
      stats.value.total = data.total || 0
      stats.value.published = items.value.filter(i => i.published).length
      stats.value.draft = items.value.filter(i => !i.published).length
    }
  } catch (err) {
    console.error('Failed to load laporan:', err)
  } finally {
    loading.value = false
  }
}

async function deleteItem(item) {
  if (!confirm(`Hapus laporan "${item.title}"?`)) return
  try {
    const res = await api.delete(`/admin/laporan/${item.id}`)
    if (res.data?.success) {
      fetchLaporan(pagination.value.current_page)
    }
  } catch (err) {
    alert('Gagal menghapus laporan: ' + (err.response?.data?.message || err.message))
  }
}

let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchLaporan(1)
  }, 400)
})

watch([selectedYear, selectedType], () => {
  fetchLaporan(1)
})

onMounted(() => {
  fetchLaporan()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
            <i class="fas fa-file-contract"></i>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Daftar Laporan Tahunan & Layanan</h1>
            <p class="text-xs text-gray-500 mt-0.5">Kelola berkas laporan tahunan PPID dan rekapitulasi layanan berkala</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/laporan/create"
          class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          <span>Upload Laporan Baru</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
          <i class="fas fa-book"></i>
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Laporan</p>
          <p class="text-xl font-black text-gray-900">{{ pagination.total }}</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
          <i class="fas fa-circle-check"></i>
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Published</p>
          <p class="text-xl font-black text-emerald-600">{{ stats.published }}</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
          <i class="fas fa-file-pen"></i>
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Draft / Arsip</p>
          <p class="text-xl font-black text-amber-600">{{ stats.draft }}</p>
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari judul laporan..."
          class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <select
          v-model="selectedType"
          class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="tahunan">Laporan Tahunan</option>
          <option value="triwulan">Laporan Triwulan</option>
          <option value="khusus">Laporan Khusus</option>
        </select>

        <input
          v-model="selectedYear"
          type="number"
          placeholder="Filter Tahun"
          class="w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white text-left">
            <tr>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Cover</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Judul Laporan</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Tahun</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="loading">
              <td colspan="5" class="py-12 text-center text-gray-400">
                <i class="fas fa-circle-notch fa-spin text-2xl text-indigo-600 mb-2"></i>
                <p class="text-xs font-bold">Memuat daftar laporan...</p>
              </td>
            </tr>

            <template v-else-if="items.length > 0">
              <tr v-for="item in items" :key="item.id" class="hover:bg-indigo-50/40 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-12 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                    <img
                      v-if="item.cover"
                      :src="`https://ppidkab.sinjaikab.go.id/storage/${item.cover}`"
                      alt="Cover"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="fas fa-file-pdf text-xl text-rose-500"></i>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-xs font-black text-gray-900 line-clamp-2">{{ item.title }}</p>
                  <p v-if="item.content" class="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{{ item.content }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-700">
                  {{ item.tahun }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      item.published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700',
                      'px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1'
                    ]"
                  >
                    <i :class="item.published ? 'fas fa-check-circle' : 'fas fa-eye-slash'"></i>
                    <span>{{ item.published ? 'Published' : 'Draft' }}</span>
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <a
                      v-if="item.file"
                      :href="`https://ppidkab.sinjaikab.go.id/storage/${item.file}`"
                      target="_blank"
                      class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Unduh Berkas PDF"
                    >
                      <i class="fas fa-download"></i>
                    </a>
                    <NuxtLink
                      :to="`/admin/laporan/${item.id}/edit`"
                      class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Ubah Laporan"
                    >
                      <i class="fas fa-pen-to-square"></i>
                    </NuxtLink>
                    <button
                      @click="deleteItem(item)"
                      class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Hapus Laporan"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-else>
              <td colspan="5" class="py-16 text-center text-gray-400">
                <i class="fas fa-folder-open text-4xl mb-3 text-gray-300"></i>
                <p class="text-sm font-bold text-gray-700">Tidak ada laporan tahunan ditemukan</p>
                <p class="text-xs text-gray-400 mt-1">Gunakan tombol "Upload Laporan Baru" untuk menambah data</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="p-4 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-500 font-bold">
          Total: <span class="text-gray-900">{{ pagination.total }}</span> dokumen
        </p>
        <div class="flex items-center gap-1">
          <button
            :disabled="pagination.current_page <= 1"
            @click="fetchLaporan(pagination.current_page - 1)"
            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <span class="px-3 py-1.5 text-xs font-black text-gray-700">
            {{ pagination.current_page }} / {{ pagination.last_page }}
          </span>
          <button
            :disabled="pagination.current_page >= pagination.last_page"
            @click="fetchLaporan(pagination.current_page + 1)"
            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
