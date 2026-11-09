<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import FileUploader from '@/components/ui/FileUploader.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const loading = ref(true)
const saving = ref(false)
const categories = ref([])
const units = ref([])
const errors = ref({})
const existingFileUrl = ref('')

const form = ref({
  standar_layanan_id: '',
  unit_id: '',
  nama: '',
  deskripsi: '',
  tahun_dokumen: '',
  jenis_dokumen: 'SOP Pelayanan',
  status: 'active',
  file: null
})

const jenisDokumenList = [
  { value: 'SOP Pelayanan', label: 'SOP Pelayanan', description: 'Standar Operasional Prosedur Layanan Informasi', icon: 'fas fa-tasks' },
  { value: 'Maklumat Pelayanan', label: 'Maklumat Pelayanan', description: 'Pernyataan kesanggupan dan komitmen pelayanan publik', icon: 'fas fa-bullhorn' },
  { value: 'Biaya & Tarif', label: 'Biaya & Tarif', description: 'Peraturan pembebanan biaya/tarif salinan dokumen', icon: 'fas fa-coins' },
  { value: 'Waktu Pelayanan', label: 'Waktu Pelayanan', description: 'Jadwal jam kerja & batas waktu tanggapan permohonan', icon: 'fas fa-clock' },
  { value: 'Tata Cara Keberatan', label: 'Tata Cara Keberatan', description: 'Pedoman alur pengajuan dan penyelesaian keberatan', icon: 'fas fa-scale-balanced' },
  { value: 'Lainnya', label: 'Lainnya / Umum', description: 'Dokumen pendukung standar operasional lainnya', icon: 'fas fa-file' }
]

const statusList = [
  { value: 'active', label: 'Aktif / Berlaku', description: 'Dapat dilihat dan diunduh oleh publik', icon: 'fas fa-check-circle', badge: 'Active' },
  { value: 'draft', label: 'Draft / Diarsipkan', description: 'Hanya dapat dilihat oleh admin internal', icon: 'fas fa-box-archive', badge: 'Draft' }
]

const categoryOptions = computed(() => {
  return categories.value.map(c => ({
    value: c.id,
    label: c.nama || c.title,
    description: 'Klasifikasi Pedoman Standar Layanan PPID',
    icon: 'fas fa-bookmark'
  }))
})

const unitOptions = computed(() => {
  return [
    { value: '', label: 'PPID Utama (Pemerintah Kabupaten Sinjai)', description: 'Sekretariat Utama PPID Sinjai', icon: 'fas fa-landmark' },
    ...units.value.map(u => ({
      value: u.unit_id,
      label: u.unit_nama,
      description: 'PPID Pelaksana OPD',
      icon: 'fas fa-building'
    }))
  ]
})

async function fetchData() {
  loading.value = true
  try {
    const res = await api.get(`/admin/standar-layanan/${id}`)
    if (res.data?.success && res.data.data) {
      const d = res.data.data
      categories.value = res.data.categories || []
      units.value = res.data.units || []

      form.value.standar_layanan_id = d.standar_layanan_id
      form.value.unit_id = d.unit_id || ''
      form.value.nama = d.nama || d.title || ''
      form.value.deskripsi = d.deskripsi || ''
      form.value.tahun_dokumen = d.tahun_dokumen ? d.tahun_dokumen.split('T')[0] : ''
      form.value.jenis_dokumen = d.jenis_dokumen || 'SOP Pelayanan'
      form.value.status = d.status || 'active'

      if (d.file_path) {
        existingFileUrl.value = `https://ppidkab.sinjaikab.go.id/storage/${d.file_path}`
      }
    }
  } catch (e) {
    alert('Gagal memuat data dokumen standar layanan.')
    router.push('/admin/standar-layanan')
  } finally {
    loading.value = false
  }
}

