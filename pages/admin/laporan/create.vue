<script setup>
definePageMeta({ layout: 'admin' })
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const saving = ref(false)

const currentYear = new Date().getFullYear()
const form = ref({
  title: '',
  tahun: currentYear,
  type: 'tahunan',
  content: '',
  published: true,
  cover: null,
  file: null
})

function onCoverChange(e) {
  const f = e.target.files[0]
  if (f) form.value.cover = f
}

function onFileChange(e) {
  const f = e.target.files[0]
  if (f) form.value.file = f
}

async function submitForm() {
  if (!form.value.title.trim()) {
    alert('Judul laporan wajib diisi.')
    return
  }
  if (!form.value.file) {
    alert('Berkas file PDF wajib diunggah.')
    return
  }

  saving.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('tahun', form.value.tahun)
    formData.append('type', form.value.type)
    if (form.value.content) formData.append('content', form.value.content)
    formData.append('published', form.value.published ? 1 : 0)
    if (form.value.cover) formData.append('cover', form.value.cover)
    formData.append('file', form.value.file)

    const res = await api.post('/admin/laporan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.data?.success) {
      alert('Laporan berhasil ditambahkan.')
      router.push('/admin/laporan')
    }
  } catch (err) {
    alert('Gagal mengunggah laporan: ' + (err.response?.data?.message || err.message))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink
        to="/admin/laporan"
        class="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center transition shadow-sm"
      >
        <i class="fas fa-arrow-left"></i>
      </NuxtLink>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-gray-900">Upload Laporan Baru</h1>
        <p class="text-xs text-gray-500 mt-0.5">Unggah berkas laporan tahunan atau laporan khusus PPID</p>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Judul Laporan <span class="text-rose-500">*</span></label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Contoh: Laporan Tahunan Pelayanan Informasi Publik PPID Tahun 2025"
            class="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Tahun Laporan <span class="text-rose-500">*</span></label>
            <input
              v-model="form.tahun"
              type="number"
              class="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Tipe Laporan</label>
            <select
              v-model="form.type"
              class="w-full p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="tahunan">Laporan Tahunan</option>
              <option value="triwulan">Laporan Triwulan</option>
              <option value="khusus">Laporan Khusus</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Ringkasan / Abstrak Isi Laporan</label>
          <textarea
            v-model="form.content"
            rows="4"
            placeholder="Ringkasan eksekutif capaian pelayanan, jumlah pemohon, waktu respons rata-rata..."
            class="w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Gambar Cover (Opsional)</label>
            <input
              type="file"
              accept="image/*"
              @change="onCoverChange"
              class="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p class="text-[10px] text-gray-400 mt-1">Format: JPG, PNG, WEBP (Maksimal 2 MB)</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Berkas File Laporan (PDF) <span class="text-rose-500">*</span></label>
            <input
              type="file"
              accept=".pdf"
              @change="onFileChange"
              class="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p class="text-[10px] text-gray-400 mt-1">Format: PDF resmi (Maksimal 20 MB)</p>
          </div>
        </div>

        <div class="pt-2">
          <label class="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.published"
              class="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span class="text-xs font-bold text-gray-700">Publikasikan langsung ke portal publik PPID</span>
          </label>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
        <NuxtLink
          to="/admin/laporan"
          class="px-5 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
        >
          Batal
        </NuxtLink>
        <button
          :disabled="saving"
          @click="submitForm"
          class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/20 transition flex items-center gap-2 disabled:opacity-50"
        >
          <i class="fas fa-floppy-disk" :class="{ 'fa-spin': saving }"></i>
          <span>{{ saving ? 'Menyimpan...' : 'Simpan Laporan' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
