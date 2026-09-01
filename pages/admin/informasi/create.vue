<template>
  <div class="container mx-auto py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <Breadcrumbs :breadcrumbs="breadcrumbItems" />

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
                      <i class="fas fa-robot" :class="{'animate-pulse': !generatingAI, 'fa-spin': generatingAI}"></i> {{ generatingAI ? 'Generating...' : 'Generate AI' }}
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
                <label class="block text-gray-700 text-sm font-semibold mb-2">Kategori Informasi <span class="text-red-500">*</span></label>
                <CustomSelect 
                  v-model="form.category"
                  :options="categoriesOptions"
                  placeholder="Pilih Kategori"
                  :shouldShowSearch="false"
                />
              </div>

              <div v-if="isSuperAdmin">
                <label class="block text-gray-700 text-sm font-semibold mb-2">Unit Kerja <span class="text-gray-400 text-xs font-normal ml-1">(Opsional)</span></label>
                <CustomSelect 
                  v-model="form.target_unit"
                  :options="unitsOptions"
                  placeholder="Pilih Unit Kerja"
                  :shouldShowSearch="true"
                />
              </div>
              <div v-else>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Unit Kerja</label>
                <input type="text" class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" :value="userUnitName" readonly>
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Jenis Dokumen <span class="text-red-500">*</span></label>
                <CustomSelect 
                  v-model="form.jenis_dokumen"
                  :options="jenisDokumenOptions"
                  placeholder="Pilih Jenis Dokumen"
                  :shouldShowSearch="true"
                />
                <div class="mt-2 text-xs text-blue-600 font-medium italic min-h-[1rem]">{{ selectedJenisDesc }}</div>
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Tahun Dokumen <span class="text-red-500">*</span></label>
                <CustomDate 
                  v-model="form.tahun" 
                  placeholder="Pilih Tanggal Dokumen" 
                  variant="standard"
                />
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
                            <div class="mb-8 mt-4">
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

                <div v-if="form.file_type === `upload`" class="mb-6 animate-fadeIn">
                  <label for="file" class="block text-gray-700 text-sm font-semibold mb-2">Upload File</label>
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200"
                       :class="dragActive ? `border-blue-500 bg-blue-50` : ``"
                       @dragover.prevent="dragActive = true" @dragleave.prevent="dragActive = false" @drop.prevent="handleDrop">
                    <div class="flex flex-col items-center justify-center">
                      <i class="fas fa-cloud-upload-alt text-4xl mb-3" :class="fileName ? `text-blue-500` : `text-gray-400`"></i>
                      <p class="text-gray-600 mb-2" v-if="!fileName">Pilih file untuk diupload</p>
                      <p class="text-blue-600 font-bold mb-2" v-else>{{ fileName }}</p>
                      <p class="text-gray-500 text-sm mb-3">Format: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)</p>
                      <input type="file" ref="fileInput" id="file" class="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" @change="handleFileSelect">
                      <label for="file" @click.prevent="triggerFileInput" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition duration-200">
                        {{ fileName ? `Ganti File` : `Pilih File` }}
                      </label>
                    </div>
                  </div>
                </div>

                <div v-if="form.file_type === `url`" class="mb-6 animate-fadeIn">
                  <label for="file_url" class="block text-gray-700 text-sm font-semibold mb-2">Link File (untuk file > 10MB)</label>
                  <input v-model="form.file_url" type="url" id="file_url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" placeholder="https://contoh.com/file.pdf">
                  <p class="text-gray-500 text-xs mt-2">Gunakan ini jika file Anda lebih besar dan tidak bisa diupload</p>
                </div>
              </div>

            </div>

            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button type="button" @click="$router.back()" class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200">
                Batal
              </button>
              <button type="button" v-if="form.status === `BERLAKU` && !similarityChecked" @click="checkSimilarity" :disabled="checking" class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition duration-200 flex items-center">
                <i v-if="checking" class="fas fa-spinner fa-spin mr-2"></i>
                {{ checking ? `Mengecek...` : `Check Informasi` }}
              </button>
              <button type="submit" v-if="form.status === `ARSIP` || similarityChecked" :disabled="saving" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ saving ? `Menyimpan...` : `Simpan Informasi` }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Similarity Modal -->
    <div v-if="showSimilarityModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <i class="fas fa-exclamation-triangle text-yellow-600 fa-2x"></i>
          </div>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2">Peringatan Kemiripan Judul</h3>
          <div class="mt-2 px-1 py-3 text-left">
            <p class="text-sm text-gray-500 text-center">
              Judul yang Anda masukkan memiliki kemiripan dengan dokumen yang sudah ada.
            </p>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Pilih dokumen untuk diganti (diarsip):</label>
              <select v-model="form.replacement_id" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border">
                <option value="">-- Pilih Dokumen --</option>
                <option v-for="doc in similarDocuments" :key="doc.id" :value="doc.id">
                  {{ doc.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="items-center px-2 py-3">
            <button @click="confirmReplacement" :disabled="!form.replacement_id" class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none disabled:opacity-50 transition-colors">
              Ganti & Simpan
            </button>
            <button @click="forceSubmit" class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none transition-colors">
              Tetap Simpan Baru
            </button>
            <button @click="showSimilarityModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
    <PedomanModal v-model="showPedoman" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PedomanModal from '@/components/PedomanModal.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import CustomDate from '@/components/CustomDate.vue'

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

const breadcrumbItems = computed(() => {
  const items = [
    { title: 'Beranda', url: '/', icon: 'fas fa-home' }
  ]
  if (selectedCategory.value) {
    items.push({ title: selectedCategory.value, url: `/informasi/${categorySlug.value}`, icon: 'fas fa-file-alt' })
  }
  items.push({ title: 'Tambah Informasi', url: null, icon: 'fas fa-plus-circle' })
  return items
})

const categoriesOptions = [
  { value: 'Informasi Berkala', label: 'Informasi Berkala' },
  { value: 'Informasi Setiap Saat', label: 'Informasi Setiap Saat' },
  { value: 'Informasi Serta Merta', label: 'Informasi Serta Merta' },
  { value: 'Informasi Dikecualikan', label: 'Informasi Dikecualikan' }
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
const unitsOptions = computed(() => {
  return units.value.map(unit => ({
    value: String(unit.remote_id || unit.id),
    label: unit.name
  }))
})
const isSuperAdmin = ref(true) // Will be updated from auth context
const userUnitName = ref('Unit Kerja Anda') // Will be updated from auth context
const userUnitId = ref('') 

const fileInput = ref(null)
const fileName = ref('')
const dragActive = ref(false)
const saving = ref(false)
const generatingAI = ref(false)
const success = ref('')
const error = ref('')
const showPedoman = ref(false)
const checking = ref(false)
const similarityChecked = ref(false)
const showSimilarityModal = ref(false)
const similarDocuments = ref([])

const checkSimilarity = async () => {
  if (form.value.title.length < 5) {
    alert("Judul informasi harus memiliki minimal 5 karakter.")
    return
  }
  checking.value = true
  
  try {
    const payload = new FormData()
    payload.append("title", form.value.title)
    if (!isSuperAdmin.value) {
      payload.append("target_unit", userUnitId.value)
    } else {
      payload.append("target_unit", form.value.target_unit)
    }
    
    // Fallback to /v2/admin/proses-cek-judul if /informasi-crud/check-similarity 404s
    let res;
    try {
      res = await api.post("/informasi-crud/check-similarity", payload)
    } catch (apiErr) {
      if (apiErr.response && apiErr.response.status === 404) {
        // Fallback for V2 route
        res = await api.post("/v2/admin/proses-cek-judul", payload, { baseURL: "/" })
      } else {
        throw apiErr;
      }
    }
    
    if (res.data && res.data.length > 0) {
      similarDocuments.value = res.data
      showSimilarityModal.value = true
    } else {
      alert("Tidak ada dokumen serupa. Anda dapat menyimpan.")
      similarityChecked.value = true
    }
  } catch (err) {
    console.error("Similarity check failed", err)
    alert("Gagal mengecek kemiripan: " + (err.response?.data?.message || err.message))
  } finally {
    checking.value = false
  }
}

const confirmReplacement = () => {
  showSimilarityModal.value = false
  similarityChecked.value = true
  submitForm()
}

const forceSubmit = () => {
  form.value.replacement_id = ""
  showSimilarityModal.value = false
  similarityChecked.value = true
  submitForm()
}


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
    const res = await api.post('/ai-settings/generate', { prompt: form.value.title })
    if (res.data.success && res.data.data) {
      const generatedData = res.data.data
      form.value.title = generatedData.title || form.value.title
      form.value.doc_desc = generatedData.doc_desc || form.value.doc_desc
      form.value.doc_content = generatedData.doc_content || form.value.doc_content
      form.value.jenis_dokumen = generatedData.jenis_dokumen || form.value.jenis_dokumen
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
      isSuperAdmin.value = user.role === 'superadmin'
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
      formData.append('url', form.value.file_url)
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
