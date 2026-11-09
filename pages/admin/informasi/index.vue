<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const items = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0
})

const categories = [
  'Informasi Berkala',
  'Informasi Serta Merta',
  'Informasi Setiap Saat',
  'Informasi Dikecualikan'
]

async function fetchInformasi(page = 1) {
  loading.value = true
  try {
    const params = {
      page,
      per_page: 15,
      q: searchQuery.value,
      category: selectedCategory.value
    }
    const res = await api.get('/admin/informasi', { params })
    if (res.data?.success && res.data?.data) {
      const data = res.data.data
      items.value = data.data || []
      pagination.value = {
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || 0
      }
    }
  } catch (err) {
    console.error('Failed to load informasi list:', err)
  } finally {
    loading.value = false
  }
}

async function deleteItem(item) {
  if (!confirm(`Apakah Anda yakin ingin menghapus dokumen "${item.title}"?`)) return
  try {
    const res = await api.delete(`/informasi-crud/${item.id}`)
    if (res.data?.success || res.status === 200) {
      fetchInformasi(pagination.value.current_page)
    }
  } catch (err) {
    alert('Gagal menghapus informasi: ' + (err.response?.data?.message || err.message))
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d) ? dateStr : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchInformasi(1)
  }, 400)
})

watch(selectedCategory, () => {
  fetchInformasi(1)
})

onMounted(() => {
  fetchInformasi()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
            <i class="fas fa-file-lines"></i>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Manajemen Informasi Publik</h1>
            <p class="text-xs text-gray-500 mt-0.5">Kelola dokumen informasi berkala, serta merta, setiap saat, dan dikecualikan</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/admin/informasi/create"
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          <span>Tambah Informasi Baru</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari judul informasi..."
          class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <select
          v-model="selectedCategory"
          class="w-full md:w-56 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-blue-700 to-blue-900 text-white text-left">
            <tr>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">No.</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Judul Dokumen</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Kategori</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Jenis</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Tgl. Upload</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="loading">
              <td colspan="7" class="py-12 text-center text-gray-400">
                <i class="fas fa-circle-notch fa-spin text-2xl text-blue-600 mb-2"></i>
                <p class="text-xs font-bold">Memuat daftar dokumen...</p>
              </td>
            </tr>

            <template v-else-if="items.length > 0">
              <tr v-for="(item, idx) in items" :key="item.id" class="hover:bg-blue-50/40 transition">
                <td class="px-6 py-4 text-xs font-bold text-gray-500">
                  {{ (pagination.current_page - 1) * 15 + idx + 1 }}
                </td>
                <td class="px-6 py-4">
                  <p class="text-xs font-black text-gray-900 line-clamp-2">{{ item.title }}</p>
                  <p v-if="item.deskripsi" class="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{{ item.deskripsi }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                    {{ item.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-bold">
                  {{ item.jenis_dokumen || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      item.status === 'BERLAKU' || item.status === 'AKTIF' || item.published
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-700',
                      'px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1'
                    ]"
                  >
                    <i :class="item.status === 'BERLAKU' || item.status === 'AKTIF' ? 'fas fa-check-circle' : 'fas fa-archive'"></i>
                    <span>{{ item.status || 'DRAFT' }}</span>
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                  {{ formatDate(item.tanggal_upload || item.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <NuxtLink
                      :to="`/informasi/detail/${item.slug}`"
                      target="_blank"
                      class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Lihat Pratinjau Publik"
                    >
                      <i class="fas fa-eye"></i>
                    </NuxtLink>
                    <NuxtLink
                      :to="`/admin/informasi/${item.id}/edit`"
                      class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Ubah Dokumen"
                    >
                      <i class="fas fa-pen-to-square"></i>
                    </NuxtLink>
                    <button
                      @click="deleteItem(item)"
                      class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Hapus Dokumen"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-else>
              <td colspan="7" class="py-16 text-center text-gray-400">
                <i class="fas fa-file-circle-xmark text-4xl mb-3 text-gray-300"></i>
                <p class="text-sm font-bold text-gray-700">Tidak ada dokumen informasi ditemukan</p>
                <p class="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian atau kategori dokumen</p>
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
            @click="fetchInformasi(pagination.current_page - 1)"
            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <span class="px-3 py-1.5 text-xs font-black text-gray-700">
            {{ pagination.current_page }} / {{ pagination.last_page }}
          </span>
          <button
            :disabled="pagination.current_page >= pagination.last_page"
            @click="fetchInformasi(pagination.current_page + 1)"
            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
