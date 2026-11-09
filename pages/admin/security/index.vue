<script setup>
definePageMeta({ layout: 'admin' })
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const blocks = ref([])
const loading = ref(false)

async function fetchBlocks() {
  loading.value = true
  try {
    const res = await api.get('/admin/security-blocks')
    if (res.data?.success) {
      blocks.value = res.data.data.data || []
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchBlocks())
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-shield-virus text-red-600"></i> Security Blocks & Proteksi Sistem
        </h1>
        <p class="text-sm text-gray-500 mt-1">Daftar alamat IP dan agen yang diblokir otomatis oleh sistem keamanan PPID</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 border-b text-gray-600 uppercase text-xs">
          <tr>
            <th class="py-3 px-4">Alamat IP</th>
            <th class="py-3 px-4">Alasan Pemblokiran</th>
            <th class="py-3 px-4">Waktu Terblokir</th>
            <th class="py-3 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="loading"><td colspan="4" class="py-8 text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i> Memuat data proteksi keamanan...</td></tr>
          <tr v-else-if="blocks.length === 0"><td colspan="4" class="py-8 text-center text-gray-400">Tidak ada IP yang sedang diblokir. Sistem aman.</td></tr>
          <tr v-for="b in blocks" :key="b.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 font-mono font-bold text-red-600 text-xs">{{ b.ip_address }}</td>
            <td class="py-3 px-4 text-gray-700 text-xs">{{ b.reason || 'Percobaan akses mencurigakan' }}</td>
            <td class="py-3 px-4 text-gray-500 text-xs">{{ b.created_at ? new Date(b.created_at).toLocaleString('id-ID') : '-' }}</td>
            <td class="py-3 px-4 text-center">
              <span class="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">Blocked</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
