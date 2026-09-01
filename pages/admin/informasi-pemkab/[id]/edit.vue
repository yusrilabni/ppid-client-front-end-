<template>
  <div class="relative min-h-screen bg-gray-50 pt-4 md:pt-6 pb-16">
    <!-- Dekorasi Background -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-amber-900 via-amber-800 to-transparent"></div>
      <div class="absolute inset-0 opacity-10 mix-blend-overlay" style="background-image: url('https://www.transparenttextures.com/patterns/cubes.png');"></div>
    </div>

    <div class="container max-w-5xl mx-auto px-4 relative z-10">
      <div class="mb-6">
        <Breadcrumbs :breadcrumbs="breadcrumbItems" theme="dark" />
      </div>

      <div v-if="loading" class="bg-white rounded-xl shadow-lg p-12 text-center relative z-20">
        <i class="fas fa-spinner fa-spin text-4xl text-amber-500 mb-4"></i>
        <p class="text-gray-500">Memuat data informasi...</p>
      </div>

      <div v-else-if="loadError" class="mb-6 bg-red-50/90 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-sm flex items-start backdrop-blur-sm relative z-20">
        <div class="flex-shrink-0 mt-0.5">
          <i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-bold text-red-800">Gagal Memuat Dokumen</h3>
          <p class="mt-1 text-sm">{{ loadError }}</p>
          <button @click="$router.back()" class="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">Kembali</button>
        </div>
      </div>

      <div v-else class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative z-10">
        <div class="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-8 md:p-10 text-white relative overflow-hidden">
          <!-- Dekorasi Header Card -->
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl"></div>
          
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-extrabold tracking-tight drop-shadow-md">Edit Dokumen Pemkab</h1>
              <p class="text-amber-100 mt-2 font-medium opacity-90 text-lg">Perbarui informasi publik dalam sistem.</p>
            </div>
            <div class="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner">
              <i class="fas fa-edit text-3xl text-white"></i>
            </div>
          </div>
        </div>

        <div v-if="error" class="mx-8 mt-8 bg-red-50/90 border border-red-200 text-red-700 px-6 py-4 rounded-2xl shadow-sm flex items-start">
          <div class="flex-shrink-0 mt-0.5">
            <i class="fas fa-exclamation-circle text-red-500 text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-bold text-red-800">Gagal Memperbarui Dokumen</h3>
            <p class="mt-1 text-sm">{{ error }}</p>
          </div>
        </div>

        <div class="p-8 md:p-10">
          <form @submit.prevent="submitForm" enctype="multipart/form-data">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Judul -->
              <div class="md:col-span-2">
                <label for="judul" class="block text-gray-700 text-sm font-bold mb-3">Judul Dokumen <span class="text-red-500">*</span></label>
                <div class="flex space-x-2">
                  <input v-model="form.judul" type="text" id="judul" placeholder="Masukkan judul yang deskriptif..."
                    class="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 font-medium text-gray-800 placeholder-gray-400 shadow-sm" required>
                  <button type="button" @click="generateAI" :disabled="generatingAI" class="relative group bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all duration-300 flex items-center justify-center min-w-[160px] transform hover:-translate-y-1 z-10 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-not-allowed">
                    <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500 group-hover:duration-200 -z-10"></div>
                    <span class="relative flex items-center gap-2">
                      <i class="fas fa-sparkles" :class="{'animate-pulse': !generatingAI, 'fa-spin': generatingAI}"></i> {{ generatingAI ? 'Generating...' : 'Generate AI' }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Deskripsi -->
              <div class="md:col-span-2">
                <label for="deskripsi" class="block text-gray-700 text-sm font-bold mb-3">Deskripsi (Opsional)</label>
                <textarea v-model="form.deskripsi" id="deskripsi" rows="3" placeholder="Tuliskan keterangan singkat mengenai dokumen ini..."
                  class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 font-medium text-gray-800 placeholder-gray-400 shadow-sm"></textarea>
              </div>

              <!-- Kategori -->
              <div class="relative z-[80]">
                <label for="kategori" class="block text-gray-700 text-sm font-bold mb-3">Kategori <span class="text-red-500">*</span></label>
                <CustomSelect 
                  v-model="form.kategori"
                  :options="kategoriOptions"
                  placeholder="Pilih Kategori Dokumen"
                  :searchable="false"
                  class="shadow-sm"
                />
              </div>

              <!-- Jenis Dokumen -->
              <div class="relative z-[80]" ref="jenisDropdownRef">
                <label class="block text-gray-700 text-sm font-bold mb-3">Jenis Dokumen (Tags) <span class="text-gray-400 font-normal text-xs ml-1">(Pilih 1 - 3 tag)</span> <span class="text-red-500">*</span></label>
                <div class="relative w-full">
                  <button type="button" @click="showJenisDropdown = !showJenisDropdown"
                    class="relative w-full bg-white border-2 border-gray-100 rounded-2xl shadow-sm pl-5 pr-12 py-4 text-left cursor-pointer focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all duration-300 group">
                    <span class="flex items-center block truncate font-bold text-gray-900">{{ selectedJenisLabels }}</span>
                    <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <div class="p-1 rounded-lg bg-gray-50 group-hover:bg-amber-50 transition-colors duration-300">
                        <i class="fas fa-chevron-down h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-transform duration-300" :class="showJenisDropdown ? 'rotate-180' : ''"></i>
                      </div>
                    </span>
                  </button>
                  <div v-show="showJenisDropdown" class="absolute mt-1 w-full rounded-2xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] z-[9999] border border-gray-100 max-h-72 overflow-y-auto">
                    <label v-for="(opt, idx) in jenisDokumenOptions" :key="idx" 
                           class="flex items-center mx-2 my-1 px-4 py-3 hover:bg-amber-50 cursor-pointer rounded-xl transition-colors"
                           :class="{'opacity-50 cursor-not-allowed hover:bg-transparent': form.jenis_dokumen.length >= 3 && !form.jenis_dokumen.includes(opt.value)}">
                      <input type="checkbox" :value="opt.value" 
                        v-model="form.jenis_dokumen"
                        :disabled="form.jenis_dokumen.length >= 3 && !form.jenis_dokumen.includes(opt.value)"
                        class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 disabled:opacity-50">
                      <span class="ml-3 text-sm font-medium text-gray-700">{{ opt.label }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- OPD Source -->
              <div v-if="isSuperAdmin" class="relative z-[70]">
                <label for="target_unit" class="block text-gray-700 text-sm font-bold mb-3">Sumber OPD (Dinas) <span class="text-red-500">*</span></label>
                <CustomSelect 
                  v-model="form.target_unit"
                  :options="unitsOptions"
                  placeholder="Pilih Sumber OPD"
                  :searchable="true"
                  class="shadow-sm"
                />
              </div>

              <!-- Tanggal Dokumen -->
              <div class="relative z-[70]">
                <label for="tanggal_dokumen" class="block text-gray-700 text-sm font-bold mb-3">Tanggal Dokumen <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <i class="far fa-calendar-alt text-gray-400"></i>
                  </div>
                  <input v-model="form.tanggal_dokumen" type="date" id="tanggal_dokumen"
                    class="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 font-bold text-gray-800 shadow-sm" required>
                </div>
              </div>

              <!-- Status & Jadwal -->
              <div class="md:col-span-2 border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors duration-300 relative z-30">
                <label class="block text-gray-800 text-base font-bold mb-4">Pengaturan Penerbitan <span class="text-red-500">*</span></label>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
                  <div class="relative z-[60]">
                    <label class="block text-gray-700 text-sm font-bold mb-3">Status Dokumen</label>
                    <CustomSelect 
                      v-model="form.status"
                      :options="statusOptions"
                      placeholder="Pilih Status"
                      :searchable="false"
                      class="shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-gray-700 text-sm font-bold mb-3">Visibilitas</label>
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <label class="flex-1 flex items-center p-3 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-amber-300 transition-all">
                        <input type="radio" v-model="form.visibility" value="public" class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500">
                        <span class="ml-3 text-sm font-bold text-gray-800">Publik <span class="block font-normal text-xs text-gray-500">Dapat dilihat semua orang</span></span>
                      </label>
                      <label class="flex-1 flex items-center p-3 border border-gray-200 rounded-xl bg-white cursor-pointer hover:border-amber-300 transition-all">
                        <input type="radio" v-model="form.visibility" value="private" class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500">
                        <span class="ml-3 text-sm font-bold text-gray-800">Privat <span class="block font-normal text-xs text-gray-500">Hanya untuk internal</span></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <!-- Input Jadwal -->
                <div v-show="form.status === 'scheduled'" class="mt-6 pt-6 border-t border-gray-200">
                  <label for="published_at" class="block text-gray-700 text-sm font-bold mb-3">Pilih Tanggal & Waktu Rilis</label>
                  <input v-model="form.published_at" type="datetime-local" id="published_at"
                    class="w-full md:w-1/2 px-5 py-4 bg-white border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 font-medium text-gray-800 shadow-sm">
                </div>
              </div>

              <!-- Tipe Upload & Input File/URL -->
              <div class="md:col-span-2 border-2 border-dashed border-amber-200 rounded-2xl p-6 bg-amber-50/30 hover:bg-amber-50/60 transition-colors duration-300 group">
                <label class="block text-amber-900 text-base font-bold mb-4">Metode Lampiran Dokumen <span class="text-red-500">*</span></label>
                
                <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 mb-6">
                  <label class="flex items-center cursor-pointer p-4 border border-amber-100 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
                    <input type="radio" v-model="form.upload_method" value="file" class="w-5 h-5 text-amber-600 border-gray-300 focus:ring-amber-500">
                    <div class="ml-3">
                      <span class="block text-sm font-bold text-gray-800">Upload File Lokal</span>
                      <span class="block text-xs text-gray-500 mt-0.5">PDF, Word, Excel, ZIP, dll (Max 10MB)</span>
                    </div>
                  </label>
                  <label class="flex items-center cursor-pointer p-4 border border-amber-100 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
                    <input type="radio" v-model="form.upload_method" value="link" class="w-5 h-5 text-amber-600 border-gray-300 focus:ring-amber-500">
                    <div class="ml-3">
                      <span class="block text-sm font-bold text-gray-800">Link Eksternal</span>
                      <span class="block text-xs text-gray-500 mt-0.5">Google Drive, Dropbox, dll.</span>
                    </div>
                  </label>
                </div>

                <div v-if="existingFile" class="mb-6 p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-3 shadow-sm">
                  <i class="fas fa-file-alt text-amber-500 text-xl"></i>
                  <div class="flex-1">
                    <p class="text-sm font-bold text-gray-800">File saat ini:</p>
                    <a :href="existingFile" target="_blank" class="text-xs text-amber-600 hover:underline break-all">{{ existingFile }}</a>
                  </div>
                </div>

                <!-- Input File Lokal -->
                <div v-show="form.upload_method === 'file'">
                  <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <label for="file" class="block text-gray-700 text-sm font-bold mb-3">Upload File Baru <span class="text-gray-400 text-xs font-normal">(Kosongkan jika tidak ingin mengubah)</span></label>
                    <input type="file" ref="fileInput" id="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg,.webp,.svg"
                      class="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 transition-all cursor-pointer bg-gray-50 rounded-xl border border-gray-100">
                  </div>
                </div>

                <!-- Input Link Eksternal -->
                <div v-show="form.upload_method === 'link'">
                  <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <label for="link" class="block text-gray-700 text-sm font-bold mb-3">Masukkan URL Dokumen</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i class="fas fa-link text-gray-400"></i>
                      </div>
                      <input v-model="form.link" type="url" id="link" placeholder="https://drive.google.com/..."
                        class="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all duration-300 font-medium text-gray-800 placeholder-gray-400">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end sm:space-x-4 relative z-10">
              <button type="button" @click="$router.back()" class="mt-3 sm:mt-0 px-8 py-3.5 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center">
                Batal
              </button>
              <button type="submit" :disabled="submitting"
                :class="{ 'opacity-70 cursor-not-allowed': submitting, 'hover:-translate-y-0.5 hover:from-amber-700 hover:to-amber-800 hover:shadow-amber-600/40': !submitting }"
                class="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 transform flex items-center justify-center">
                <i class="fas fa-paper-plane mr-2" v-if="!submitting"></i> 
                <i class="fas fa-circle-notch fa-spin mr-2" v-if="submitting"></i>
                <span>{{ submitting ? 'Menyimpan...' : 'Perbarui Dokumen' }}</span>
              </button>
            </div>
          </form>

          <!-- Modal Konfirmasi Private -->
          <Teleport to="body">
            <div v-if="showPrivateModal" class="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto overflow-x-hidden">
              <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="cancelPrivate()"></div>
              <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 m-4 z-[10000]">
                <div class="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mx-auto mb-6 shadow-inner">
                  <i class="fas fa-lock text-4xl text-orange-500"></i>
                </div>
                <h3 class="text-2xl font-black text-gray-900 text-center mb-4 tracking-tight">Ketentuan Privat</h3>
                <p class="text-sm text-gray-600 text-center mb-8 leading-relaxed">
                  Dokumen ini <strong class="text-red-600">tidak akan dibuka untuk umum</strong>.<br><br>
                  Hanya dapat dilihat oleh Admin yang login. Anda dapat membagikan <strong class="text-gray-800">link detailnya</strong> nanti kepada orang yang bersangkutan.
                </p>
                <div class="flex flex-col space-y-3">
                  <button type="button" @click="acceptPrivate()" class="w-full px-6 py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
                    Ya, Saya Setuju
                  </button>
                  <button type="button" @click="cancelPrivate()" class="w-full px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                    Batal (Kembali ke Publik)
                  </button>
                </div>
              </div>
            </div>
          </Teleport>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import CustomSelect from '@/components/CustomSelect.vue'

const router = useRouter()
const route = useRoute()
const docId = route.params.id

const breadcrumbItems = [
  { title: 'Beranda', url: '/', icon: 'fas fa-home' },
  { title: 'Transparansi', url: '#', icon: 'fas fa-layer-group' },
  { title: 'Informasi Pemkab', url: '/transparansi/informasi-pemkab', icon: 'fas fa-file-pdf' },
  { title: 'Edit Dokumen', url: null, icon: 'fas fa-edit' }
]

const KATEGORI_JENIS_DOKUMEN = {
  'Perencanaan': ['RPJPD', 'RPJMD', 'RKPD', 'Renstra', 'Renja', 'IPKD'],
  'Keuangan': ['RKA', 'KUA', 'PPAS', 'APBD', 'APBD Perubahan', 'DPA', 'DPPA', 'LKPD', 'LRA', 'LO', 'Neraca', 'CaLK', 'IPKD', 'Laporan Keuangan'],
  'Peraturan dan Kebijakan': ['Perda', 'Perbup', 'Keputusan Bupati', 'Surat Edaran', 'Instruksi', 'IPKD'],
  'Organisasi dan Tata Laksana': ['SOP', 'Standar Pelayanan', 'Maklumat Pelayanan', 'Peta Proses Bisnis', 'SOTK'],
  'Pelayanan Publik': ['Formulir', 'Panduan', 'Persyaratan', 'Alur Pelayanan'],
  'Kepegawaian': ['SK', 'SKP', 'Diklat', 'Mutasi', 'Kenaikan Pangkat'],
  'Monitoring, Evaluasi dan Pelaporan': ['LKjIP', 'LKPJ', 'LPPD', 'SAKIP', 'Laporan Triwulan', 'Laporan Tahunan'],
  'Pengawasan dan Audit': ['LHP BPK', 'LHP Inspektorat', 'Tindak Lanjut Audit'],
  'Kerja Sama': ['MoU', 'PKS'],
  'Statistik dan Data': ['Statistik Sektoral', 'Metadata Statistik', 'Buku Statistik'],
  'Teknologi Informasi': ['SPBE', 'Arsitektur SPBE', 'Masterplan TIK', 'Keamanan Informasi'],
  'Aset Daerah': ['KIB', 'Inventaris Barang', 'Penghapusan Barang'],
  'Pengumuman Lainnya': ['Pengumuman Lainnya']
}

const kategoriOptions = Object.keys(KATEGORI_JENIS_DOKUMEN).map(kat => ({ value: kat, label: kat }))
const jenisDokumenOptions = computed(() => {
  let allOpts = []
  Object.values(KATEGORI_JENIS_DOKUMEN).forEach(arr => {
    arr.forEach(item => {
      if (!allOpts.find(o => o.value === item)) {
        allOpts.push({value: item, label: item})
      }
    })
  })
  allOpts.sort((a, b) => a.label.localeCompare(b.label))
  return allOpts
})

const statusOptions = [
  { value: 'published', label: 'Langsung Terbitkan (Published)' },
  { value: 'draft', label: 'Simpan Sebagai Draft' },
  { value: 'scheduled', label: 'Jadwalkan Penerbitan' }
]

const form = ref({
  judul: '',
  deskripsi: '',
  kategori: '',
  jenis_dokumen: [],
  target_unit: '',
  tanggal_dokumen: '',
  status: 'published',
  visibility: 'public',
  published_at: '',
  upload_method: 'file',
  link: ''
})

const existingFile = ref('')
const fileInput = ref(null)
const submitting = ref(false)
const generatingAI = ref(false)
const loading = ref(true)
const loadError = ref('')
const error = ref('')

const isSuperAdmin = ref(true)
const units = ref([])
const unitsOptions = computed(() => units.value.map(unit => ({ value: String(unit.remote_id || unit.id), label: unit.name })))

const jenisDropdownRef = ref(null)
const showJenisDropdown = ref(false)

const showPrivateModal = ref(false)
let isRevertingVisibility = false

const selectedJenisLabels = computed(() => {
  if (form.value.jenis_dokumen.length === 0) return 'Pilih Jenis Dokumen (Maks. 3)'
  return form.value.jenis_dokumen.join(', ')
})

watch(() => form.value.visibility, (newVal) => {
  if (newVal === 'private' && !isRevertingVisibility && !loading.value) {
    showPrivateModal.value = true
    if (typeof document !== 'undefined') document.body.classList.add('overflow-hidden')
  }
})

const cancelPrivate = () => {
  showPrivateModal.value = false
  if (typeof document !== 'undefined') document.body.classList.remove('overflow-hidden')
  isRevertingVisibility = true
  form.value.visibility = 'public'
  setTimeout(() => isRevertingVisibility = false, 100)
}

const acceptPrivate = () => {
  showPrivateModal.value = false
  if (typeof document !== 'undefined') document.body.classList.remove('overflow-hidden')
}

const handleClickOutside = (e) => {
  if (jenisDropdownRef.value && !jenisDropdownRef.value.contains(e.target)) {
    showJenisDropdown.value = false
  }
}

onMounted(async () => {
  if (typeof document !== 'undefined') document.addEventListener('click', handleClickOutside)
  
  const authStore = useAuthStore()
  if (authStore.user) {
    isSuperAdmin.value = authStore.isSuperAdmin
  } else if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user') || localStorage.getItem('auth.user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        isSuperAdmin.value = user.role === 'superadmin' || user.is_superadmin === 1
      } catch (e) {}
    }
  }

  await fetchUnits()
  await loadData()
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.removeEventListener('click', handleClickOutside)
})