async function submitUpdate() {
  errors.value = {}
  if (!form.value.nama) {
    errors.value.nama = 'Nama atau judul dokumen wajib diisi.'
    return
  }

  saving.value = true
  const fd = new FormData()
  fd.append('standar_layanan_id', form.value.standar_layanan_id)
  if (form.value.unit_id) fd.append('unit_id', form.value.unit_id)
  fd.append('nama', form.value.nama)
  if (form.value.deskripsi) fd.append('deskripsi', form.value.deskripsi)
  if (form.value.tahun_dokumen) fd.append('tahun_dokumen', form.value.tahun_dokumen)
  fd.append('jenis_dokumen', form.value.jenis_dokumen)
  fd.append('status', form.value.status)
  if (form.value.file) fd.append('file', form.value.file)

  try {
    const res = await api.post(`/admin/standar-layanan/${id}`, fd)
    if (res.data?.success) {
      router.push('/admin/standar-layanan')
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal memperbarui data standar layanan')
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-12">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center justify-between">
      <NuxtLink
        to="/admin/standar-layanan"
        class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Kembali ke Daftar Standar Layanan</span>
      </NuxtLink>

      <span class="text-xs text-gray-400 font-medium">Halaman Edit Dokumen #{{ id }}</span>
    </div>

    <div v-if="loading" class="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
      <i class="fas fa-circle-notch fa-spin text-3xl text-blue-600 mb-3"></i>
      <p class="text-sm font-semibold text-gray-600">Memuat rincian dokumen...</p>
    </div>

    <!-- Form Card -->
    <div v-else class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <!-- Card Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-800 p-8 text-white">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-blue-200">
            <i class="fas fa-pen-nib text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight">Perbarui Standar Layanan</h1>
            <p class="text-xs text-blue-200/80 mt-0.5">Edit atribut metadata dan berkas lampiran SOP atau Maklumat</p>
          </div>
        </div>
      </div>

      <!-- Main Form Body -->
      <form @submit.prevent="submitUpdate" class="p-8 space-y-8">
        <!-- Section 1: Klasifikasi & Instansi -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-layer-group"></i> 1. Klasifikasi Kategori & OPD
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Kategori Standar Layanan <span class="text-red-500">*</span>
              </label>
              <CustomSelect
                v-model="form.standar_layanan_id"
                :options="categoryOptions"
                placeholder="Pilih Kategori Standar"
                :error="errors.standar_layanan_id"
              />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Unit Kerja / OPD Terkait
              </label>
              <CustomSelect
                v-model="form.unit_id"
                :options="unitOptions"
                placeholder="Pilih Unit Kerja (Default: PPID Utama)"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Detail Informasi Dokumen -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-file-lines"></i> 2. Rincian & Identitas Dokumen
          </h2>

          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Nama / Judul Dokumen Standar Layanan <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.nama"
                type="text"
                placeholder="Contoh: Standar Operasional Prosedur (SOP) Penanganan Keberatan Informasi"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-100': errors.nama }"
              />
              <p v-if="errors.nama" class="mt-1 text-xs text-red-500 font-medium">{{ errors.nama }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Jenis Dokumen
                </label>
                <CustomSelect
                  v-model="form.jenis_dokumen"
                  :options="jenisDokumenList"
                  placeholder="Pilih Jenis Dokumen"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Tahun Penetapan Dokumen
                </label>
                <input
                  v-model="form.tahun_dokumen"
                  type="date"
                  class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all duration-200"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Status Publikasi
                </label>
                <CustomSelect
                  v-model="form.status"
                  :options="statusList"
                  placeholder="Pilih Status"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Deskripsi atau Ringkasan Prosedur
              </label>
              <textarea
                v-model="form.deskripsi"
                rows="4"
                placeholder="Jelaskan secara ringkas maksud, tujuan, landasan hukum, atau poin penting dari standar layanan ini..."
                class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all duration-200 leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Section 3: Unggah Berkas PDF -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-cloud-arrow-up"></i> 3. Berkas Lampiran PDF / SK
          </h2>

          <FileUploader
            v-model="form.file"
            :existingUrl="existingFileUrl"
            label="Ganti Berkas Salinan Dokumen PDF Resmi"
            hint="Format resmi yang diizinkan: PDF (Maksimal 20MB). Biarkan kosong jika tidak ingin mengubah berkas saat ini."
          />
        </div>

        <!-- Actions -->
        <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <NuxtLink
            to="/admin/standar-layanan"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Batal
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check-double"></i>
            <span>{{ saving ? 'Memperbarui...' : 'Simpan Perubahan' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
