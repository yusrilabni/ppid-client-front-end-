<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'

const items = ref([])
const loading = ref(false)
const searchQuery = ref('')
const selectedYear = ref(new Date().getFullYear())
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0
})

const showUploadModal = ref(false)
const saving = ref(false)
const officialsList = ref([])

const form = ref({
  official_id: '',
  report_year: new Date().getFullYear(),
  status: 'Sudah Lapor (Terverifikasi)',
  submission_date: '',
  announcement_date: '',
  receipt_number: '',
  elhkpn_url: '',
  receipt_file: null,
  notes: ''
})

function onFileChange(e) {
  const f = e.target.files[0]
  if (f) form.value.receipt_file = f
}

async function fetchOfficials() {
  try {
    const res = await api.get('/admin/officials', { params: { per_page: 100 } })
    if (res.data?.success && res.data?.data) {
      officialsList.value = res.data.data.data || []
    }
  } catch (err) {
    console.error('Failed to load officials:', err)
  }
}

async function fetchLhkpn(page = 1) {
  loading.value = true
  try {
    const params = {
      page,
      per_page: 15,
      year: selectedYear.value,
      q: searchQuery.value
    }
    const res = await api.get('/admin/lhkpn-admin', { params })
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
    console.error('Failed to load LHKPN:', err)
  } finally {
    loading.value = false
  }
}

async function submitLhkpn() {
  if (!form.value.report_year) {
    alert('Tahun pelaporan wajib diisi.')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    if (form.value.official_id) formData.append('official_id', form.value.official_id)
    formData.append('report_year', form.value.report_year)
    formData.append('status', form.value.status)
    if (form.value.submission_date) formData.append('submission_date', form.value.submission_date)
    if (form.value.announcement_date) formData.append('announcement_date', form.value.announcement_date)
    if (form.value.receipt_number) formData.append('receipt_number', form.value.receipt_number)
    if (form.value.elhkpn_url) formData.append('elhkpn_url', form.value.elhkpn_url)
    if (form.value.notes) formData.append('notes', form.value.notes)
    if (form.value.receipt_file) formData.append('receipt_file', form.value.receipt_file)

    const res = await api.post('/admin/lhkpn-admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data?.success) {
      alert('Tanda terima LHKPN berhasil disimpan.')
      showUploadModal.value = false
      fetchLhkpn(pagination.value.current_page)
    }
  } catch (err) {
    alert('Gagal menyimpan LHKPN: ' + (err.response?.data?.message || err.message))
  } finally {
    saving.value = false
  }
}

async function deleteItem(item) {
  if (!confirm(`Hapus data LHKPN ${item.official?.full_name || 'ini'}?`)) return
  try {
    const res = await api.delete(`/admin/lhkpn-admin/${item.id}`)
    if (res.data?.success) {
      fetchLhkpn(pagination.value.current_page)
    }
  } catch (err) {
    alert('Gagal menghapus LHKPN: ' + (err.response?.data?.message || err.message))
  }
}

let searchTimer = null
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchLhkpn(1)
  }, 400)
})

watch(selectedYear, () => {
  fetchLhkpn(1)
})

