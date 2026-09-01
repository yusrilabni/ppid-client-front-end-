<template>
  <div class="container mx-auto py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-6 flex items-center space-x-2 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-blue-600"><i class="fas fa-home"></i> Beranda</NuxtLink>
        <span>/</span>
        <NuxtLink v-if="selectedCategory" :to="`/informasi/${categorySlug}`" class="hover:text-blue-600"><i class="fas fa-file-alt"></i> {{ selectedCategory }}</NuxtLink>
        <span v-if="selectedCategory">/</span>
        <span class="text-gray-800 font-medium"><i class="fas fa-plus-circle"></i> Tambah Informasi</span>
      </div>

      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">Tambah Informasi Baru</h1>
            <p class="text-blue-100 mt-1">Tambahkan informasi publik baru ke dalam sistem</p>
          </div>
          <button type="button" @click="showPedoman = true" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center">
            <i class="fas fa-question-circle mr-2"></i> Tanya Pedoman
          </button>
        </div>

        <div class="p-6">
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <span class="block sm:inline">{{ success }}</span>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <strong class="font-medium">Error!</strong>
            <span class="block sm:inline">{{ error }}</span>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label for="title" class="block text-gray-700 text-sm font-semibold mb-2">Judul Informasi <span class="text-red-500">*</span></label>
                <div class="flex space-x-2">
                  <input v-model="form.title" type="text" id="title" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required minlength="5" placeholder="Masukkan judul ringkas atau kata kunci untuk AI">
                  <button type="button" @click="generateAI" :disabled="generatingAI" class="relative group bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all duration-300 flex items-center justify-center min-w-[160px] transform hover:-translate-y-1 z-10 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-not-allowed">
                    <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500 group-hover:duration-200 -z-10"></div>
                    <span class="relative flex items-center gap-2">
                      <i class="fas fa-sparkles" :class="{'animate-pulse': !generatingAI, 'fa-spin': generatingAI}"></i> {{ generatingAI ? 'Generating...' : 'Generate AI' }}
                    </span>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Ketik topik singkat lalu klik Generate AI untuk melengkapi form secara otomatis.</p>
              </div>

              <div class="md:col-span-2">
                <label for="doc_desc" class="block text-gray-700 text-sm font-semibold mb-2">Deskripsi Singkat <span class="text-red-500">*</span></label>
                <textarea v-model="form.doc_desc" id="doc_desc" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" placeholder="Deskripsi singkat tentang informasi ini" required></textarea>
              </div>        
              
              <div class="md:col-span-2">
                <label for="doc_content" class="block text-gray-700 text-sm font-semibold mb-2">Konten Informasi Lengkap</label>
                <textarea v-model="form.doc_content" id="doc_content" rows="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" placeholder="Konten lengkap informasi publik"></textarea>
              </div>

              <div>
                <label for="category" class="block text-gray-700 text-sm font-semibold mb-2">Kategori Informasi <span class="text-red-500">*</span></label>
                <select v-model="form.category" id="category" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required>
                  <option value="">Pilih Kategori</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>

              <div v-if="isSuperAdmin">
                <label for="target_unit" class="block text-gray-700 text-sm font-semibold mb-2">Unit Kerja <span class="text-red-500">*</span></label>
                <select v-model="form.target_unit" id="target_unit" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required>
                  <option value="">Pilih Unit Kerja</option>
                  <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
                </select>
              </div>
              <div v-else>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Unit Kerja</label>
                <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" :value="userUnitName" readonly>
              </div>

              <div>
                <label for="jenis_dokumen" class="block text-gray-700 text-sm font-semibold mb-2">Jenis Dokumen <span class="text-red-500">*</span></label>
                <select v-model="form.jenis_dokumen" id="jenis_dokumen" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required>
                  <option value="">Pilih Jenis Dokumen</option>
                  <option v-for="jenis in jenisDokumenOptions" :key="jenis.value" :value="jenis.value">{{ jenis.label }}</option>
                </select>
                <div class="mt-2 text-xs text-blue-600 font-medium italic min-h-[1rem]">{{ selectedJenisDesc }}</div>
              </div>

              <div>
                <label for="tahun" class="block text-gray-700 text-sm font-semibold mb-2">Tahun Dokumen <span class="text-red-500">*</span></label>
                <input v-model="form.tahun" type="date" id="tahun" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required>
              </div>

              <div class="md:col-span-2">
                <label class="block text-gray-700 text-sm font-semibold mb-2">Status <span class="text-red-500">*</span></label>
                <div class="flex space-x-4">
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="form.status" value="BERLAKU" class="form-radio h-4 w-4 text-blue-600">
                    <span class="ml-2 text-gray-700">Berlaku</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" v-model="form.status" value="ARSIP" class="form-radio h-4 w-4 text-blue-600">
                    <span class="ml-2 text-gray-700">Arsip</span>
                  </label>
                </div>
                <p class="text-red-500 text-xs mt-2">Pilih "BERLAKU" untuk dokumen yang masih sah digunakan saat ini (baik lama maupun baru), dan gunakan "ARSIP" hanya jika dokumen tersebut sudah kedaluwarsa atau telah diperbarui.</p>
              </div>
            </div>

            <div class="mb-8">
              <label class="block text-gray-700 text-sm font-semibold mb-2">File <span class="text-red-500">*</span></label>
              <div class="mb-4 flex space-x-4">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="form.file_type" value="upload" class="form-radio h-4 w-4 text-blue-600">
                  <span class="ml-2 text-gray-700">Upload File</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="form.file_type" value="url" class="form-radio h-4 w-4 text-blue-600">
                  <span class="ml-2 text-gray-700">Link File</span>
                </label>
              </div>

              <div v-if="form.file_type === 'upload'" class="mb-6 animate-fadeIn">
                <label for="file" class="block text-gray-700 text-sm font-semibold mb-2">Upload File</label>
                <div class="border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 relative" 
                     :class="dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'"
                     @dragover.prevent="dragActive = true" @dragleave.prevent="dragActive = false" @drop.prevent="handleDrop">
                  <div class="flex flex-col items-center justify-center">
                    <i class="fas fa-cloud-upload-alt text-4xl mb-3" :class="fileName ? 'text-blue-500' : 'text-gray-400'"></i>
                    <p class="text-gray-600 mb-2" v-if="!fileName">Pilih file untuk diupload atau drag & drop</p>
                    <p class="text-blue-600 font-bold mb-2" v-else>{{ fileName }}</p>
                    <p class="text-xs text-gray-500 mb-4">PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
                    <button type="button" @click="triggerFileInput" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200">
                      {{ fileName ? 'Ganti File' : 'Pilih File' }}
                    </button>
                    <input type="file" ref="fileInput" id="file" name="file" class="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" @change="handleFileSelect">
                  </div>
                </div>
              </div>

              <div v-if="form.file_type === 'url'" class="mb-6 animate-fadeIn">
                <label for="file_url" class="block text-gray-700 text-sm font-semibold mb-2">URL Link File External</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-link text-gray-400"></i>
                  </div>
                  <input v-model="form.file_url" type="url" id="file_url" name="file_url" class="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" placeholder="https://example.com/file.pdf">
                </div>
                <p class="text-xs text-gray-500 mt-1">Masukkan link dari Google Drive atau penyedia layanan cloud lainnya. Pastikan link bisa diakses publik.</p>
              </div>
            </div>

            <div class="flex items-center justify-end space-x-4 border-t pt-6">
              <button type="button" @click="$router.back()" class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200">
                Batal
              </button>
              <button type="submit" :disabled="saving" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-save mr-2"></i> {{ saving ? 'Menyimpan...' : 'Simpan Informasi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const queryCategory = route.query.category || ''
