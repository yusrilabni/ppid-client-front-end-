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
  question: '',
  year: new Date().getFullYear(),
  order: 0,
  is_active: true
})

const yearOptions = [
  { value: 2026, label: 'Tahun 2026' },
  { value: 2025, label: 'Tahun 2025' },
  { value: 2024, label: 'Tahun 2024' },
  { value: 2023, label: 'Tahun 2023' }
]

const statusOptions = [
  { value: true, label: 'Aktif (Digunakan dalam Penilaian)', icon: 'fas fa-check-circle', badge: 'Active' },
  { value: false, label: 'Non-Aktif (Disembunyikan)', icon: 'fas fa-eye-slash', badge: 'Draft' }
]

async function submitForm() {
  errors.value = {}
  if (!form.value.question) {
    errors.value.question = 'Teks pertanyaan indikator PBJ wajib diisi.'
    return
  }

  saving.value = true
  try {
    const res = await api.post('/admin/pbj-questions', form.value)
    if (res.data?.success) {
      router.push('/admin/pbj')
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menyimpan pertanyaan PBJ')
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
        to="/admin/pbj"
        class="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors uppercase tracking-wider"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Kembali ke Daftar Indikator</span>
      </NuxtLink>
      <span class="text-xs text-gray-400 font-medium">Tambah Indikator PBJ</span>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-amber-950 to-orange-950 p-8 text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-200">
            <i class="fas fa-plus-circle text-lg"></i>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight">Tambah Indikator PBJ</h1>
            <p class="text-xs text-amber-200/80 mt-0.5">Rumuskan pertanyaan transparansi pengadaan barang dan jasa publik baru</p>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submitForm" class="p-8 space-y-6">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Teks Pertanyaan / Indikator Penilaian PBJ <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.question"
            rows="4"
            placeholder="Contoh: Rencana Umum Pengadaan (RUP) telah dipublikasikan melalui Sistem Informasi Rencana Umum Pengadaan (SiRUP)..."
            class="w-full p-4 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all duration-200 leading-relaxed"
            :class="{ 'border-red-400 focus:border-red-500': errors.question }"
          ></textarea>
          <p v-if="errors.question" class="mt-1 text-xs text-red-500 font-medium">{{ errors.question }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Tahun Anggaran
            </label>
            <CustomSelect
              v-model="form.year"
              :options="yearOptions"
              placeholder="Pilih Tahun"
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
              class="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-50 transition-all duration-200"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Status Indikator
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
            to="/admin/pbj"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
          >
            Batal
          </NuxtLink>

          <button
            type="submit"
            :disabled="saving"
            class="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            <span>{{ saving ? 'Menyimpan...' : 'Simpan Indikator PBJ' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
