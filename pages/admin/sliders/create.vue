<script setup>
definePageMeta({ layout: 'admin' })
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'
import FileUploader from '@/components/ui/FileUploader.vue'

const router = useRouter()
const saving = ref(false)
const errors = ref({})

const form = ref({
  title: '',
  subtitle: '',
  link: '',
  order: 0,
  is_active: true,
  image: null
})

const statusOptions = [
  { value: true, label: 'Aktif (Tampil di Beranda)', description: 'Slide banner akan muncul di slider utama', icon: 'fas fa-check-circle', badge: 'Active' },
  { value: false, label: 'Non-Aktif (Disembunyikan)', description: 'Hanya tersimpan di sistem admin', icon: 'fas fa-eye-slash', badge: 'Hidden' }
]

async function submitForm() {
  errors.value = {}
  if (!form.value.title) {
    errors.value.title = 'Judul utama banner wajib diisi.'
    return
  }
  if (!form.value.image) {
    errors.value.image = 'File gambar banner wajib diunggah.'
    return
  }

  saving.value = true
  const fd = new FormData()
  fd.append('title', form.value.title)
  if (form.value.subtitle) fd.append('subtitle', form.value.subtitle)
  if (form.value.link) fd.append('link', form.value.link)
  fd.append('order', form.value.order || 0)
  fd.append('is_active', form.value.is_active ? 1 : 0)
  fd.append('image', form.value.image)

  try {
    const res = await api.post('/admin/sliders', fd)
    if (res.data?.success) {
      router.push('/admin/sliders')
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan slide banner')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 pb-12">
    <!-- Breadcrumb -->
    <div class="flex items-center justify-between">
      <NuxtLink
        to="/admin/sliders"
        class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors uppercase tracking-wider"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Kembali ke Galeri Sliders</span>
      </NuxtLink>
      <span class="text-xs text-gray-400 font-medium">Tambah Banner Baru</span>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 p-8 text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-rose-200">
            <i class="fas fa-image text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight">Tambah Banner Slide Baru</h1>
            <p class="text-xs text-rose-200/80 mt-0.5">Unggah gambar visual promosi beresolusi tinggi untuk beranda utama portal PPID</p>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitForm" class="p-8 space-y-8">
        <!-- Section 1: Detail Teks & Tautan -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-heading"></i> 1. Konten Teks & Link
          </h2>

          <div class="space-y-5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Judul Utama Banner <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Contoh: Layanan Keterbukaan Informasi Publik Cepat & Akurat"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all duration-200"
                :class="{ 'border-red-400 focus:border-red-500': errors.title }"
              />
              <p v-if="errors.title" class="mt-1 text-xs text-red-500 font-medium">{{ errors.title }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Subjudul / Ringkasan Keterangan
              </label>
              <input
                v-model="form.subtitle"
                type="text"
                placeholder="Contoh: Wujudkan transparansi tata kelola pemerintahan Kabupaten Sinjai yang akuntabel"
                class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all duration-200"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Tautan Aksi (URL Target)
                </label>
                <input
                  v-model="form.link"
                  type="url"
                  placeholder="https://ppid.sinjaikab.go.id/informasi-publik..."
                  class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all duration-200"
                />
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Nomor Urutan
                </label>
                <input
                  v-model.number="form.order"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Status Tampilan
              </label>
              <CustomSelect
                v-model="form.is_active"
                :options="statusOptions"
                placeholder="Pilih Status"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Upload File Banner -->
        <div class="space-y-4">
          <h2 class="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-2 border-b border-gray-100 pb-2">
            <i class="fas fa-panorama"></i> 2. File Visual Gambar Banner
          </h2>

          <FileUploader
            v-model="form.image"
            accept="image/*"
            label="Upload Gambar Banner Slide"
            hint="Format: JPG, PNG, WEBP (Maksimal 10MB, Rasio Disarankan 16:9 atau 1920x800 px)"
            :error="errors.image"
          />
        </div>

        <!-- Action Footer -->
        <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <NuxtLink
            to="/admin/sliders"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Batal
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            <span>{{ saving ? 'Menyimpan...' : 'Simpan Banner Slide' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