const selectedCategory = ref(
  queryCategory === 'berkala' ? 'Informasi Berkala' :
  queryCategory === 'setiap-saat' ? 'Informasi Setiap Saat' :
  queryCategory === 'serta-merta' ? 'Informasi Serta Merta' :
  queryCategory === 'dikecualikan' ? 'Informasi Dikecualikan' : ''
)
const categorySlug = computed(() => {
  if (selectedCategory.value === 'Informasi Berkala') return 'berkala'
  if (selectedCategory.value === 'Informasi Setiap Saat') return 'setiap-saat'
  if (selectedCategory.value === 'Informasi Serta Merta') return 'serta-merta'
  if (selectedCategory.value === 'Informasi Dikecualikan') return 'dikecualikan'
  return ''
})

const categories = [
  'Informasi Berkala',
  'Informasi Setiap Saat',
  'Informasi Serta Merta',
  'Informasi Dikecualikan'
]

const jenisDokumenOptions = [
  { value: 'Profil Badan Publik', label: 'Profil Badan Publik', desc: 'Sejarah, Visi Misi, Tupoksi, Struktur Organisasi, Profil Pimpinan, Domisili' },
  { value: 'Informasi Organisasi & Kepegawaian', label: 'Informasi Organisasi & Kepegawaian', desc: 'Data Statistik Pegawai, Daftar Pejabat Struktural, LHKPN/LHKASN' },
  { value: 'Dokumen Strategis', label: 'Dokumen Strategis', desc: 'RPJMD, Renstra, Renja, Indikator Kinerja Utama/IKU' },
  { value: 'Program & Kegiatan', label: 'Program & Kegiatan', desc: 'DPA, Kalender Kegiatan Tahunan, Ringkasan Program Kerja' },
  { value: 'Laporan Kinerja Instansi', label: 'Laporan Kinerja Instansi', desc: 'LKjIP, LKPJ, Laporan Tahunan Instansi' },
  { value: 'Informasi Keuangan', label: 'Informasi Keuangan', desc: 'RKA, LRA, Neraca, Laporan Arus Kas, CALK, Opini BPK' },
  { value: 'Pengadaan Barang/Jasa', label: 'Pengadaan Barang/Jasa', desc: 'RUP, Kerangka Acuan Kerja/KAK, Ringkasan Kontrak, Daftar Pemenang Tender' },
  { value: 'Daftar Aset dan Inventaris', label: 'Daftar Aset dan Inventaris', desc: 'Buku Inventaris Barang, Rekapitulasi Aset Daerah' },
  { value: 'Standar Layanan & SOP PPID', label: 'Standar Layanan & SOP PPID', desc: 'Maklumat Pelayanan, SOP Permohonan Informasi, SOP Sengketa, Standar Pelayanan Minimal/SPM' },
  { value: 'Daftar Informasi Publik & Laporan PPID', label: 'Daftar Informasi Publik & Laporan PPID', desc: 'Buku DIP Tahunan, Register Permohonan, Daftar Informasi Dikecualikan, Laporan Layanan Informasi' },
  { value: 'Regulasi & Peraturan', label: 'Regulasi & Peraturan', desc: 'Undang-Undang, Peraturan Pemerintah, Perda, Perbup, SK Kepala Daerah/Dinas' },
  { value: 'Perjanjian Kerja Sama / MoU', label: 'Perjanjian Kerja Sama / MoU', desc: 'Nota Kesepahaman Antar Lembaga, Kontrak Kerja Sama Pihak Ketiga' },
  { value: 'Pengumuman & Siaran Pers', label: 'Pengumuman & Siaran Pers', desc: 'Pengumuman Resmi, Siaran Pers, Surat Edaran, Hasil Survei Kepuasan Masyarakat/SKM' },
  { value: 'Informasi Serta Merta', label: 'Informasi Serta Merta', desc: 'Peringatan Dini Bencana, Informasi Gangguan Layanan Massal, Protokol Darurat' },
  { value: 'Lainnya', label: 'Lainnya', desc: '' }
]

