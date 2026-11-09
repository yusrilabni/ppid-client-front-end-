<script setup>
definePageMeta({ layout: 'admin' })

import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'

// Tab: 'permohonan' | 'keberatan'
const activeTab = ref('permohonan')

// State Permohonan
const loadingPermohonan = ref(false)
const permohonanList = ref([])
const permohonanStats = ref({ total: 0, pending: 0, diproses: 0, selesai: 0, ditolak: 0 })
const searchPermohonan = ref('')
const statusFilterPermohonan = ref('all')
const pagePermohonan = ref(1)
const lastPagePermohonan = ref(1)

// State Keberatan
const loadingKeberatan = ref(false)
const keberatanList = ref([])
const keberatanStats = ref({ total: 0, pending: 0, diproses: 0, selesai: 0, ditolak: 0 })
const searchKeberatan = ref('')
const statusFilterKeberatan = ref('all')
const pageKeberatan = ref(1)
const lastPageKeberatan = ref(1)

// Modal Detail & Respon
const selectedItem = ref(null)
const modalType = ref(null) // 'detail-permohonan' | 'respond-permohonan' | 'detail-keberatan' | 'respond-keberatan'
const responseMessage = ref('')
const responseType = ref('jawaban')
const responseLink = ref('')
const responseStatus = ref('selesai')
const responseFile = ref(null)
const submittingResponse = ref(false)
const downloadPdfLoading = ref(false)

// Alert Notification
const alertMessage = ref('')
const alertType = ref('success')

function showAlert(msg, type = 'success') {
  alertMessage.value = msg
  alertType.value = type
  setTimeout(() => { alertMessage.value = '' }, 4000)
}

// Fetch Permohonan
async function fetchPermohonan(page = 1) {
  loadingPermohonan.value = true
  try {
    const params = {
      page,
      status: statusFilterPermohonan.value !== 'all' ? statusFilterPermohonan.value : undefined,
      search: searchPermohonan.value ? searchPermohonan.value : undefined,
    }
    const res = await api.get('/admin/permohonan', { params })
    if (res.data?.success) {
      permohonanList.value = res.data.data.data || []
      pagePermohonan.value = res.data.data.current_page || 1
      lastPagePermohonan.value = res.data.data.last_page || 1
      if (res.data.stats) permohonanStats.value = res.data.stats
    }
  } catch (err) {
    console.error('Fetch permohonan error:', err)
  } finally {
    loadingPermohonan.value = false
  }
}

// Fetch Keberatan
async function fetchKeberatan(page = 1) {
  loadingKeberatan.value = true
  try {
    const params = {
      page,
      status: statusFilterKeberatan.value !== 'all' ? statusFilterKeberatan.value : undefined,
      search: searchKeberatan.value ? searchKeberatan.value : undefined,
    }
    const res = await api.get('/admin/keberatan', { params })
    if (res.data?.success) {
      keberatanList.value = res.data.data.data || []
      pageKeberatan.value = res.data.data.current_page || 1
      lastPageKeberatan.value = res.data.data.last_page || 1
      if (res.data.stats) keberatanStats.value = res.data.stats
    }
  } catch (err) {
    console.error('Fetch keberatan error:', err)
  } finally {
    loadingKeberatan.value = false
  }
}

// Modal Handlers
function openDetail(item, type) {
  selectedItem.value = item
  modalType.value = type
}

function openRespond(item, type) {
  selectedItem.value = item
  modalType.value = type
  responseMessage.value = ''
  responseLink.value = ''
  responseFile.value = null
  responseType.value = 'jawaban'
  responseStatus.value = type === 'respond-permohonan' ? 'selesai' : 'selesai'
}

function closeModal() {
  selectedItem.value = null
  modalType.value = null
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) responseFile.value = file
}

