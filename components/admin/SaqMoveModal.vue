<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex items-center justify-between text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
            <i class="fas fa-exchange-alt"></i>
          </div>
          <div>
            <h3 class="font-bold text-base md:text-lg">Pindahkan Pertanyaan</h3>
            <p class="text-xs text-blue-100 font-mono">{{ item?.kode || ('ID #' + item?.id) }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="text-white/80 hover:text-white transition-colors">
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <!-- Preview Pertanyaan -->
      <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div class="bg-gray-50 border border-gray-200/70 rounded-xl p-3.5 text-xs text-gray-700">
          <span class="font-semibold text-gray-500 block mb-1 uppercase tracking-wider text-[10px]">Teks Pertanyaan Saat Ini:</span>
          <p class="line-clamp-3 italic">{{ item?.pertanyaan }}</p>
        </div>

        <!-- Tab Tujuan -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Tab Tujuan <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.target_tab"
            class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
          >
            <option v-for="t in tabs" :key="t.tab" :value="t.tab">{{ t.tab }}</option>
          </select>
        </div>

        <!-- Seksi Tujuan -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Seksi / Bagian
          </label>
          <div class="relative">
            <input
              v-model="form.target_section"
              type="text"
              placeholder="Contoh: A. Layanan Elektronik"
              list="sectionSuggestions"
              class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <datalist id="sectionSuggestions">
              <option v-for="s in availableSections" :key="s" :value="s"></option>
            </datalist>
          </div>
          <p class="text-[11px] text-gray-400 mt-1">Ketik nama seksi atau pilih saran dari seksi yang sudah ada.</p>
        </div>

        <!-- Kategori Induk (Parent) -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Kategori Induk (Parent)
          </label>
          <select
            v-model="form.target_parent_id"
            class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option :value="null">— Tanpa Induk (Langsung di bawah Seksi) —</option>
            <option v-for="p in availableParents" :key="p.id" :value="p.id">
              {{ p.kode ? p.kode + ' — ' : '' }}{{ truncate(p.pertanyaan, 55) }}
            </option>
          </select>
        </div>

        <!-- Urutan (Order) -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Urutan Tampil (Order)
          </label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="form.target_order"
              type="number"
              min="1"
              class="w-28 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-center"
            />
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                @click="moveDirection('up')"
                :disabled="movingDirection"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors"
                title="Tukar posisi ke atas satu langkah"
              >
                <i class="fas fa-arrow-up"></i> Naikkan
              </button>
              <button
                type="button"
                @click="moveDirection('down')"
                :disabled="movingDirection"
                class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors"
                title="Tukar posisi ke bawah satu langkah"
              >
                <i class="fas fa-arrow-down"></i> Turunkan
              </button>
            </div>
          </div>
        </div>

        <div v-if="formError" class="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <i class="fas fa-exclamation-circle mt-0.5"></i>
          <span>{{ formError }}</span>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2.5">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-100 font-medium transition-colors"
        >
          Batal
        </button>
        <button
          @click="submitMove"
          :disabled="saving"
          type="button"
          class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-check"></i>
          Simpan Perpindahan
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
  tabs: { type: Array, default: () => [] },
  allQuestions: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)
const movingDirection = ref(false)
const formError = ref('')
const sectionsList = ref([])

const form = ref({
  target_tab: props.item?.tab || '',
  target_section: props.item?.section || '',
  target_parent_id: props.item?.parent_id ?? null,
  target_order: props.item?.order ?? 1,
})

function truncate(text, len) {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

const availableSections = computed(() => {
  const fromApi = sectionsList.value
    .filter(s => !form.value.target_tab || s.tab === form.value.target_tab)
    .map(s => s.section)
  const fromProps = props.allQuestions
    .filter(q => (!form.value.target_tab || q.tab === form.value.target_tab) && q.section)
    .map(q => q.section)
  return Array.from(new Set([...fromApi, ...fromProps])).filter(Boolean)
})

const availableParents = computed(() => {
  return props.allQuestions.filter(q => 
    q.is_category && 
    q.id !== props.item?.id && 
    (!form.value.target_tab || q.tab === form.value.target_tab)
  )
})

async function fetchSections() {
  try {
    const res = await api.get('/saq-admin/sections')
    sectionsList.value = res.data?.data || []
  } catch (e) {
    // Ignore error
  }
}

async function moveDirection(direction) {
  movingDirection.value = true
  formError.value = ''
  try {
    const res = await api.post(`/saq-admin/indicators/${props.item.id}/move`, {
      direction,
    })
    emit('saved', res.data?.data)
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal mengubah urutan.'
  } finally {
    movingDirection.value = false
  }
}

async function submitMove() {
  saving.value = true
  formError.value = ''
  try {
    const payload = {
      target_tab: form.value.target_tab,
      target_section: form.value.target_section || null,
      target_parent_id: form.value.target_parent_id || null,
      target_order: form.value.target_order,
    }
    const res = await api.post(`/saq-admin/indicators/${props.item.id}/move`, payload)
    emit('saved', res.data?.data)
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal memindahkan pertanyaan.'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSections()
})
</script>
