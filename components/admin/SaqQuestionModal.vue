<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
        <h3 class="font-bold text-gray-800 text-lg">{{ isEdit ? 'Edit Pertanyaan' : 'Tambah Pertanyaan' }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Pertanyaan <span class="text-red-500">*</span></label>
          <textarea
            v-model="form.pertanyaan"
            rows="4"
            placeholder="Tulis pertanyaan lengkap..."
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Tab <span class="text-red-500">*</span></label>
            <select
              v-model="form.tab"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">— Pilih Tab —</option>
              <option v-for="t in tabs" :key="t.tab" :value="t.tab">{{ t.tab }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Kode</label>
            <input
              v-model="form.kode"
              type="text"
              placeholder="mis. EM-JI-999"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Klasifikasi</label>
            <select
              v-model="form.klasifikasi_otomatis"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">— Pilih —</option>
              <option>Informasi Berkala</option>
              <option>Informasi Serta Merta</option>
              <option>Informasi Setiap Saat</option>
              <option>Informasi Dikecualikan</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Input Type</label>
            <select
              v-model="form.input_type"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">— Pilih —</option>
              <option value="dokumen">Dokumen</option>
              <option value="foto">Foto</option>
              <option value="situs">Situs</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Target Upload</label>
            <select
              v-model="form.target_upload"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">— Pilih —</option>
              <option value="ppid">PPID</option>
              <option value="pemkab">Pemkab</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Parent (Kategori Induk)</label>
            <select
              v-model="form.parent_id"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option :value="null">— Tanpa Induk —</option>
              <option v-for="p in parents" :key="p.id" :value="p.id">{{ p.kode ? p.kode + ' — ' : '' }}{{ truncate(p.pertanyaan, 60) }}</option>
            </select>
          </div>
        </div>

        <div v-if="formError" class="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <i class="fas fa-exclamation-circle mr-1"></i> {{ formError }}
        </div>
      </div>

      <div class="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-2 rounded-b-2xl">
        <button @click="$emit('close')" class="px-5 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Batal</button>
        <button
          @click="save"
          :disabled="saving"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <i v-if="saving" class="fas fa-spinner fa-spin mr-1"></i> {{ isEdit ? 'Simpan Perubahan' : 'Tambah' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  item: { type: Object, default: null },
  tabs: { type: Array, default: () => [] },
})
const emit = defineEmits(['close', 'saved'])

const isEdit = computed(() => !!props.item)
const saving = ref(false)
const formError = ref('')
const parents = ref([])

const form = ref({
  pertanyaan: props.item?.pertanyaan || '',
  tab: props.item?.tab || '',
  kode: props.item?.kode || '',
  klasifikasi_otomatis: props.item?.klasifikasi_otomatis || '',
  input_type: props.item?.input_type || '',
  target_upload: props.item?.target_upload || '',
  parent_id: props.item?.parent_id ?? null,
})

function truncate(text, len) {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

async function fetchParents() {
  try {
    const res = await api.get('/saq-admin/indicators', { params: { per_page: 200 } })
    const list = res.data?.data?.data || []
    parents.value = list.filter((i) => i.is_category == 1 && i.id !== props.item?.id)
  } catch (e) {
    console.error('Gagal memuat parent:', e)
  }
}

async function save() {
  formError.value = ''
  if (!form.value.pertanyaan.trim()) {
    formError.value = 'Pertanyaan wajib diisi.'
    return
  }
  if (!form.value.tab) {
    formError.value = 'Tab wajib dipilih.'
    return
  }
  saving.value = true
  try {
    const payload = {
      pertanyaan: form.value.pertanyaan.trim(),
      tab: form.value.tab,
      kode: form.value.kode || null,
      klasifikasi_otomatis: form.value.klasifikasi_otomatis || null,
      input_type: form.value.input_type || null,
      target_upload: form.value.target_upload || null,
      parent_id: form.value.parent_id || null,
    }
    if (isEdit.value) {
      await api.put(`/saq-admin/indicators/${props.item.id}`, payload)
    } else {
      await api.post('/saq-admin/indicators', payload)
    }
    emit('saved')
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan. Coba lagi.'
  } finally {
    saving.value = false
  }
}

onMounted(fetchParents)
</script>
