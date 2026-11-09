<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: [Object, File, String, null],
  accept: {
    type: String,
    default: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
  },
  maxSizeMb: {
    type: Number,
    default: 20
  },
  label: {
    type: String,
    default: 'Unggah Berkas Dokumen'
  },
  hint: {
    type: String,
    default: 'Format yang didukung: PDF, DOC, DOCX, JPG, PNG (Maks 20MB)'
  },
  existingUrl: String
})

const emit = defineEmits(['update:modelValue', 'change'])

const isDragging = ref(false)
const fileName = ref('')
const fileSize = ref('')
const fileError = ref('')

function formatBytes(bytes) {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function processFile(file) {
  fileError.value = ''
  if (!file) return

  if (file.size > props.maxSizeMb * 1024 * 1024) {
    fileError.value = `Ukuran berkas melebihi batas maksimal ${props.maxSizeMb}MB.`
    return
  }

  fileName.value = file.name
  fileSize.value = formatBytes(file.size)
  emit('update:modelValue', file)
  emit('change', file)
}

function onFileChange(e) {
  const file = e.target.files[0]
  processFile(file)
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  processFile(file)
}

function removeFile() {
  fileName.value = ''
  fileSize.value = ''
  fileError.value = ''
  emit('update:modelValue', null)
  emit('change', null)
}
</script>

<template>
  <div class="w-full space-y-2">
    <label class="block text-xs font-bold uppercase tracking-wider text-gray-700">
      {{ label }}
    </label>

    <div
      class="relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 text-center flex flex-col items-center justify-center cursor-pointer group"
      :class="[
        isDragging ? 'border-blue-500 bg-blue-50/60 ring-4 ring-blue-100' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-400',
        fileName ? 'border-emerald-300 bg-emerald-50/30' : ''
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        :accept="accept"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @change="onFileChange"
      />

      <!-- Icon State -->
      <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
        :class="fileName ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'"
      >
        <i v-if="fileName" class="fas fa-file-check text-2xl"></i>
        <i v-else class="fas fa-cloud-arrow-up text-2xl"></i>
      </div>

      <!-- Text State -->
      <div v-if="!fileName" class="space-y-1">
        <p class="text-sm font-semibold text-gray-800">
          <span class="text-blue-600 underline">Klik untuk mengunggah</span> atau seret file ke sini
        </p>
        <p class="text-xs text-gray-400">{{ hint }}</p>
      </div>

      <div v-else class="space-y-1">
        <p class="text-sm font-bold text-gray-800 flex items-center justify-center gap-2">
          <span>{{ fileName }}</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">{{ fileSize }}</span>
        </p>
        <p class="text-xs text-emerald-600 font-medium">Berkas siap disimpan</p>
      </div>
    </div>

    <!-- Existing File Hint or Action -->
    <div v-if="existingUrl && !fileName" class="flex items-center justify-between p-3 bg-blue-50/60 rounded-xl text-xs text-blue-800 border border-blue-100">
      <span class="flex items-center gap-2 font-medium">
        <i class="fas fa-link text-blue-600"></i> Berkas aktif saat ini telah terpasang
      </span>
      <a :href="existingUrl" target="_blank" class="font-bold underline text-blue-700 hover:text-blue-900 flex items-center gap-1">
        Lihat Dokumen <i class="fas fa-external-link-alt text-[10px]"></i>
      </a>
    </div>

    <!-- File Error -->
    <p v-if="fileError" class="text-xs text-red-500 font-medium flex items-center gap-1">
      <i class="fas fa-exclamation-circle"></i> {{ fileError }}
    </p>

    <!-- Reset file button -->
    <div v-if="fileName" class="flex justify-end">
      <button
        type="button"
        @click="removeFile"
        class="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
      >
        <i class="fas fa-times-circle"></i> Batalkan pilihan berkas
      </button>
    </div>
  </div>
</template>
