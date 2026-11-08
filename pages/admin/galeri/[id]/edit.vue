<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Breadcrumb & Back -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <NuxtLink to="/admin/galeri" class="hover:text-blue-600 transition flex items-center gap-1">
          <i class="fas fa-arrow-left"></i> Kembali ke Galeri
        </NuxtLink>
        <span>/</span>
        <span class="text-gray-800 font-medium">Edit Galeri #{{ route.params.id }}</span>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6 animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      <div class="h-12 bg-gray-200 rounded"></div>
      <div class="h-32 bg-gray-200 rounded"></div>
    </div>

    <!-- Main Card -->
    <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <i class="fas fa-edit"></i> Edit Item Galeri
        </h2>
        <p class="text-blue-100 text-sm mt-1">
          Perbarui informasi, media, atau atur ulang visibilitas publik/privat galeri ini.
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="m-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
        <i class="fas fa-exclamation-triangle text-lg text-red-500 mt-0.5"></i>
        <div class="text-sm">
          <strong class="font-bold">Gagal Memperbarui:</strong>
          <p class="mt-0.5">{{ errorMessage }}</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Judul -->
        <div>
          <label for="title" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Judul Galeri <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.title" 
            type="text" 
            id="title" 
            placeholder="Masukkan judul galeri..." 
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
        </div>

        <!-- Jenis Media -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Media <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <label 
              class="flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition"
              :class="form.type === 'foto' ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-700 font-semibold' : 'border-gray-200 hover:bg-gray-50 text-gray-700'"
            >
              <input type="radio" v-model="form.type" value="foto" class="text-blue-600 focus:ring-blue-500">
              <i class="fas fa-camera text-base"></i>
              <span>Foto (Gambar)</span>
            </label>
            <label 
              class="flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition"
              :class="form.type === 'video' ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-700 font-semibold' : 'border-gray-200 hover:bg-gray-50 text-gray-700'"
            >
              <input type="radio" v-model="form.type" value="video" class="text-blue-600 focus:ring-blue-500">
              <i class="fas fa-video text-base"></i>
              <span>Video (YouTube)</span>
            </label>
          </div>
        </div>

        <!-- Section Foto -->
        <div v-if="form.type === 'foto'">
          <!-- Current Image Display -->
          <div v-if="currentImage && !imagePreview" class="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-4">
            <img :src="getStorageUrl(currentImage)" alt="Gambar Saat Ini" class="w-24 h-20 object-cover rounded-lg border border-gray-300">
            <div>
              <span class="block text-xs font-semibold text-gray-700">Gambar yang digunakan saat ini</span>
              <p class="text-xs text-gray-500 mt-0.5">Unggah gambar baru di bawah jika ingin menggantinya.</p>
            </div>
          </div>

          <label class="block text-sm font-semibold text-gray-700 mb-1.5">
            {{ currentImage ? 'Ganti Berkas Gambar (Opsional)' : 'Unggah Berkas Gambar *' }}
          </label>
          
          <div 
            class="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition relative"
            :class="dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-gray-400 bg-gray-50/40'"
            @dragover.prevent="dragActive = true"
            @dragleave.prevent="dragActive = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input 
              ref="fileInputRef" 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleFileChange"
            >

            <div v-if="imagePreview" class="flex flex-col items-center">
              <img :src="imagePreview" alt="Preview Gambar Baru" class="max-h-56 rounded-xl object-contain shadow-md mb-3">
              <span class="text-xs text-blue-600 font-semibold hover:underline">
                Klik untuk memilih gambar lain
              </span>
              <span class="text-[11px] text-gray-400 mt-0.5">{{ selectedFileName }}</span>
            </div>

            <div v-else class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <i class="fas fa-cloud-upload-alt text-xl"></i>
              </div>
              <p class="text-sm font-semibold text-gray-700">Tarik dan lepas gambar baru di sini, atau klik untuk memilih file</p>
              <p class="text-xs text-gray-500 mt-1">Kosongkan jika ingin tetap mempertahankan gambar lama.</p>
            </div>
          </div>
        </div>

        <!-- Section Video -->
        <div v-else>
          <label for="video" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Tautan / URL Video YouTube <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <i class="fab fa-youtube absolute left-3.5 top-1/2 -translate-y-1/2 text-red-600 text-base"></i>
            <input 
              v-model="form.video" 
              type="url" 
              id="video" 
              placeholder="https://www.youtube.com/watch?v=..." 
              required
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
          </div>
          <div v-if="youtubePreview" class="mt-3">
            <span class="block text-xs font-semibold text-gray-600 mb-1">Pratinjau Thumbnail Video:</span>
            <img :src="youtubePreview" alt="Preview YouTube" class="h-32 rounded-lg object-cover border border-gray-200">
          </div>
        </div>

        <!-- PENGATURAN VISIBILITAS (PUBLIK / PRIVAT) -->
        <div class="pt-4 border-t border-gray-100">
          <label class="block text-sm font-bold text-gray-800 mb-1">
            Visibilitas Tampilan Galeri <span class="text-red-500">*</span>
          </label>
          <p class="text-xs text-gray-500 mb-3">
            Atur apakah foto ini tampil di beranda utama atau hanya tersimpan di bagian belakang layar.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Pilihan Publik -->
            <label 
              class="relative flex items-start p-4 border rounded-2xl cursor-pointer transition"
              :class="form.visibility === 'public' ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20' : 'border-gray-200 hover:border-gray-300 bg-white'"
            >
              <input 
                type="radio" 
                v-model="form.visibility" 
                value="public" 
                class="mt-1 text-emerald-600 focus:ring-emerald-500"
              >
              <div class="ml-3">
                <div class="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Publik (Tampil di Beranda)
                </div>
                <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                  Foto atau video ini <strong>ditampilkan di Beranda</strong> portal PPID dan dapat dilihat oleh publik.
                </p>
              </div>
            </label>

            <!-- Pilihan Privat -->
            <label 
              class="relative flex items-start p-4 border rounded-2xl cursor-pointer transition"
              :class="form.visibility === 'private' ? 'border-amber-600 bg-amber-50/40 ring-2 ring-amber-500/20' : 'border-gray-200 hover:border-gray-300 bg-white'"
            >
              <input 
                type="radio" 
                v-model="form.visibility" 
                value="private" 
                class="mt-1 text-amber-600 focus:ring-amber-500"
              >
              <div class="ml-3">
                <div class="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Privat (Hanya Belakang Layar)
                </div>
                <p class="text-xs text-gray-600 mt-1 leading-relaxed">
                  Foto atau video ini <strong>TIDAK akan masuk ke beranda</strong> publik. Murni arsip internal di belakang layar.
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Deskripsi -->
        <div>
          <label for="description" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Deskripsi / Keterangan Dokumentasi
          </label>
          <textarea 
            v-model="form.description" 
            id="description" 
            rows="4" 
            placeholder="Tuliskan ringkasan narasi kegiatan..."
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          ></textarea>
        </div>

        <!-- Row: Kategori & Tanggal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="category" class="block text-sm font-semibold text-gray-700 mb-1.5">
              Kategori Informasi (Opsional)
            </label>
            <select 
              v-model="form.category" 
              id="category" 
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700 transition"
            >
              <option value="">Tidak Berkategori</option>
              <option value="Informasi Berkala">Informasi Berkala</option>
              <option value="Informasi Setiap Saat">Informasi Setiap Saat</option>
              <option value="Informasi Serta Merta">Informasi Serta Merta</option>
              <option value="Informasi Dikecualikan">Informasi Dikecualikan</option>
            </select>
          </div>

          <div>
            <label for="tanggal_upload" class="block text-sm font-semibold text-gray-700 mb-1.5">
              Tanggal Dokumentasi
            </label>
            <input 
              v-model="form.tanggal_upload" 
              type="date" 
              id="tanggal_upload" 
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
          </div>
        </div>

        <!-- Jenis Dokumen DIP -->
        <div>
          <label for="jenis_dokumen" class="block text-sm font-semibold text-gray-700 mb-1.5">
            Jenis Dokumen (Opsional)
          </label>
          <select 
            v-model="form.jenis_dokumen" 
            id="jenis_dokumen" 
            class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700 transition"
          >
            <option value="">Pilih Jenis Dokumen</option>
            <option v-for="(desc, val) in jenisDokumenOptions" :key="val" :value="val">
              {{ val }} - ({{ desc }})
            </option>
          </select>
        </div>

        <!-- Sematkan Pin ke Atas -->
        <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <input 
            type="checkbox" 
            v-model="form.is_pinned" 
            id="is_pinned" 
            class="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
          >
          <label for="is_pinned" class="text-sm font-semibold text-gray-700 cursor-pointer">
            <i class="fas fa-thumbtack text-orange-500 mr-1.5"></i> Sematkan di bagian paling atas (Pin to Top)
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <NuxtLink 
            to="/admin/galeri" 
            class="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition"
          >
            Batal
          </NuxtLink>
          <button 
            type="submit" 
            :disabled="submitting" 
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ submitting ? 'Menyimpan...' : 'Perbarui Galeri' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api, { getStorageUrl } from '@/services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