// Submit Response Permohonan
async function submitPermohonanResponse() {
  if (!responseMessage.value.trim()) {
    showAlert('Uraian tanggapan wajib diisi.', 'error')
    return
  }
  submittingResponse.value = true
  try {
    const formData = new FormData()
    formData.append('message', responseMessage.value)
    formData.append('response_type', responseType.value)
    formData.append('update_status', responseStatus.value)
    if (responseLink.value) formData.append('link', responseLink.value)
    if (responseFile.value) formData.append('file', responseFile.value)

    const res = await api.post(`/admin/permohonan/${selectedItem.value.id}/respond`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data?.success) {
      showAlert('Tanggapan permohonan berhasil dikirim!')
      closeModal()
      fetchPermohonan(pagePermohonan.value)
    }
  } catch (err) {
    showAlert(err.response?.data?.message || 'Gagal mengirim tanggapan.', 'error')
  } finally {
    submittingResponse.value = false
  }
}

// Submit Response Keberatan
async function submitKeberatanResponse() {
  if (!responseMessage.value.trim()) {
    showAlert('Uraian pertimbangan atasan wajib diisi.', 'error')
    return
  }
  submittingResponse.value = true
  try {
    const formData = new FormData()
    formData.append('status_keberatan', responseStatus.value)
    formData.append('tanggapan_atasan', responseMessage.value)
    if (responseFile.value) formData.append('surat_tanggapan', responseFile.value)

    const res = await api.post(`/admin/keberatan/${selectedItem.value.id}/respond`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data?.success) {
      showAlert('Putusan atasan PPID atas keberatan berhasil disimpan!')
      closeModal()
      fetchKeberatan(pageKeberatan.value)
    }
  } catch (err) {
    showAlert(err.response?.data?.message || 'Gagal memproses keberatan.', 'error')
  } finally {
    submittingResponse.value = false
  }
}

