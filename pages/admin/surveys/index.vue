<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const surveys = ref([])
const loading = ref(false)

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

onMounted(() => fetchSurveys())
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-poll text-blue-600"></i> Survei Kepuasan Masyarakat (SKM)
        </h1>
        <p class="text-sm text-gray-500 mt-1">Daftar instrumen kuesioner dan rekapitulasi penilaian kepuasan layanan publik</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 border-b text-gray-600 uppercase text-xs">
          <tr>
            <th class="py-3 px-4">Judul Survei</th>
            <th class="py-3 px-4">Deskripsi</th>
            <th class="py-3 px-4 text-center">Jumlah Pertanyaan</th>
            <th class="py-3 px-4 text-center">Responden Masuk</th>
            <th class="py-3 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="loading"><td colspan="5" class="py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i> Memuat data survei...</td></tr>
          <tr v-else-if="surveys.length === 0"><td colspan="5" class="py-8 text-center text-gray-400">Belum ada survei aktif.</td></tr>
          <tr v-for="s in surveys" :key="s.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 font-semibold text-gray-800">{{ s.title }}</td>
            <td class="py-3 px-4 text-gray-500 text-xs">{{ s.description || '-' }}</td>
            <td class="py-3 px-4 text-center font-bold text-blue-600">{{ s.questions_count || 0 }} Butir</td>
            <td class="py-3 px-4 text-center font-bold text-green-600">{{ s.responses_count || 0 }} Suara</td>
            <td class="py-3 px-4 text-center">
              <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700">Aktif</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