const form = ref({
  title: '',
  description: '',
  type: 'foto',
  visibility: 'public',
  video: '',
  category: '',
  jenis_dokumen: '',
  tanggal_upload: '',
  is_pinned: false
})

const currentImage = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const imagePreview = ref(null)
const dragActive = ref(false)
const fileInputRef = ref(null)

const jenisDokumenOptions = {
  'Profil Badan Publik': 'Sejarah, Visi Misi, Tupoksi, Struktur Organisasi, Profil Pimpinan, Domisili',
  'Informasi Organisasi & Kepegawaian': 'Data Statistik Pegawai, Daftar Pejabat Struktural, LHKPN/LHKASN',
  'Dokumen Strategis': 'RPJMD, Renstra, Renja, Indikator Kinerja Utama/IKU',
  'Program & Kegiatan': 'DPA, Kalender Kegiatan Tahunan, Ringkasan Program Kerja',
  'Laporan Kinerja Instansi': 'LKjIP, LKPJ, Laporan Tahunan Instansi',
  'Informasi Keuangan': 'RKA, LRA, Neraca, Laporan Arus Kas, CALK, Opini BPK',
  'Pengadaan Barang/Jasa': 'RUP, Kerangka Acuan Kerja/KAK, Ringkasan Kontrak, Daftar Pemenang Tender',
  'Daftar Aset dan Inventaris': 'Buku Inventaris Barang, Rekapitulasi Aset Daerah',
  'Standar Layanan & SOP PPID': 'Maklumat Pelayanan, SOP Permohonan Informasi, SOP Sengketa, SPM',
  'Daftar Informasi Publik & Laporan PPID': 'Buku DIP Tahunan, Register Permohonan, Laporan Layanan',
  'Regulasi & Peraturan': 'Undang-Undang, Perda, Perbup, SK Kepala Daerah/Dinas',
  'Perjanjian Kerja Sama / MoU': 'Nota Kesepahaman Antar Lembaga, Kontrak Pihak Ketiga',
  'Pengumuman & Siaran Pers': 'Pengumuman Resmi, Siaran Pers, Surat Edaran, Hasil SKM',
  'Informasi Serta Merta': 'Peringatan Dini Bencana, Gangguan Layanan, Protokol Darurat',
  'Lainnya': 'Dokumentasi umum lainnya'
}

