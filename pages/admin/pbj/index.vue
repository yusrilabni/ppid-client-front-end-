<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const questions = ref([])
const loading = ref(false)
const selectedYear = ref(new Date().getFullYear())

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

onMounted(() => fetchQuestions())
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-tasks text-blue-600"></i> Instrumen Indikator PBJ
        </h1>
        <p class="text-sm text-gray-500 mt-1">Daftar indikator pertanyaan transparansi Pengadaan Barang dan Jasa per tahun anggaran</p>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs font-semibold text-gray-600">Tahun:</label>
        <select v-model="selectedYear" @change="fetchQuestions" class="px-3 py-2 bg-gray-50 border rounded-xl text-sm font-semibold">
          <option :value="2026">2026</option>
          <option :value="2025">2025</option>
          <option :value="2024">2024</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 border-b text-gray-600 uppercase text-xs">
          <tr>
            <th class="py-3 px-4 w-12 text-center">No</th>
            <th class="py-3 px-4">Pertanyaan Indikator PBJ</th>
            <th class="py-3 px-4">Jenis / Kategori</th>
            <th class="py-3 px-4 text-center">Tahun</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="loading"><td colspan="4" class="py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i> Memuat indikator PBJ...</td></tr>
          <tr v-else-if="questions.length === 0"><td colspan="4" class="py-8 text-center text-gray-400">Belum ada indikator PBJ untuk tahun {{ selectedYear }}.</td></tr>
          <tr v-for="(q, idx) in questions" :key="q.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 text-center font-bold text-gray-400 text-xs">{{ idx + 1 }}</td>
            <td class="py-3 px-4 font-medium text-gray-800">{{ q.question }}</td>
            <td class="py-3 px-4 text-gray-500 text-xs"><span class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-semibold">{{ q.category || 'Standar' }}</span></td>
            <td class="py-3 px-4 text-center font-semibold text-xs text-gray-600">{{ q.year }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
