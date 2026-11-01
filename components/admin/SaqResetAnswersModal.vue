<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-rose-100">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 px-6 py-4 flex items-center justify-between text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg shadow-inner">
            <i class="fas fa-trash-alt"></i>
          </div>
          <div>
            <h3 class="font-bold text-base md:text-lg">Reset / Hapus Jawaban SAQ</h3>
            <p class="text-xs text-rose-100">Superadmin Action</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- Pilihan Ruang Lingkup Reset -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Pilih Cakupan Reset Jawaban:
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              @click="mode = 'single'"
              :class="[
                'p-3 rounded-2xl border-2 text-left transition-all',
                mode === 'single'
                  ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-building text-sm" :class="mode === 'single' ? 'text-rose-600' : 'text-gray-400'"></i>
                <span class="text-xs font-extrabold">Satu OPD Tertentu</span>
              </div>
              <p class="text-[11px] text-gray-500 leading-snug">Hapus jawaban milik satu OPD terpilih.</p>
            </button>

            <button
              type="button"
              @click="mode = 'all'"
              :class="[
                'p-3 rounded-2xl border-2 text-left transition-all',
                mode === 'all'
                  ? 'border-red-600 bg-red-50/80 text-red-950 font-bold shadow-sm ring-2 ring-red-500/20'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center gap-2 mb-1">
                <i class="fas fa-globe text-sm" :class="mode === 'all' ? 'text-red-600' : 'text-gray-400'"></i>
                <span class="text-xs font-extrabold">SEMUA OPD (Total)</span>
              </div>
              <p class="text-[11px] text-red-600 font-semibold leading-snug">Hapus seluruh jawaban semua OPD.</p>
            </button>
          </div>
        </div>

        <!-- Pilih OPD Jika Mode Single -->
        <div v-if="mode === 'single'" class="space-y-1.5">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Pilih OPD Yang Direset <span class="text-rose-500">*</span>
          </label>
          <select
            v-model="selectedOpdId"
            class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs lg:text-sm focus:ring-2 focus:ring-rose-500 outline-none bg-white font-medium"
          >
            <option value="" disabled>-- Pilih OPD --</option>
            <option v-for="opd in opds" :key="opd.id" :value="opd.id">
              {{ opd.name }}
            </option>
          </select>
        </div>

        <!-- Peringatan Bahaya -->
        <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div class="flex items-start gap-2.5">
            <i class="fas fa-exclamation-triangle text-amber-600 text-base mt-0.5 shrink-0"></i>
            <div class="space-y-1">
              <p class="font-bold text-amber-950 text-sm">Peringatan: Tindakan Permanen</p>
              <p class="leading-relaxed text-amber-900">
                Data yang akan dihapus meliputi:
              </p>
              <ul class="list-disc list-inside space-y-0.5 text-amber-800">
                <li>Seluruh rekaman jawaban SAQ pada cakupan yang dipilih.</li>
                <li>Seluruh tautan link bukti jawaban.</li>
                <li>Data publikasi Informasi / Informasi Pemkab yang dibuat melalui SAQ.</li>
                <li>Dokumentasi Galeri yang dibuat melalui SAQ.</li>
                <li>File fisik dokumen lampiran yang tersimpan di disk server.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Konfirmasi Teks -->
        <div class="space-y-1.5 pt-1">
          <label class="block text-xs font-bold text-gray-700">
            Ketik kata <span class="text-rose-600 font-mono font-black">RESET</span> di bawah ini untuk konfirmasi:
          </label>
          <input
            v-model="confirmationText"
            type="text"
            placeholder="Ketik RESET"
            class="w-full px-4 py-2.5 border-2 rounded-xl text-sm font-mono tracking-wider outline-none transition-all"
            :class="[
              confirmationText.trim().toUpperCase() === 'RESET'
                ? 'border-rose-500 bg-rose-50/50 text-rose-700 focus:ring-4 focus:ring-rose-500/10'
                : 'border-gray-200 bg-white text-gray-800 focus:border-gray-400'
            ]"
          />
        </div>

        <!-- Pesan Error -->
        <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <i class="fas fa-circle-exclamation text-rose-600"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
        <button
          type="button"
          @click="$emit('close')"
          :disabled="submitting"
          class="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          @click="submitReset"
          :disabled="!isConfirmed || submitting || (mode === 'single' && !selectedOpdId)"
          class="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
        >
          <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-trash-alt"></i>
          <span>{{ mode === 'all' ? 'Reset Jawaban SEMUA OPD' : 'Reset Jawaban OPD Terpilih' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  opds: {
    type: Array,
    default: () => []
  },
  defaultOpdId: {
    type: [Number, String],
    default: ''
  }
})

const emit = defineEmits(['close', 'done'])

const { $api: api } = useNuxtApp()

const mode = ref(props.defaultOpdId ? 'single' : 'all')
const selectedOpdId = ref(props.defaultOpdId || '')
const confirmationText = ref('')
const submitting = ref(false)
const errorMessage = ref('')

const isConfirmed = computed(() => {
  return confirmationText.value.trim().toUpperCase() === 'RESET'
})

const submitReset = async () => {
  if (!isConfirmed.value) return
  if (mode.value === 'single' && !selectedOpdId.value) {
    errorMessage.value = 'Silakan pilih OPD yang ingin direset.'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    const payload = mode.value === 'all'
      ? { all_opds: true }
      : { organization_id: selectedOpdId.value }

    const res = await api.post('/saq-admin/reset-answers', payload)
    emit('done', res.data?.message || 'Jawaban SAQ berhasil direset.')
    emit('close')
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Gagal mereset jawaban SAQ.'
  } finally {
    submitting.value = false
  }
}
</script>
