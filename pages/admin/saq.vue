<template>
  <div class="p-2 lg:p-4">
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Kelola Pertanyaan SAQ</h1>
        <p class="text-sm text-gray-500 mt-1">{{ pagination.total || 0 }} pertanyaan terdaftar</p>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 text-sm font-medium"
      >
        <i class="fas fa-plus"></i> Tambah Pertanyaan
      </button>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
      <div class="flex-1 min-w-[200px] relative">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input
          v-model="search"
          @keyup.enter="fetchData(1)"
          type="text"
          placeholder="Cari kode / pertanyaan..."
          class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <select
        v-model="tabFilter"
        @change="fetchData(1)"
        class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
      >
        <option value="">Semua Tab</option>
        <option v-for="t in tabs" :key="t.tab" :value="t.tab">{{ t.tab }}</option>
      </select>
      <button
        @click="fetchData(1)"
        class="px-4 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all text-sm font-medium"
      >
        <i class="fas fa-sync-alt mr-1"></i> Muat Ulang
      </button>
    </div>

    <!-- Tabel -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
        <p class="text-sm">Memuat data...</p>
      </div>
      <div v-else-if="error" class="p-8 text-center">
        <i class="fas fa-exclamation-triangle text-3xl text-red-400 mb-2"></i>
        <p class="text-sm text-red-600">{{ error }}</p>
        <button @click="fetchData(1)" class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">Coba Lagi</button>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 text-gray-600 text-left">
              <th class="px-4 py-3 font-semibold w-12">No</th>
              <th class="px-4 py-3 font-semibold w-28">Kode</th>
              <th class="px-4 py-3 font-semibold">Pertanyaan</th>
              <th class="px-4 py-3 font-semibold w-40">Tab</th>
              <th class="px-4 py-3 font-semibold w-24 text-center">OPD</th>
              <th class="px-4 py-3 font-semibold w-44 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in items" :key="item.id" class="border-t border-gray-100 hover:bg-blue-50/50">
              <td class="px-4 py-3 text-gray-500">{{ (pagination.current_page - 1) * perPage + idx + 1 }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-mono font-medium">{{ item.kode || '-' }}</span>
              </td>
              <td class="px-4 py-3 text-gray-800">
                <p class="line-clamp-2" :title="item.pertanyaan">{{ truncate(item.pertanyaan, 100) }}</p>
                <span v-if="item.is_category" class="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Kategori</span>
                <span v-if="item.input_type" class="inline-block mt-1 ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{{ item.input_type }}</span>
              </td>
              <td class="px-4 py-3 text-gray-600">{{ item.tab }}</td>
              <td class="px-4 py-3 text-center">
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium whitespace-nowrap">
                  {{ item.organizations_count }} OPD
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-1.5">
                  <button @click="openEditModal(item)" title="Edit" class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 flex items-center justify-center">
                    <i class="fas fa-pen text-xs"></i>
                  </button>
                  <button @click="openMappingModal(item)" title="Mapping OPD" class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 flex items-center justify-center">
                    <i class="fas fa-sitemap text-xs"></i>
                  </button>
                  <button @click="confirmDelete(item)" title="Hapus" class="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center">
                    <i class="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!items.length">
              <td colspan="6" class="px-4 py-10 text-center text-gray-500">Tidak ada data.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-500">Halaman {{ pagination.current_page }} dari {{ pagination.last_page }} ({{ pagination.total }} data)</p>
        <div class="flex gap-1.5">
          <button
            v-for="p in pageNumbers"
            :key="p"
            @click="fetchData(p)"
            :class="['w-9 h-9 rounded-lg text-sm font-medium transition-all', p === pagination.current_page ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          >{{ p }}</button>
        </div>
      </div>
    </div>

    <!-- Modal tambah/edit -->
    <SaqQuestionModal
      v-if="showQuestionModal"
      :item="editingItem"
      :tabs="tabs"
      @close="showQuestionModal = false"
      @saved="onQuestionSaved"
    />

    <!-- Modal mapping OPD -->
    <SaqOpdPicker
      v-if="showMappingModal"
      :item="mappingItem"
      @close="showMappingModal = false"
      @saved="onMappingSaved"
    />

    <!-- Konfirmasi hapus -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="deleteTarget = null"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <i class="fas fa-trash text-red-600"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-800">Hapus Pertanyaan?</h3>
            <p class="text-sm text-gray-500">{{ deleteTarget.kode || ('#' + deleteTarget.id) }}</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 mb-6">{{ truncate(deleteTarget.pertanyaan, 120) }}</p>
        <div class="flex justify-end gap-2">
          <button @click="deleteTarget = null" class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Batal</button>
          <button @click="doDelete" :disabled="deleting" class="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 disabled:opacity-50">
            <i v-if="deleting" class="fas fa-spinner fa-spin mr-1"></i> Ya, Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" :class="['fixed bottom-6 right-6 z-[60] px-5 py-3 rounded-xl shadow-2xl text-sm font-medium text-white', toast.type === 'error' ? 'bg-red-600' : 'bg-green-600']">
      <i :class="toast.type === 'error' ? 'fas fa-exclamation-circle mr-2' : 'fas fa-check-circle mr-2'"></i>{{ toast.message }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import SaqQuestionModal from '@/components/admin/SaqQuestionModal.vue'
import SaqOpdPicker from '@/components/admin/SaqOpdPicker.vue'

const router = useRouter()
const authStore = useAuthStore()

// Guard: hanya superadmin
if (typeof window !== 'undefined' && !authStore.isSuperAdmin) {
  router.push('/login')
}

const items = ref([])
const tabs = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const tabFilter = ref('')
const perPage = 20
const pagination = ref({ current_page: 1, last_page: 1, total: 0 })

const showQuestionModal = ref(false)
const editingItem = ref(null)
const showMappingModal = ref(false)
const mappingItem = ref(null)
const deleteTarget = ref(null)
const deleting = ref(false)
const toast = ref(null)

function showToast(message, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => (toast.value = null), 3000)
}

function truncate(text, len) {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

const pageNumbers = computed(() => {
  const cur = pagination.value.current_page
  const last = pagination.value.last_page
  const start = Math.max(1, cur - 2)
  const end = Math.min(last, start + 4)
  const arr = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
})

async function fetchTabs() {
  try {
    const res = await api.get('/saq-admin/tabs')
    const data = res.data?.data || []
    // Ambil tab unik
    const seen = new Set()
    tabs.value = data.filter((t) => {
      if (seen.has(t.tab)) return false
      seen.add(t.tab)
      return true
    })
  } catch (e) {
    console.error('Gagal memuat tab:', e)
  }
}

async function fetchData(page = 1) {
  loading.value = true
  error.value = ''
  try {
    const params = { page, per_page: perPage }
    if (search.value) params.search = search.value
    if (tabFilter.value) params.tab = tabFilter.value
    const res = await api.get('/saq-admin/indicators', { params })
    const pag = res.data?.data
    items.value = pag?.data || []
    pagination.value = {
      current_page: pag?.current_page || 1,
      last_page: pag?.last_page || 1,
      total: pag?.total || 0,
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Gagal memuat data.'
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  editingItem.value = null
  showQuestionModal.value = true
}

function openEditModal(item) {
  editingItem.value = item
  showQuestionModal.value = true
}

function openMappingModal(item) {
  mappingItem.value = item
  showMappingModal.value = true
}

function onQuestionSaved() {
  showQuestionModal.value = false
  fetchData(pagination.value.current_page)
  showToast('Pertanyaan berhasil disimpan.')
}

function onMappingSaved(count) {
  showMappingModal.value = false
  fetchData(pagination.value.current_page)
  showToast(`Mapping diperbarui (${count} OPD).`)
}

function confirmDelete(item) {
  deleteTarget.value = item
}

async function doDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await api.delete(`/saq-admin/indicators/${deleteTarget.value.id}`)
    deleteTarget.value = null
    fetchData(pagination.value.current_page)
    showToast('Pertanyaan berhasil dihapus.')
  } catch (e) {
    showToast(e.response?.data?.message || 'Gagal menghapus.', 'error')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchTabs()
  fetchData(1)
})
</script>