const fetchUnits = async () => {
  try {
    const res = await api.get('/units')
    if (res.data && Array.isArray(res.data.data)) units.value = res.data.data
    else if (Array.isArray(res.data)) units.value = res.data
  } catch (err) {}
}

const loadData = async () => {
  try {
    const response = await api.get(`/informasi-pemkab-crud/${docId}/edit`)
    if (response.data && response.data.data) {
      const data = response.data.data
      form.value.judul = data.judul || ''
      form.value.deskripsi = data.deskripsi || ''
      form.value.kategori = data.kategori || ''
      
      try {
        form.value.jenis_dokumen = typeof data.jenis_dokumen === 'string' ? JSON.parse(data.jenis_dokumen) : (data.jenis_dokumen || [])
      } catch(e) { form.value.jenis_dokumen = [] }
      
      form.value.target_unit = data.target_unit ? String(data.target_unit) : ''
      form.value.tanggal_dokumen = data.tanggal_dokumen ? data.tanggal_dokumen.split(' ')[0] : ''
      form.value.status = data.status || 'published'
      
      isRevertingVisibility = true
      form.value.visibility = data.visibility || 'public'
      setTimeout(() => isRevertingVisibility = false, 500)
      
      form.value.published_at = data.published_at ? data.published_at.substring(0, 16) : ''
      
      form.value.upload_method = data.upload_method || 'file'
      form.value.link = data.link || ''
      if (data.file) {
        existingFile.value = data.file.startsWith('http') ? data.file : `${api.defaults.baseURL.replace('/api/v1', '')}/${data.file}`
      }
    }
  } catch (err) {
    loadError.value = err.response?.data?.message || 'Gagal memuat data dokumen dari server.'
  } finally {
    loading.value = false
  }
}

