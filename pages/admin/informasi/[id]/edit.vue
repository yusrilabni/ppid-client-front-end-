<template>
  <div class="container mx-auto py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <Breadcrumbs :breadcrumbs="breadcrumbItems" />

      <div v-if="loading" class="bg-white rounded-xl shadow-lg p-12 text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
        <p class="text-gray-500">Memuat data informasi...</p>
      </div>

      <div v-else-if="loadError" class="bg-white rounded-xl shadow-lg p-12 text-center">
        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
        <p class="text-red-600 font-bold">{{ loadError }}</p>
        <button @click="$router.back()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Kembali</button>
      </div>

      <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-amber-500 to-amber-700 p-6 text-white flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">Edit Informasi</h1>
            <p class="text-amber-100 mt-1">Perbarui informasi publik dalam sistem</p>
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
                  <input v-model="form.title" type="text" id="title" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required minlength="5" placeholder="Masukkan judul informasi">
                  <button type="button" @click="generateAI" :disabled="generatingAI" class="relative group bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all duration-300 flex items-center justify-center min-w-[160px] transform hover:-translate-y-1 z-10 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:cursor-not-allowed">
                    <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500 group-hover:duration-200 -z-10"></div>
                    <span class="relative flex items-center gap-2">
                      <i class="fas fa-robot" :class="{'animate-pulse': !generatingAI, 'fa-spin': generatingAI}"></i> {{ generatingAI ? 'Generating...' : 'Generate AI' }}
                    </span>
                  </button>
                </div>
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
                  :searchable="false"
                />
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Unit Kerja <span v-if="isSuperAdmin" class="text-gray-400 text-xs font-normal ml-1">(Opsional)</span></label>
                <CustomSelect 
                  v-model="form.target_unit"
                  :options="unitsOptions"
                  placeholder="Pilih Unit Kerja"
                  :searchable="true"
                  :disabled="!isSuperAdmin"
                />
              </div>

              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Jenis Dokumen <span class="text-red-500">*</span></label>
                <CustomSelect 
                  v-model="form.jenis_dokumen"
                  :options="jenisDokumenOptions"
                  placeholder="Pilih Jenis Dokumen"
                  :searchable="true"
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
              </div>
            </div>

            <div class="mb-8 mt-4">
              <label class="block text-gray-700 text-sm font-semibold mb-2">File</label>
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

              <!-- Current file info -->
              <div v-if="existingFile" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <i class="fas fa-file-alt text-blue-500 text-lg"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-blue-700">File saat ini:</p>
                  <a :href="existingFile" target="_blank" class="text-xs text-blue-600 hover:underline break-all">{{ existingFile }}</a>
                </div>
              </div>

              <div v-if="form.file_type === 'upload'" class="mb-6 animate-fadeIn">
                <label for="file" class="block text-gray-700 text-sm font-semibold mb-2">Upload File Baru <span class="text-gray-400 text-xs">(Kosongkan jika tidak ingin mengubah)</span></label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200"
                     :class="dragActive ? 'border-blue-500 bg-blue-50' : ''"
                     @dragover.prevent="dragActive = true" @dragleave.prevent="dragActive = false" @drop.prevent="handleDrop">
                  <div class="flex flex-col items-center justify-center">
                    <i class="fas fa-cloud-upload-alt text-4xl mb-3" :class="fileName ? 'text-blue-500' : 'text-gray-400'"></i>
                    <p class="text-gray-600 mb-2" v-if="!fileName">Pilih file baru untuk diupload</p>
                    <p class="text-blue-600 font-bold mb-2" v-else>{{ fileName }}</p>
                    <p class="text-gray-500 text-sm mb-3">Format: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)</p>
                    <input type="file" ref="fileInput" id="file" class="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp" @change="handleFileSelect">
                    <label for="file" @click.prevent="triggerFileInput" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition duration-200">
                      {{ fileName ? 'Ganti File' : 'Pilih File' }}
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="form.file_type === 'url'" class="mb-6 animate-fadeIn">
                <label for="file_url" class="block text-gray-700 text-sm font-semibold mb-2">Link File</label>
                <input v-model="form.file_url" type="url" id="file_url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" placeholder="https://contoh.com/file.pdf">
              </div>
            </div>

            <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button type="button" @click="$router.back()" class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200">
                Batal
              </button>
              <button type="submit" :disabled="saving" class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition duration-200 flex items-center">
                <i v-if="saving" class="fas fa-spinner fa-spin mr-2"></i>
                {{ saving ? 'Menyimpan...' : 'Perbarui Informasi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <PedomanModal v-model="showPedoman" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import PedomanModal from '@/components/PedomanModal.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import CustomDate from '@/components/CustomDate.vue'

const route = useRoute()
const router = useRouter()
const informasiId = route.params.id

const loading = ref(true)
const loadError = ref('')
const existingFile = ref('')

const categorySlug = computed(() => {
  if (form.value.category === 'Informasi Berkala') return 'berkala'
  if (form.value.category === 'Informasi Setiap Saat') return 'setiap-saat'
  if (form.value.category === 'Informasi Serta Merta') return 'serta-merta'
  if (form.value.category === 'Informasi Dikecualikan') return 'dikecualikan'
  return ''
})

const breadcrumbItems = computed(() => {
  const items = [
    { title: 'Beranda', url: '/', icon: 'fas fa-home' }
  ]
  if (form.value.category) {
    items.push({ title: form.value.category, url: `/informasi/${categorySlug.value}`, icon: 'fas fa-file-alt' })
  }
  items.push({ title: 'Edit Informasi', url: null, icon: 'fas fa-edit' })
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
  { value: 'Perencanaan & Kinerja', label: 'Perencanaan & Kinerja', desc: 'RPJMD/RKPD, Renja, RKA/DPA, Renstra, LAKIP/LKjIP, Laporan Kinerja' },
  { value: 'Keuangan & Anggaran', label: 'Keuangan & Anggaran', desc: 'APBD, Laporan Keuangan, Realisasi Anggaran, Neraca, LRA, CALK' },
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
  category: '',
  target_unit: '',
  jenis_dokumen: '',
  tahun: '',
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
const isSuperAdmin = ref(true)
const userUnitName = ref('Unit Kerja Anda')
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
    alert('Gagal menghasilkan teks dengan AI.')
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

const fetchInformasi = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const res = await api.get(`/informasi-crud/${informasiId}/edit`)
    if (res.data?.success && res.data.data) {
      const data = res.data.data
      form.value.title = data.title || ''
      form.value.doc_desc = data.doc_desc || ''
      form.value.doc_content = data.doc_content || ''
      form.value.category = data.category || ''
      form.value.jenis_dokumen = data.jenis_dokumen || ''
      form.value.tahun = data.tahun || ''
      form.value.status = data.status || 'BERLAKU'
      form.value.file_type = data.file_type || 'upload'
      form.value.file_url = data.file_url || ''
      form.value.target_unit = data.unit_id ? String(data.unit_id) : ''
      existingFile.value = data.file_full_url || data.file_url || ''
    } else {
      loadError.value = 'Data informasi tidak ditemukan.'
    }
  } catch (err) {
    console.error('Failed to fetch informasi', err)
    loadError.value = err.response?.data?.message || 'Gagal memuat data informasi.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUnits()
  fetchInformasi()
  const authStore = useAuthStore()
  if (authStore.user) {
    isSuperAdmin.value = authStore.isSuperAdmin
    if (!isSuperAdmin.value) {
      userUnitName.value = authStore.user.unit?.name || authStore.user.organization?.name || 'Unit Kerja'
      userUnitId.value = authStore.user.unit_id || authStore.user.organization_id || ''
    }
  } else {
    const userStr = localStorage.getItem('user') || localStorage.getItem('auth.user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        isSuperAdmin.value = user.role === 'superadmin' || user.is_superadmin === 1
        if (!isSuperAdmin.value) {
          userUnitName.value = user.unit?.name || user.organization?.name || 'Unit Kerja'
          userUnitId.value = user.unit_id || user.organization_id || ''
        }
      } catch (e) { }
    }
  }
})

const submitForm = async () => {
  saving.value = true
  error.value = ''
  success.value = ''
  
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('doc_desc', form.value.doc_desc)
    formData.append('doc_content', form.value.doc_content || '')
    formData.append('category', form.value.category)
    formData.append('jenis_dokumen', form.value.jenis_dokumen)
    formData.append('tahun', form.value.tahun)
    formData.append('status', form.value.status)
    formData.append('file_type', form.value.file_type)

    if (isSuperAdmin.value) {
      formData.append('target_unit', form.value.target_unit || '')
    } else {
      formData.append('target_unit', userUnitId.value)
    }

    if (form.value.file_type === 'upload') {
      if (fileInput.value && fileInput.value.files[0]) {
        formData.append('file', fileInput.value.files[0])
      }
      // If no new file selected, backend keeps existing file
    } else {
      if (form.value.file_url) {
        formData.append('url', form.value.file_url)
      }
    }

    const res = await api.post(`/informasi-crud/${informasiId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (res.data?.success || res.status === 200) {
      success.value = res.data?.message || 'Informasi berhasil diperbarui.'
      setTimeout(() => {
        router.push(categorySlug.value ? `/informasi/${categorySlug.value}?message=${encodeURIComponent(success.value)}` : '/admin')
      }, 1500)
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan.'
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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