const youtubePreview = computed(() => {
  if (!form.value.video || form.value.type !== 'video') return null
  try {
    const parsed = new URL(form.value.video)
    let videoId = null
    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
      if (parsed.searchParams.has('v')) {
        videoId = parsed.searchParams.get('v')
      } else {
        const parts = parsed.pathname.split('/').filter(Boolean)
        videoId = parts[parts.length - 1]
      }
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
  } catch (e) {
    return null
  }
})

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (e) => {
  const files = e.target.files
  if (files && files[0]) {
    processFile(files[0])
  }
}

const handleDrop = (e) => {
  dragActive.value = false
  const files = e.dataTransfer.files
  if (files && files[0]) {
    processFile(files[0])
  }
}

const processFile = (file) => {
  if (!file.type.startsWith('image/')) {
    alert('Harap pilih berkas gambar (JPG, PNG, atau WEBP).')
    return
  }
  selectedFile.value = file
  selectedFileName.value = file.name
  imagePreview.value = URL.createObjectURL(file)
}

const fetchGaleriDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const res = await api.get(`/admin/galeri/${id}`)
    const item = res.data.data || res.data

    form.value.title = item.title || ''
    form.value.description = item.description || ''
    form.value.type = item.type || 'foto'
    form.value.visibility = item.visibility || 'public'
    form.value.video = item.video || ''
    form.value.category = item.category || ''
    form.value.jenis_dokumen = item.jenis_dokumen || ''
    form.value.tanggal_upload = item.tanggal_upload || ''
    form.value.is_pinned = !!item.is_pinned
    currentImage.value = item.image || null
  } catch (err) {
    console.error('Failed to fetch galeri detail:', err)
    errorMessage.value = 'Galeri tidak ditemukan atau gagal dimuat.'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  errorMessage.value = ''

  if (form.value.type === 'foto' && !currentImage.value && !selectedFile.value) {
    errorMessage.value = 'Silakan pilih gambar terlebih dahulu.'
    return
  }

  if (form.value.type === 'video' && !form.value.video) {
    errorMessage.value = 'Silakan masukkan tautan video YouTube.'
    return
  }

  submitting.value = true

  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('type', form.value.type)
    formData.append('visibility', form.value.visibility)
    formData.append('description', form.value.description || '')
    formData.append('category', form.value.category || '')
    formData.append('jenis_dokumen', form.value.jenis_dokumen || '')
    formData.append('tanggal_upload', form.value.tanggal_upload || '')
    formData.append('is_pinned', form.value.is_pinned ? '1' : '0')

    if (form.value.type === 'foto' && selectedFile.value) {
      formData.append('image', selectedFile.value)
    } else if (form.value.type === 'video') {
      formData.append('video', form.value.video)
    }

    const id = route.params.id
    await api.post(`/admin/galeri/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    router.push('/admin/galeri')
  } catch (err) {
    console.error('Error updating galeri:', err)
    if (err.response?.data?.errors) {
      errorMessage.value = Object.values(err.response.data.errors).flat().join(', ')
    } else {
      errorMessage.value = err.response?.data?.message || 'Terjadi kesalahan saat memperbarui galeri.'
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchGaleriDetail()
})
</script>
