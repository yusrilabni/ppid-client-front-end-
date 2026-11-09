<script setup>
definePageMeta({ layout: 'admin' })
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const router = useRouter()
const saving = ref(false)
const errors = ref({})

const form = ref({
  title: '',
  description: '',
  year: new Date().getFullYear(),
  is_active: true
})

const yearOptions = [
  { value: 2026, label: 'Tahun 2026', badge: 'Tahun Ini' },
  { value: 2025, label: 'Tahun 2025' },
  { value: 2024, label: 'Tahun 2024' }
]

const statusOptions = [
  { value: true, label: 'Aktif (Dapat Diisi Publik)', description: 'Tampil di formulir kepuasan pemohon', icon: 'fas fa-check-circle', badge: 'Active' },
  { value: false, label: 'Non-Aktif (Ditutup)', description: 'Pengisian kuesioner dinonaktifkan', icon: 'fas fa-lock', badge: 'Closed' }
]

async function submitForm() {
  errors.value = {}
  if (!form.value.title) {
    errors.value.title = 'Judul survei kepuasan wajib diisi.'
    return
  }

  saving.value = true
  try {
    const res = await api.post('/admin/surveys', form.value)
    if (res.data?.success) {
      router.push('/admin/surveys')
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal membuat survei baru')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6 pb-12">
    <!-- Breadcrumb -->
    <div class="flex items-center justify-between">
      <NuxtLink
        to="/admin/surveys"
        class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors uppercase tracking-wider"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Kembali ke Daftar Survei</span>
      </NuxtLink>
      <span class="text-xs text-gray-400 font-medium">Buat Survei Baru</span>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 p-8 text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-200">
            <i class="fas fa-square-poll-vertical text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight">Buat Kuesioner Survei</h1>
            <p class="text-xs text-teal-200/80 mt-0.5">Siapkan instrumen survei kepuasan masyarakat (SKM) baru untuk tahun berjalan</p>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitForm" class="p-8 space-y-6">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Judul Kuesioner Survei <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Contoh: Survei Indeks Kepuasan Masyarakat atas Layanan PPID Semester I"
            class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all duration-200"
            :class="{ 'border-red-400 focus:border-red-500': errors.title }"
          />
          <p v-if="errors.title" class="mt-1 text-xs text-red-500 font-medium">{{ errors.title }}</p>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Deskripsi / Pengantar Survei
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Berikan panduan atau maksud pelaksanaan survei untuk responden..."
            class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50 transition-all duration-200 leading-relaxed"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Tahun Pelaksanaan
            </label>
            <CustomSelect
              v-model="form.year"
              :options="yearOptions"
              placeholder="Pilih Tahun"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Status Kuesioner
            </label>
            <CustomSelect
              v-model="form.is_active"
              :options="statusOptions"
              placeholder="Pilih Status"
            />
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
          <NuxtLink
            to="/admin/surveys"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Batal
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            <span>{{ saving ? 'Menyimpan...' : 'Simpan Kuesioner' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
