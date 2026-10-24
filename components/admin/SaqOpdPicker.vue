<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
        <div>
          <h3 class="font-bold text-gray-800 text-lg">Mapping OPD</h3>
          <p class="text-sm text-gray-500">{{ item?.kode || ('#' + item?.id) }} — {{ truncate(item?.pertanyaan, 70) }}</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto">
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <label class="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-sm font-medium text-indigo-700 cursor-pointer hover:bg-indigo-100">
            <input type="checkbox" v-model="allOpds" class="w-4 h-4 accent-indigo-600" />
            Semua OPD (124)
          </label>
          <div class="flex-1 min-w-[180px] relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Cari OPD..."
              class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div v-if="loadingOpds" class="text-center text-gray-500 py-8">
          <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
          <p class="text-sm">Memuat daftar OPD...</p>
        </div>

        <div v-else class="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-72 overflow-y-auto">
          <label
            v-for="opd in filteredOpds"
            :key="opd.id"
            class="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/60 cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              :value="opd.id"
              v-model="selectedIds"
              :disabled="allOpds"
              class="w-4 h-4 accent-blue-600"
            />
            <span class="text-gray-800">{{ opd.name }}</span>
          </label>
          <p v-if="!filteredOpds.length" class="px-4 py-6 text-center text-gray-500 text-sm">Tidak ada OPD yang cocok.</p>
        </div>

        <p class="mt-3 text-sm text-gray-600">
          <span v-if="allOpds" class="font-medium text-indigo-700">Semua OPD (124) akan dipetakan.</span>
          <span v-else><span class="font-bold text-gray-800">{{ selectedIds.length }}</span> OPD dipilih.</span>
        </p>

        <div v-if="formError" class="mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <i class="fas fa-exclamation-circle mr-1"></i> {{ formError }}
        </div>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 rounded-b-2xl">
        <button @click="$emit('close')" class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Batal</button>
        <button
          @click="save"
          :disabled="saving"
          class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1"></i> Simpan Mapping
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
