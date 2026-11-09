<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import FileUploader from '@/components/ui/FileUploader.vue'

const loading = ref(false)
const saving = ref(false)
const alertMsg = ref('')

const form = ref({
  visi: '',
  misi: '',
  tugas_fungsi: '',
  struktur_organisasi: '',
  dasar_hukum: '',
  maklumat: '',
  hak_kewajiban: '',
  file_sk: null,
  file_struktur: null,
  sk_ppid: '',
  bagan_struktur: ''
})

async function fetchProfile() {
  loading.value = true
  try {
    const res = await api.get('/admin/profil-ppid')
    if (res.data?.success && res.data.data) {
      const d = res.data.data
      form.value.visi = d.visi || ''
      form.value.misi = d.misi || ''
      form.value.tugas_fungsi = d.tugas_fungsi || ''
      form.value.struktur_organisasi = d.struktur_organisasi || ''
      form.value.dasar_hukum = d.dasar_hukum || ''
      form.value.maklumat = d.maklumat || ''
      form.value.hak_kewajiban = d.hak_kewajiban || ''
      form.value.sk_ppid = d.sk_ppid || ''
      form.value.bagan_struktur = d.bagan_struktur || ''
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  const fd = new FormData()
  fd.append('visi', form.value.visi)
  fd.append('misi', form.value.misi)
  fd.append('tugas_fungsi', form.value.tugas_fungsi)
  fd.append('struktur_organisasi', form.value.struktur_organisasi)
  fd.append('dasar_hukum', form.value.dasar_hukum)
  fd.append('maklumat', form.value.maklumat)
  fd.append('hak_kewajiban', form.value.hak_kewajiban)
  if (form.value.file_sk) fd.append('file_sk', form.value.file_sk)
  if (form.value.file_struktur) fd.append('file_struktur', form.value.file_struktur)

  try {
    const res = await api.post('/admin/profil-ppid', fd)
    if (res.data?.success) {
      alertMsg.value = 'Data Profil PPID Kabupaten Sinjai berhasil disimpan & diperbarui!'
      fetchProfile()
      setTimeout(() => alertMsg.value = '', 4000)
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan perubahan profil PPID')
  } finally {
    saving.value = false
  }
}

onMounted(() => fetchProfile())
</script>

<template>
  <div class="space-y-6 pb-12">
    <!-- Header Card -->
    <div class="bg-gradient-to-r from-slate-900 via-teal-950 to-blue-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200">
          <i class="fas fa-landmark"></i> Identitas & Legalitas Lembaga
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Profil & Regulasi PPID</h1>
        <p class="text-sm text-teal-200/80 max-w-2xl leading-relaxed">
          Kelola Visi, Misi, Tugas & Fungsi, SK Pembentukan PPID Sinjai, Bagan Struktur Organisasi, dan Maklumat Pelayanan dalam satu konsol terpadu.
        </p>
      </div>

      <button
        @click="saveProfile"
        :disabled="saving || loading"
        class="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
      >
        <i v-if="saving" class="fas fa-circle-notch fa-spin text-base"></i>
        <i v-else class="fas fa-check-double text-base"></i>
        <span>{{ saving ? 'Menyimpan...' : 'Simpan Pembaruan Profil' }}</span>
      </button>
    </div>

    <!-- Alert Notification -->
    <div v-if="alertMsg" class="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm font-semibold border border-emerald-200 flex items-center justify-between animate-fadeIn">
      <div class="flex items-center gap-2">
        <i class="fas fa-check-circle text-emerald-600"></i>
        <span>{{ alertMsg }}</span>
      </div>
      <button @click="alertMsg = ''" class="text-emerald-600 hover:text-emerald-800"><i class="fas fa-times"></i></button>
    </div>

    <div v-if="loading" class="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
      <i class="fas fa-circle-notch fa-spin text-3xl text-teal-600 mb-3"></i>
      <p class="text-sm font-semibold text-gray-600">Memuat profil dan regulasi PPID...</p>
    </div>

    <!-- Forms Sections Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Kolom Kiri: Visi, Misi & Landasan Legalitas -->
      <div class="space-y-6">
        <!-- Visi & Misi Card -->
        <div class="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div class="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div class="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <i class="fas fa-compass"></i>
            </div>
            <div>
              <h2 class="font-black text-gray-900 text-sm">Visi & Misi Layanan Informasi</h2>
              <p class="text-xs text-gray-400">Arah strategis keterbukaan informasi publik</p>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Visi PPID</label>
            <textarea
              v-model="form.visi"
              rows="3"
              placeholder="Masukkan visi resmi PPID Kabupaten Sinjai..."
              class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Misi PPID</label>
            <textarea
              v-model="form.misi"
              rows="6"
              placeholder="Masukkan butir-butir misi pelayanan informasi..."
              class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all leading-relaxed"
            ></textarea>
          </div>
        </div>

        <!-- Tugas, Fungsi & Dasar Hukum -->
        <div class="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div class="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <i class="fas fa-briefcase"></i>
            </div>
            <div>
              <h2 class="font-black text-gray-900 text-sm">Tugas, Fungsi & Dasar Hukum</h2>
              <p class="text-xs text-gray-400">Rincian operasional dan peraturan perundang-undangan</p>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Tugas & Fungsi PPID</label>
            <textarea
              v-model="form.tugas_fungsi"
              rows="5"
              placeholder="Jabaran tugas pokok dan fungsi PPID Utama serta Pelaksana..."
              class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Dasar Hukum Pembentukan & Regulasi</label>
            <textarea
              v-model="form.dasar_hukum"
              rows="4"
              placeholder="UU No. 14 Tahun 2008, Permendagri No. 3 Tahun 2017, Perbup Sinjai, dll..."
              class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all leading-relaxed"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Kolom Kanan: Berkas SK, Bagan Struktur & Maklumat -->
      <div class="space-y-6">
        <!-- Unggah Dokumen & Bagan -->
        <div class="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div class="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <i class="fas fa-file-pdf"></i>
            </div>
            <div>
              <h2 class="font-black text-gray-900 text-sm">Dokumen SK & Bagan Struktur</h2>
              <p class="text-xs text-gray-400">Lampiran bukti legalitas formal lembaga PPID</p>
            </div>
          </div>

          <!-- File Uploader SK PPID -->
          <FileUploader
            v-model="form.file_sk"
            :existingUrl="form.sk_ppid ? `https://ppidkab.sinjaikab.go.id/storage/${form.sk_ppid}` : ''"
            accept=".pdf"
            label="Salinan Surat Keputusan (SK) PPID Resmi"
            hint="Format: PDF Resmi (Maksimal 20MB)"
          />

          <!-- File Uploader Bagan Struktur -->
          <FileUploader
            v-model="form.file_struktur"
            :existingUrl="form.bagan_struktur ? `https://ppidkab.sinjaikab.go.id/storage/${form.bagan_struktur}` : ''"
            accept="image/*,.pdf"
            label="Bagan Struktur Organisasi PPID"
            hint="Format: PNG, JPG, WEBP, atau PDF (Maksimal 10MB)"
          />
        </div>

        <!-- Maklumat & Hak Kewajiban -->
        <div class="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          <div class="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <i class="fas fa-bullhorn"></i>
            </div>
            <div>
              <h2 class="font-black text-gray-900 text-sm">Maklumat & Hak Kewajiban</h2>
              <p class="text-xs text-gray-400">Pernyataan komitmen publik dan hak pemohon informasi</p>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Maklumat Pelayanan Informasi Publik</label>
            <textarea
              v-model="form.maklumat"
              rows="4"
              placeholder="Teks maklumat kesiapan memberikan pelayanan yang cepat, tepat, dan transparan..."
              class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Hak & Kewajiban Badan Publik dan Pemohon</label>
            <textarea
              v-model="form.hak_kewajiban"
              rows="4"
              placeholder="Uraian hak dan kewajiban sesuai UU Keterbukaan Informasi Publik..."
              class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all leading-relaxed"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