onMounted(() => {
  fetchLhkpn()
  fetchOfficials()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg">
            <i class="fas fa-file-shield"></i>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Kepatuhan LHKPN Pimpinan & Pejabat</h1>
            <p class="text-xs text-gray-500 mt-0.5">Kelola bukti tanda terima pelaporan LHKPN KPK para penyelenggara negara</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="showUploadModal = true"
          class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-teal-600/20 transition flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          <span>Input Tanda Terima LHKPN</span>
        </button>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama pejabat..."
          class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition"
        />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <label class="text-xs font-bold text-gray-500">Tahun:</label>
        <input
          v-model="selectedYear"
          type="number"
          class="w-28 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gradient-to-r from-teal-700 to-teal-900 text-white text-left">
            <tr>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Pejabat / Penyelenggara</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Jabatan & Unit Kerja</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Tahun Lapor</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">Status KPK</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider">No. Tanda Terima</th>
              <th class="px-6 py-4 text-xs font-black uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-if="loading">
              <td colspan="6" class="py-12 text-center text-gray-400">
                <i class="fas fa-circle-notch fa-spin text-2xl text-teal-600 mb-2"></i>
                <p class="text-xs font-bold">Memuat data LHKPN...</p>
              </td>
            </tr>

            <template v-else-if="items.length > 0">
              <tr v-for="item in items" :key="item.id" class="hover:bg-teal-50/40 transition">
                <td class="px-6 py-4">
                  <p class="text-xs font-black text-gray-900">{{ item.official?.full_name || 'Umum / Pejabat' }}</p>
                  <p v-if="item.official?.nip" class="text-[10px] text-gray-500">NIP: {{ item.official.nip }}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-xs font-bold text-gray-700">{{ item.official?.position?.name || '-' }}</p>
                  <p class="text-[10px] text-gray-400">{{ item.official?.organization?.name || '-' }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-xs font-black text-gray-800">
                  {{ item.report_year }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      item.status && item.status.includes('Terverifikasi') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800',
                      'px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1'
                    ]"
                  >
                    <i class="fas fa-check-shield"></i>
                    <span>{{ item.status }}</span>
                  </span>
                </td>
                <td class="px-6 py-4 text-xs font-mono font-bold text-gray-600">
                  {{ item.receipt_number || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <a
                      v-if="item.receipt_file_path"
                      :href="`https://ppidkab.sinjaikab.go.id/storage/${item.receipt_file_path}`"
                      target="_blank"
                      class="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Lihat Berkas Tanda Terima"
                    >
                      <i class="fas fa-file-pdf"></i>
                    </a>
                    <a
                      v-if="item.elhkpn_url"
                      :href="item.elhkpn_url"
                      target="_blank"
                      class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Buka Link e-LHKPN KPK"
                    >
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                    <button
                      @click="deleteItem(item)"
                      class="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs transition"
                      title="Hapus"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </template>

            <tr v-else>
              <td colspan="6" class="py-16 text-center text-gray-400">
                <i class="fas fa-file-circle-exclamation text-4xl mb-3 text-gray-300"></i>
                <p class="text-sm font-bold text-gray-700">Tidak ada riwayat LHKPN ditemukan pada tahun ini</p>
                <p class="text-xs text-gray-400 mt-1">Gunakan tombol "Input Tanda Terima LHKPN" untuk mencatat kepatuhan</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="p-4 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-500 font-bold">
          Total: <span class="text-gray-900">{{ pagination.total }}</span> catatan
        </p>
        <div class="flex items-center gap-1">
          <button
            :disabled="pagination.current_page <= 1"
            @click="fetchLhkpn(pagination.current_page - 1)"
            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <span class="px-3 py-1.5 text-xs font-black text-gray-700">
            {{ pagination.current_page }} / {{ pagination.last_page }}
          </span>
          <button
            :disabled="pagination.current_page >= pagination.last_page"
            @click="fetchLhkpn(pagination.current_page + 1)"
            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold disabled:opacity-40 hover:bg-gray-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Input LHKPN -->
    <div v-if="showUploadModal" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 class="text-base font-black text-gray-900">Input Tanda Terima LHKPN</h3>
          <button @click="showUploadModal = false" class="text-gray-400 hover:text-gray-600 text-lg">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Pilih Pejabat</label>
            <select
              v-model="form.official_id"
              class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">-- Pilih Penyelenggara Negara --</option>
              <option v-for="off in officialsList" :key="off.id" :value="off.id">
                {{ off.full_name }} ({{ off.position?.name || off.organization?.name }})
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Tahun Lapor <span class="text-rose-500">*</span></label>
              <input
                v-model="form.report_year"
                type="number"
                class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Status Verifikasi KPK</label>
              <select
                v-model="form.status"
                class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="Sudah Lapor (Terverifikasi)">Sudah Lapor (Terverifikasi)</option>
                <option value="Sudah Lapor (Dalam Proses)">Sudah Lapor (Dalam Proses)</option>
                <option value="Belum Lapor">Belum Lapor</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Tgl. Lapor</label>
              <input
                v-model="form.submission_date"
                type="date"
                class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1">Tgl. Pengumuman KPK</label>
              <input
                v-model="form.announcement_date"
                type="date"
                class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Nomor Tanda Terima KPK</label>
            <input
              v-model="form.receipt_number"
              type="text"
              placeholder="Contoh: KPK-2025-XXXXX"
              class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Tautan Publikasi e-LHKPN KPK</label>
            <input
              v-model="form.elhkpn_url"
              type="url"
              placeholder="https://elhkpn.kpk.go.id/..."
              class="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Unggah Berkas Tanda Terima (PDF/Foto)</label>
            <input
              type="file"
              @change="onFileChange"
              class="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            @click="showUploadModal = false"
            class="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            :disabled="saving"
            @click="submitLhkpn"
            class="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            <i class="fas fa-check" :class="{ 'fa-spin': saving }"></i>
            <span>{{ saving ? 'Menyimpan...' : 'Simpan Data' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