const form = ref({
  title: '',
  doc_desc: '',
  doc_content: '',
  category: selectedCategory.value || '',
  target_unit: '',
  jenis_dokumen: '',
  tahun: new Date().toISOString().split('T')[0],
  status: 'BERLAKU',
  file_type: 'upload',
  file_url: ''
})

const selectedJenisDesc = computed(() => {
  const selected = jenisDokumenOptions.find(o => o.value === form.value.jenis_dokumen)
  return selected ? selected.desc : ''
})

const units = ref([])
const isSuperAdmin = ref(true) // Should be fetched from auth context
const userUnitName = ref('Unit Kerja Anda') // Should be fetched from auth context
const userUnitId = ref('') 

const fileInput = ref(null)
const fileName = ref('')
const dragActive = ref(false)
const saving = ref(false)
const generatingAI = ref(false)
const success = ref('')
const error = ref('')
const showPedoman = ref(false)

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    fileName.value = file.name
  }
}

const handleDrop = (e) => {
  dragActive.value = false
  const file = e.dataTransfer.files[0]
  if (file) {
    fileInput.value.files = e.dataTransfer.files
    fileName.value = file.name
  }
}

const generateAI = async () => {
  if (!form.value.title || form.value.title.length < 5) {
    alert('Masukkan judul atau kata kunci (minimal 5 karakter) terlebih dahulu.')
    return
  }
  generatingAI.value = true
  try {
    const res = await api.post('/ai/generate-informasi', { title: form.value.title })
    if (res.data.success) {
      form.value.doc_desc = res.data.doc_desc || form.value.doc_desc
      form.value.doc_content = res.data.doc_content || form.value.doc_content
      form.value.jenis_dokumen = res.data.jenis_dokumen || form.value.jenis_dokumen
    }
  } catch (err) {
    console.error('AI Generation error', err)
    alert('Gagal menghasilkan teks dengan AI. Pastikan layanan AI tersedia.')
  } finally {
    generatingAI.value = false
  }
}