// Cetak Laporan PDF
async function downloadLaporanPdf() {
  downloadPdfLoading.value = true
  try {
    const res = await api.get('/admin/reports/export-pdf', {
      responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = `Laporan-Layanan-PPID-${new Date().getFullYear()}.pdf`
    link.click()
    showAlert('Laporan PPID (PDF) berhasil diunduh.')
  } catch (err) {
    showAlert('Gagal mengunduh file laporan PDF.', 'error')
  } finally {
    downloadPdfLoading.value = false
  }
}

watch(activeTab, (newTab) => {
  if (newTab === 'permohonan') fetchPermohonan(1)
  else fetchKeberatan(1)
})

onMounted(() => {
  fetchPermohonan(1)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Title & Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-inbox text-blue-600"></i>
          Manajemen Permohonan & Keberatan
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          Kelola alur pelayanan permohonan informasi publik dan penanganan pengajuan keberatan resmi sesuai UU No. 14 Tahun 2008.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="downloadLaporanPdf" 
          :disabled="downloadPdfLoading"
          class="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
        >
          <i :class="downloadPdfLoading ? 'fas fa-spinner fa-spin' : 'fas fa-file-pdf'"></i>
          <span>{{ downloadPdfLoading ? 'Menyiapkan...' : 'Cetak Laporan PDF' }}</span>
        </button>
      </div>
    </div>

    <!-- Alert Notification -->
    <div v-if="alertMessage" :class="['p-4 rounded-xl text-sm font-medium flex items-center justify-between', alertType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200']">
      <span>{{ alertMessage }}</span>
      <button @click="alertMessage = ''" class="text-gray-400 hover:text-gray-600">&times;</button>
    </div>

    <!-- Tab Bar -->
    <div class="flex items-center gap-2 border-b border-gray-200 bg-white px-6 pt-3 rounded-t-2xl shadow-sm">
      <button 
        @click="activeTab = 'permohonan'"
        :class="['flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all', activeTab === 'permohonan' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
      >
        <i class="fas fa-file-signature"></i>
        <span>Permohonan Informasi</span>
        <span class="ml-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-bold">
          {{ permohonanStats.total }}
        </span>
      </button>

      <button 
        @click="activeTab = 'keberatan'"
        :class="['flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all', activeTab === 'keberatan' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
      >
        <i class="fas fa-exclamation-triangle"></i>
        <span>Pengajuan Keberatan</span>
        <span class="ml-1 px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700 font-bold">
          {{ keberatanStats.total }}
        </span>
      </button>
    </div>

    <!-- ========================================== -->
    <!-- TAB 1: PERMOHONAN INFORMASI               -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'permohonan'" class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span class="text-xs font-semibold text-gray-400 uppercase">Menunggu (Pending)</span>
          <p class="text-2xl font-bold text-gray-700 mt-1">{{ permohonanStats.pending }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span class="text-xs font-semibold text-blue-500 uppercase">Sedang Diproses</span>
          <p class="text-2xl font-bold text-blue-600 mt-1">{{ permohonanStats.diproses }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span class="text-xs font-semibold text-emerald-500 uppercase">Selesai / Dikabulkan</span>
          <p class="text-2xl font-bold text-emerald-600 mt-1">{{ permohonanStats.selesai }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span class="text-xs font-semibold text-red-500 uppercase">Ditolak</span>
          <p class="text-2xl font-bold text-red-600 mt-1">{{ permohonanStats.ditolak }}</p>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="relative w-full md:w-80">
          <i class="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
          <input 
            v-model="searchPermohonan" 
            @keyup.enter="fetchPermohonan(1)"
            type="text" 
            placeholder="Cari kode tiket, nama, informasi..." 
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <select 
            v-model="statusFilterPermohonan" 
            @change="fetchPermohonan(1)"
            class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
          </select>
          <button @click="fetchPermohonan(1)" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Terapkan
          </button>
        </div>
      </div>

      <!-- Tabel Permohonan -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
              <tr>
                <th class="py-3 px-4">Kode Tiket</th>
                <th class="py-3 px-4">Nama Pemohon</th>
                <th class="py-3 px-4">Rincian Informasi</th>
                <th class="py-3 px-4">Tanggal Masuk</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="loadingPermohonan">
                <td colspan="6" class="py-8 text-center text-gray-500">
                  <i class="fas fa-spinner fa-spin mr-2"></i> Memuat permohonan...
                </td>
              </tr>
              <tr v-else-if="permohonanList.length === 0">
                <td colspan="6" class="py-8 text-center text-gray-400">
                  Tidak ada data permohonan informasi.
                </td>
              </tr>
              <tr v-for="item in permohonanList" :key="item.id" class="hover:bg-gray-50">
                <td class="py-3 px-4 font-mono font-bold text-blue-600">
                  #{{ item.unique_code }}
                </td>
                <td class="py-3 px-4 font-medium text-gray-800">
                  {{ item.nama_pemohon }}
                  <span v-if="item.user" class="block text-xs text-gray-400">User Terdaftar</span>
                </td>
                <td class="py-3 px-4 text-gray-600 max-w-xs truncate" :title="item.detail_informasi">
                  {{ item.detail_informasi }}
                </td>
                <td class="py-3 px-4 text-gray-500 text-xs">
                  {{ new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                </td>
                <td class="py-3 px-4">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold uppercase', 
                    item.status_permohonan === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                    item.status_permohonan === 'diproses' ? 'bg-blue-100 text-blue-800' :
                    item.status_permohonan === 'ditolak' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-700']">
                    {{ item.status_permohonan }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center space-x-2">
                  <NuxtLink :to="`/admin/permohonan/${item.id}`" class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-semibold inline-flex items-center gap-1" title="Detail">
                    <i class="fas fa-eye"></i> Detail
                  </NuxtLink>
                  <button @click="openRespond(item, 'respond-permohonan')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium" title="Tanggapi">
                    <i class="fas fa-reply"></i> Tanggapi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="lastPagePermohonan > 1" class="p-4 border-t border-gray-100 flex items-center justify-between">
          <button :disabled="pagePermohonan <= 1" @click="fetchPermohonan(pagePermohonan - 1)" class="px-3 py-1 bg-gray-100 rounded text-xs disabled:opacity-50">
            Sebelumnya
          </button>
          <span class="text-xs text-gray-500">Halaman {{ pagePermohonan }} dari {{ lastPagePermohonan }}</span>
          <button :disabled="pagePermohonan >= lastPagePermohonan" @click="fetchPermohonan(pagePermohonan + 1)" class="px-3 py-1 bg-gray-100 rounded text-xs disabled:opacity-50">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: PENGAJUAN KEBERATAN INFORMASI       -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'keberatan'" class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span class="text-xs font-semibold text-gray-400 uppercase">Menunggu (Pending)</span>
          <p class="text-2xl font-bold text-gray-700 mt-1">{{ keberatanStats.pending }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span class="text-xs font-semibold text-orange-500 uppercase">Sedang Ditinjau</span>
          <p class="text-2xl font-bold text-orange-600 mt-1">{{ keberatanStats.diproses }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span class="text-xs font-semibold text-emerald-500 uppercase">Selesai / Putusan</span>
          <p class="text-2xl font-bold text-emerald-600 mt-1">{{ keberatanStats.selesai }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span class="text-xs font-semibold text-red-500 uppercase">Ditolak</span>
          <p class="text-2xl font-bold text-red-600 mt-1">{{ keberatanStats.ditolak }}</p>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="relative w-full md:w-80">
          <i class="fas fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
          <input 
            v-model="searchKeberatan" 
            @keyup.enter="fetchKeberatan(1)"
            type="text" 
            placeholder="Cari kode tiket, nama, alasan..." 
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <select 
            v-model="statusFilterKeberatan" 
            @change="fetchKeberatan(1)"
            class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="diproses">Ditinjau</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
          </select>
          <button @click="fetchKeberatan(1)" class="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">
            Terapkan
          </button>
        </div>
      </div>

      <!-- Tabel Keberatan -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
              <tr>
                <th class="py-3 px-4">Tiket Keberatan</th>
                <th class="py-3 px-4">Reg. Asal</th>
                <th class="py-3 px-4">Pemohon / Kuasa</th>
                <th class="py-3 px-4">Alasan Keberatan (UU KIP)</th>
                <th class="py-3 px-4">Tanggal Masuk</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="loadingKeberatan">
                <td colspan="7" class="py-8 text-center text-gray-500">
                  <i class="fas fa-spinner fa-spin mr-2"></i> Memuat data keberatan...
                </td>
              </tr>
              <tr v-else-if="keberatanList.length === 0">
                <td colspan="7" class="py-8 text-center text-gray-400">
                  Tidak ada permohonan keberatan informasi.
                </td>
              </tr>
              <tr v-for="item in keberatanList" :key="item.id" class="hover:bg-gray-50">
                <td class="py-3 px-4 font-mono font-bold text-orange-600">
                  #{{ item.unique_code }}
                </td>
                <td class="py-3 px-4 font-mono text-gray-600 text-xs">
                  {{ item.nomor_pendaftaran_pemohon || '-' }}
                </td>
                <td class="py-3 px-4 font-medium text-gray-800">
                  {{ item.nama_pemohon }}
                  <span v-if="item.nama_kuasa" class="block text-xs text-gray-500">Kuasa: {{ item.nama_kuasa }}</span>
                </td>
                <td class="py-3 px-4 text-gray-600 max-w-xs truncate" :title="item.alasan_keberatan">
                  {{ item.alasan_keberatan }}
                </td>
                <td class="py-3 px-4 text-gray-500 text-xs">
                  {{ new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }}
                </td>
                <td class="py-3 px-4">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold uppercase', 
                    item.status_keberatan === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                    item.status_keberatan === 'diproses' ? 'bg-orange-100 text-orange-800' :
                    item.status_keberatan === 'ditolak' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-700']">
                    {{ item.status_keberatan }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center space-x-2">
                  <NuxtLink :to="`/admin/keberatan/${item.id}`" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md text-xs font-semibold inline-flex items-center gap-1" title="Detail">
                    <i class="fas fa-eye"></i> Detail
                  </NuxtLink>
                  <button @click="openRespond(item, 'respond-keberatan')" class="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-xs font-medium" title="Putusan Atasan">
                    <i class="fas fa-gavel"></i> Putusan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="lastPageKeberatan > 1" class="p-4 border-t border-gray-100 flex items-center justify-between">
          <button :disabled="pageKeberatan <= 1" @click="fetchKeberatan(pageKeberatan - 1)" class="px-3 py-1 bg-gray-100 rounded text-xs disabled:opacity-50">
            Sebelumnya
          </button>
          <span class="text-xs text-gray-500">Halaman {{ pageKeberatan }} dari {{ lastPageKeberatan }}</span>
          <button :disabled="pageKeberatan >= lastPageKeberatan" @click="fetchKeberatan(pageKeberatan + 1)" class="px-3 py-1 bg-gray-100 rounded text-xs disabled:opacity-50">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL DETAIL PERMOHONAN                    -->
    <!-- ========================================== -->
    <div v-if="modalType === 'detail-permohonan' && selectedItem" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="font-bold text-lg text-gray-800">Detail Permohonan #{{ selectedItem.unique_code }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong class="text-gray-500 block text-xs">Nama Pemohon:</strong> {{ selectedItem.nama_pemohon }}</div>
          <div><strong class="text-gray-500 block text-xs">Kontak:</strong> {{ selectedItem.nomor_telepon_pemohon }} ({{ selectedItem.email_pemohon }})</div>
          <div><strong class="text-gray-500 block text-xs">Pekerjaan:</strong> {{ selectedItem.pekerjaan || '-' }}</div>
          <div><strong class="text-gray-500 block text-xs">Status Permohonan:</strong> <span class="font-semibold uppercase">{{ selectedItem.status_permohonan }}</span></div>
        </div>

        <div class="text-sm">
          <strong class="text-gray-500 block text-xs">Alamat:</strong>
          <p class="bg-gray-50 p-2.5 rounded-lg mt-1 text-gray-700">{{ selectedItem.alamat_pemohon }}</p>
        </div>

        <div class="text-sm">
          <strong class="text-gray-500 block text-xs">Rincian Informasi yang Dimohon:</strong>
          <p class="bg-gray-50 p-2.5 rounded-lg mt-1 text-gray-700">{{ selectedItem.detail_informasi }}</p>
        </div>

        <div class="text-sm">
          <strong class="text-gray-500 block text-xs">Tujuan Penggunaan:</strong>
          <p class="bg-gray-50 p-2.5 rounded-lg mt-1 text-gray-700">{{ selectedItem.tujuan_penggunaan_informasi }}</p>
        </div>

        <!-- Riwayat Balasan -->
        <div v-if="selectedItem.responses?.length" class="border-t pt-3 space-y-2">
          <strong class="text-gray-700 text-xs uppercase block">Riwayat Tanggapan Resmi:</strong>
          <div v-for="resp in selectedItem.responses" :key="resp.id" class="bg-blue-50 p-3 rounded-lg text-xs space-y-1">
            <div class="flex justify-between font-semibold text-blue-900">
              <span>{{ resp.user?.name || 'Petugas PPID' }}</span>
              <span>{{ new Date(resp.created_at).toLocaleString('id-ID') }}</span>
            </div>
            <p class="text-gray-700">{{ resp.message }}</p>
            <div v-if="resp.link"><a :href="resp.link" target="_blank" class="text-blue-600 underline">Tautan Lampiran</a></div>
          </div>
        </div>

        <div class="flex justify-end pt-3 border-t">
          <button @click="closeModal" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL RESPOND PERMOHONAN                   -->
    <!-- ========================================== -->
    <div v-if="modalType === 'respond-permohonan' && selectedItem" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="font-bold text-lg text-gray-800">Tanggapi Permohonan #{{ selectedItem.unique_code }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Status Akhir Permohonan</label>
            <select v-model="responseStatus" class="w-full p-2.5 bg-gray-50 border rounded-lg">
              <option value="selesai">Selesai (Dikabulkan / Informasi Diberikan)</option>
              <option value="diproses">Sedang Diproses / Perlu Koordinasi OPD</option>
              <option value="ditolak">Ditolak (Informasi Dikecualikan / Tidak Dikuasai)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Pesan Tanggapan / Jawaban Resmi *</label>
            <textarea v-model="responseMessage" rows="4" placeholder="Tuliskan jawaban atau penjelasan resmi kepada pemohon..." class="w-full p-2.5 bg-gray-50 border rounded-lg"></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Tautan Lampiran Informasi (Opsional)</label>
            <input v-model="responseLink" type="url" placeholder="https://..." class="w-full p-2.5 bg-gray-50 border rounded-lg">
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Upload Berkas Jawaban (PDF / Doc / Gambar max 10MB)</label>
            <input type="file" @change="handleFileChange" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t">
          <button @click="closeModal" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Batal</button>
          <button :disabled="submittingResponse" @click="submitPermohonanResponse" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            {{ submittingResponse ? 'Mengirim...' : 'Kirim Tanggapan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL DETAIL KEBERATAN                     -->
    <!-- ========================================== -->
    <div v-if="modalType === 'detail-keberatan' && selectedItem" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="font-bold text-lg text-gray-800">Detail Keberatan #{{ selectedItem.unique_code }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><strong class="text-gray-500 block text-xs">Tiket Asal Permohonan:</strong> #{{ selectedItem.nomor_pendaftaran_pemohon || '-' }}</div>
          <div><strong class="text-gray-500 block text-xs">Status Keberatan:</strong> <span class="font-semibold uppercase">{{ selectedItem.status_keberatan }}</span></div>
          <div><strong class="text-gray-500 block text-xs">Nama Pemohon:</strong> {{ selectedItem.nama_pemohon }}</div>
          <div><strong class="text-gray-500 block text-xs">Kontak:</strong> {{ selectedItem.nomor_telepon_pemohon }}</div>
          <div v-if="selectedItem.nama_kuasa"><strong class="text-gray-500 block text-xs">Nama Kuasa:</strong> {{ selectedItem.nama_kuasa }}</div>
          <div v-if="selectedItem.nomor_telepon_kuasa"><strong class="text-gray-500 block text-xs">Kontak Kuasa:</strong> {{ selectedItem.nomor_telepon_kuasa }}</div>
        </div>

        <div class="text-sm">
          <strong class="text-gray-500 block text-xs">Alasan Pengajuan Keberatan (UU KIP):</strong>
          <p class="bg-orange-50 text-orange-950 p-2.5 rounded-lg mt-1 font-medium border border-orange-200">{{ selectedItem.alasan_keberatan }}</p>
        </div>

        <div class="text-sm">
          <strong class="text-gray-500 block text-xs">Kasus Posisi / Uraian Keberatan Pemohon:</strong>
          <p class="bg-gray-50 p-2.5 rounded-lg mt-1 text-gray-700 whitespace-pre-line">{{ selectedItem.kasus_posisi }}</p>
        </div>

        <div v-if="selectedItem.surat_kuasa_path" class="text-sm">
          <strong class="text-gray-500 block text-xs">Berkas Surat Kuasa / Lampiran:</strong>
          <a :href="`https://ppidkab.sinjaikab.go.id/storage/${selectedItem.surat_kuasa_path}`" target="_blank" class="inline-flex items-center gap-2 mt-1 text-blue-600 underline">
            <i class="fas fa-file-download"></i> Unduh Berkas Lampiran
          </a>
        </div>

        <div class="flex justify-end pt-3 border-t">
          <button @click="closeModal" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL RESPOND KEBERATAN                    -->
    <!-- ========================================== -->
    <div v-if="modalType === 'respond-keberatan' && selectedItem" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="font-bold text-lg text-gray-800">Putusan Atasan PPID #{{ selectedItem.unique_code }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Status Tindak Lanjut Keberatan</label>
            <select v-model="responseStatus" class="w-full p-2.5 bg-gray-50 border rounded-lg">
              <option value="selesai">Selesai (Keberatan Dikabulkan / Diberi Tanggapan)</option>
              <option value="diproses">Sedang Ditinjau / Pembahasan Internal</option>
              <option value="ditolak">Ditolak (Keberatan Tidak Beralasan)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Uraian Putusan / Tanggapan Atasan PPID *</label>
            <textarea v-model="responseMessage" rows="4" placeholder="Tuliskan pertimbangan dan putusan resmi atasan PPID..." class="w-full p-2.5 bg-gray-50 border rounded-lg"></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Upload Berkas Putusan / Tanggapan Resmi</label>
            <input type="file" @change="handleFileChange" class="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100">
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t">
          <button @click="closeModal" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Batal</button>
          <button :disabled="submittingResponse" @click="submitKeberatanResponse" class="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700">
            {{ submittingResponse ? 'Menyimpan...' : 'Simpan Putusan' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
