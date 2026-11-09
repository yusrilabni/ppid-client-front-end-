<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import CustomSelect from '@/components/ui/CustomSelect.vue'

const questions = ref([])
const loading = ref(false)
const selectedYear = ref(new Date().getFullYear())
const alertMsg = ref('')

const yearOptions = [
  { value: 2026, label: 'Tahun Anggaran 2026', badge: 'Aktif' },
  { value: 2025, label: 'Tahun Anggaran 2025' },
  { value: 2024, label: 'Tahun Anggaran 2024' },
  { value: 2023, label: 'Tahun Anggaran 2023' }
]

async function fetchQuestions() {
  loading.value = true
  try {
    const res = await api.get('/admin/pbj-questions', { params: { year: selectedYear.value } })
    if (res.data?.success) {
      questions.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function deleteQuestion(q) {
  if (!confirm(`Hapus pertanyaan indikator: "${q.question.substring(0, 40)}..."?`)) return
  try {
    const res = await api.delete(`/admin/pbj-questions/${q.id}`)
    if (res.data?.success) {
      alertMsg.value = 'Indikator PBJ berhasil dihapus.'
      fetchQuestions()
      setTimeout(() => alertMsg.value = '', 4000)
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menghapus indikator PBJ')
  }
}

onMounted(() => fetchQuestions())
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-900 via-amber-950 to-orange-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-200">
          <i class="fas fa-gavel"></i> Tata Kelola PBJ
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Instrumen Indikator PBJ</h1>
        <p class="text-sm text-amber-200/80 max-w-2xl leading-relaxed">
          Kelola daftar instrumen pertanyaan verifikasi dan transparansi Pengadaan Barang dan Jasa Pemerintah Kabupaten Sinjai.
        </p>
      </div>

      <!-- Action Button to Dedicated Create Page -->
      <NuxtLink
        to="/admin/pbj/create"
        class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
      >
        <i class="fas fa-plus-circle text-base"></i>
        <span>Tambah Pertanyaan PBJ</span>
      </NuxtLink>
    </div>

    <!-- Alert Message -->
    <div v-if="alertMsg" class="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm font-semibold border border-emerald-200 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="fas fa-check-circle text-emerald-600"></i>
        <span>{{ alertMsg }}</span>
      </div>
      <button @click="alertMsg = ''" class="text-emerald-600 hover:text-emerald-800"><i class="fas fa-times"></i></button>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Pilih Tahun:</span>
        <div class="w-64">
          <CustomSelect
            v-model="selectedYear"
            :options="yearOptions"
            @update:modelValue="fetchQuestions"
          />
        </div>
      </div>
      <span class="text-xs text-gray-400 font-medium">Total: {{ questions.length }} Indikator</span>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th class="py-4 px-6 w-16 text-center">Urutan</th>
              <th class="py-4 px-6">Teks Pertanyaan / Indikator PBJ</th>
              <th class="py-4 px-6 text-center">Tahun</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-normal">
            <tr v-if="loading">
              <td colspan="5" class="py-16 text-center text-gray-400">
                <i class="fas fa-circle-notch fa-spin text-2xl text-amber-600 mb-2"></i>
                <p class="font-medium text-xs">Memuat indikator PBJ...</p>
              </td>
            </tr>

            <tr v-else-if="questions.length === 0">
              <td colspan="5" class="py-16 text-center text-gray-400">
                <i class="fas fa-folder-open text-3xl text-gray-300 mb-2"></i>
                <p class="font-medium">Belum ada indikator PBJ untuk tahun {{ selectedYear }}.</p>
              </td>
            </tr>

            <tr v-for="q in questions" :key="q.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="py-4 px-6 text-center font-bold text-gray-400 font-mono text-xs">
                #{{ q.order || 0 }}
              </td>

              <td class="py-4 px-6">
                <div class="font-semibold text-gray-900 leading-relaxed">{{ q.question }}</div>
                <div v-if="q.category" class="text-xs text-gray-500 mt-1">Kategori: {{ q.category }}</div>
              </td>

              <td class="py-4 px-6 text-center font-mono text-xs font-bold text-gray-600">
                {{ q.year }}
              </td>

              <td class="py-4 px-6 text-center">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                  :class="q.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ q.is_active !== false ? 'Aktif' : 'Non-aktif' }}
                </span>
              </td>

              <td class="py-4 px-6 text-center">
                <div class="inline-flex items-center gap-2">
                  <NuxtLink
                    :to="`/admin/pbj/${q.id}/edit`"
                    class="p-2.5 bg-gray-50 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-xl transition-all border border-gray-100"
                    title="Edit Indikator"
                  >
                    <i class="fas fa-pen text-xs"></i>
                  </NuxtLink>
                  <button
                    @click="deleteQuestion(q)"
                    class="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-all border border-gray-100"
                    title="Hapus Indikator"
                  >
                    <i class="fas fa-trash-can text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