const fetchUnits = async () => {
  try {
    const res = await api.get('/units')
    if (res.data && Array.isArray(res.data.data)) {
      units.value = res.data.data
    } else if (Array.isArray(res.data)) {
      units.value = res.data
    }
  } catch (err) {
    console.error('Failed to fetch units', err)
  }
}

onMounted(() => {
  fetchUnits()
  // Mock auth context check
  const userStr = localStorage.getItem('user') || localStorage.getItem('auth.user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      isSuperAdmin.value = user.role === 'superadmin' || user.role === 'admin'
      if (!isSuperAdmin.value) {
        userUnitName.value = user.unit?.name || user.organization?.name || 'Unit Kerja'
        userUnitId.value = user.unit_id || user.organization_id || ''
        form.value.target_unit = userUnitId.value
      }
    } catch (e) { }
  }
})

const submitForm = async () => {
  saving.value = true
  error.value = ''
  success.value = ''
  
  try {
    const formData = new FormData()
    Object.keys(form.value).forEach(key => {
      if (key !== 'file_url') {
        formData.append(key, form.value[key])
      }
    })
    
    if (form.value.file_type === 'upload') {
      if (fileInput.value && fileInput.value.files[0]) {
        formData.append('file', fileInput.value.files[0])
      } else {
        throw new Error('Silakan pilih file untuk diupload.')
      }
    } else {
      if (!form.value.file_url) {
        throw new Error('Silakan masukkan URL file.')
      }
      formData.append('file_url', form.value.file_url)
    }

    if (!isSuperAdmin.value) {
      formData.append('target_unit', userUnitId.value)
    }

    const res = await api.post('/informasi-crud', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (res.data.success || res.status === 200 || res.status === 201) {
      success.value = 'Informasi berhasil ditambahkan.'
      setTimeout(() => {
        router.push(categorySlug.value ? `/informasi/${categorySlug.value}` : '/admin')
      }, 1500)
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