const generateAI = async () => {
  const titleVal = form.value.judul.trim()
  if (titleVal.length < 3) {
    alert('Masukkan minimal 3 karakter topik/judul sebelum menggunakan AI.')
    return
  }
  generatingAI.value = true
  try {
    const res = await api.post('/ai-settings/generate', { prompt: titleVal, context: 'pemkab' })
    if (res.data.success && res.data.data) {
      const data = res.data.data
      if (data.title) form.value.judul = data.title
      if (data.doc_desc) form.value.deskripsi = data.doc_desc
      if (data.category) form.value.kategori = data.category
      if (data.jenis_dokumen) {
        let values = Array.isArray(data.jenis_dokumen) ? data.jenis_dokumen : [data.jenis_dokumen]
        form.value.jenis_dokumen = []
        values.forEach(v => {
          if (form.value.jenis_dokumen.length < 3 && !form.value.jenis_dokumen.includes(v)) {
            form.value.jenis_dokumen.push(v)
          }
        })
      }
      if (data.tahun) {
        form.value.tanggal_dokumen = data.tahun + '-01-01'
      }
    }
  } catch (err) {
    alert('Terjadi kesalahan koneksi saat memanggil AI.')
  } finally {
    generatingAI.value = false
  }
}

const submitForm = async () => {
  if (form.value.jenis_dokumen.length === 0) {
    error.value = 'Silakan pilih minimal 1 Jenis Dokumen.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  
  submitting.value = true
  error.value = ''
  
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('judul', form.value.judul)
    formData.append('deskripsi', form.value.deskripsi || '')
    formData.append('kategori', form.value.kategori)
    
    form.value.jenis_dokumen.forEach(jd => {
      formData.append('jenis_dokumen[]', jd)
    })
    
    formData.append('tanggal_dokumen', form.value.tanggal_dokumen)
    formData.append('status', form.value.status)
    formData.append('visibility', form.value.visibility)
    formData.append('upload_method', form.value.upload_method)
    
    if (form.value.status === 'scheduled') {
      formData.append('published_at', form.value.published_at)
    }
    
    if (isSuperAdmin.value && form.value.target_unit) {
      formData.append('target_unit', form.value.target_unit)
    }
    
    if (form.value.upload_method === 'file') {
      if (fileInput.value && fileInput.value.files[0]) {
        formData.append('file', fileInput.value.files[0])
      }
    } else {
      if (!form.value.link) {
        throw new Error('Silakan masukkan URL dokumen.')
      }
      formData.append('link', form.value.link)
    }

    const res = await api.post(`/informasi-pemkab-crud/${docId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    if (res.data.success || res.status === 200 || res.status === 201) {
      router.push(`/transparansi/informasi-pemkab?message=${encodeURIComponent('Dokumen berhasil diperbarui')}`)
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan.'
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    submitting.value = false
  }
}
</script>
