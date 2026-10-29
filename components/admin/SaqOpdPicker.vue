<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 bg-gradient-to-r from-indigo-700 to-blue-700 text-white flex items-center justify-between shrink-0">
        <div>
          <h3 class="font-bold text-base md:text-lg flex items-center gap-2">
            <i class="fas fa-sitemap"></i>
            Mapping OPD untuk Pertanyaan
          </h3>
          <p class="text-xs text-indigo-100 font-mono mt-0.5">{{ item?.kode || ('#' + item?.id) }} — {{ truncate(item?.pertanyaan, 70) }}</p>
        </div>
        <button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto space-y-4">
        <div class="flex flex-wrap items-center gap-2.5">
          <label class="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700 cursor-pointer hover:bg-indigo-100 transition-colors">
            <input type="checkbox" v-model="allOpds" class="w-4 h-4 accent-indigo-600 rounded" />
            Petakan ke Seluruh OPD ({{ opds.length }})
          </label>
          <div class="flex-1 min-w-[200px] relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Cari nama OPD..."
              class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            />
          </div>
          <button
            v-if="!allOpds"
            type="button"
            @click="clearAll"
            class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Hapus Pilihan
          </button>
        </div>

        <div v-if="loadingOpds" class="text-center text-gray-400 py-10">
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p class="text-xs">Memuat daftar OPD...</p>
        </div>

        <div v-else class="border border-gray-200 rounded-2xl divide-y divide-gray-100 max-h-72 overflow-y-auto bg-gray-50/50">
          <label
            v-for="opd in filteredOpds"
            :key="opd.id"
            :class="[
              'flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer text-xs',
              selectedIds.includes(opd.id) || allOpds ? 'bg-indigo-50/60 font-semibold text-indigo-900' : 'hover:bg-white text-gray-700'
            ]"
          >
            <input
              type="checkbox"
              :value="opd.id"
              v-model="selectedIds"
              :disabled="allOpds"
              class="w-4 h-4 accent-indigo-600 rounded"
            />
            <span class="flex-1">{{ opd.name }}</span>
            <span v-if="opd.saq_indicators_count !== undefined" class="text-[10px] text-gray-400 font-mono">
              {{ opd.saq_indicators_count }} soal
            </span>
          </label>
          <p v-if="!filteredOpds.length" class="px-4 py-8 text-center text-gray-400 text-xs">Tidak ada OPD yang cocok dengan pencarian.</p>
        </div>

        <div class="flex items-center justify-between text-xs text-gray-600">
          <p>
            <span v-if="allOpds" class="font-bold text-indigo-700">Semua OPD ({{ opds.length }}) akan otomatis memuat pertanyaan ini.</span>
            <span v-else><span class="font-bold text-gray-900">{{ selectedIds.length }}</span> dari {{ opds.length }} OPD dipilih.</span>
          </p>
        </div>

        <div v-if="formError" class="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <i class="fas fa-exclamation-circle mt-0.5"></i>
          <span>{{ formError }}</span>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 shrink-0">
        <button @click="$emit('close')" type="button" class="px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-100 font-medium">Batal</button>
        <button
          @click="save"
          :disabled="saving"
          type="button"
          class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-check"></i>
          Simpan Pemetaan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  item: { type: Object, required: true },
})
const emit = defineEmits(['close', 'saved'])

const opds = ref([])
const loadingOpds = ref(true)
const search = ref('')
const selectedIds = ref([])
const allOpds = ref(false)
const saving = ref(false)
const formError = ref('')

function truncate(text, len) {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

const filteredOpds = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return opds.value
  return opds.value.filter((o) => o.name.toLowerCase().includes(q))
})

function clearAll() {
  selectedIds.value = []
}

async function fetchOpds() {
  loadingOpds.value = true
  try {
    const res = await api.get('/saq-admin/opds')
    opds.value = res.data?.data || []
  } catch (e) {
    formError.value = 'Gagal memuat daftar OPD.'
  } finally {
    loadingOpds.value = false
  }
}

async function fetchCurrent() {
  try {
    const res = await api.get(`/saq-admin/indicators/${props.item.id}`)
    selectedIds.value = res.data?.mapped_opd_ids || []
    if (opds.value.length > 0 && selectedIds.value.length === opds.value.length) {
      allOpds.value = true
    }
  } catch (e) {
    console.error('Gagal memuat mapping saat ini:', e)
  }
}

async function save() {
  formError.value = ''
  saving.value = true
  try {
    const payload = allOpds.value ? { all_opds: true } : { organization_ids: selectedIds.value }
    const res = await api.put(`/saq-admin/indicators/${props.item.id}/mapping`, payload)
    emit('saved', res.data?.data?.mapped_count ?? selectedIds.value.length)
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan mapping.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchOpds()
  await fetchCurrent()
})
</script>
