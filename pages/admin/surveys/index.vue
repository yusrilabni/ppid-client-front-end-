<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const surveys = ref([])
const loading = ref(false)
const alertMsg = ref('')

async function fetchSurveys() {
  loading.value = true
  try {
    const res = await api.get('/admin/surveys')
    if (res.data?.success) {
      surveys.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function deleteSurvey(s) {
  if (!confirm(`Hapus kuesioner survei: "${s.title}" beserta seluruh hasil responden terkait?`)) return
  try {
    const res = await api.delete(`/admin/surveys/${s.id}`)
    if (res.data?.success) {
      alertMsg.value = `Survei "${s.title}" berhasil dihapus.`
      fetchSurveys()
      setTimeout(() => alertMsg.value = '', 4000)
    }
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal menghapus survei')
  }
}

onMounted(() => fetchSurveys())
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200">
          <i class="fas fa-square-poll-vertical"></i> Evaluasi Layanan Publik
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Survei Kepuasan Masyarakat (SKM)</h1>
        <p class="text-sm text-teal-200/80 max-w-2xl leading-relaxed">
          Kelola kuesioner survei kepuasan indeks layanan informasi publik, pemantauan jumlah responden, dan butir indikator penilaian.
        </p>
      </div>

      <!-- Action Button to Dedicated Create Page -->
      <NuxtLink
        to="/admin/surveys/create"
        class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
      >
        <i class="fas fa-plus-circle text-base"></i>
        <span>Tambah Survei Baru</span>
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

    <!-- Survey Cards / Table -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-gray-100 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th class="py-4 px-6">Kuesioner Survei</th>
              <th class="py-4 px-6 text-center">Tahun</th>
              <th class="py-4 px-6 text-center">Pertanyaan</th>
              <th class="py-4 px-6 text-center">Responden</th>
              <th class="py-4 px-6 text-center">Status</th>
              <th class="py-4 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-normal">
            <tr v-if="loading">
              <td colspan="6" class="py-16 text-center text-gray-400">
                <i class="fas fa-circle-notch fa-spin text-2xl text-teal-600 mb-2"></i>
                <p class="font-medium text-xs">Memuat daftar instrumen survei...</p>
              </td>
            </tr>

            <tr v-else-if="surveys.length === 0">
              <td colspan="6" class="py-16 text-center text-gray-400">
                <i class="fas fa-clipboard-question text-3xl text-gray-300 mb-2"></i>
                <p class="font-medium">Belum ada instrumen survei yang dibuat.</p>
              </td>
            </tr>

            <tr v-for="s in surveys" :key="s.id" class="hover:bg-slate-50/60 transition-colors">
              <td class="py-4 px-6">
                <div class="font-bold text-gray-900">{{ s.title }}</div>
                <div class="text-xs text-gray-500 mt-0.5 line-clamp-1">{{ s.description || 'Tidak ada deskripsi' }}</div>
              </td>

              <td class="py-4 px-6 text-center font-mono text-xs font-bold text-gray-600">
                {{ s.year }}
              </td>

              <td class="py-4 px-6 text-center">
                <span class="inline-flex items-center gap-1 font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg text-xs">
                  <i class="fas fa-list-check text-[11px]"></i>
                  <span>{{ s.questions_count || 0 }} Butir</span>
                </span>
              </td>

              <td class="py-4 px-6 text-center">
                <span class="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs">
                  <i class="fas fa-users text-[11px]"></i>
                  <span>{{ s.responses_count || 0 }} Suara</span>
                </span>
              </td>

              <td class="py-4 px-6 text-center">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                  :class="s.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ s.is_active !== false ? 'Aktif' : 'Non-aktif' }}
                </span>
              </td>

              <td class="py-4 px-6 text-center">
                <div class="inline-flex items-center gap-2">
                  <NuxtLink
                    :to="`/admin/surveys/${s.id}/edit`"
                    class="p-2.5 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-600 rounded-xl transition-all border border-gray-100"
                    title="Edit Survei"
                  >
                    <i class="fas fa-pen-to-square text-xs"></i>
                  </NuxtLink>
                  <button
                    @click="deleteSurvey(s)"
                    class="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-all border border-gray-100"
                    title="Hapus Survei"
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
