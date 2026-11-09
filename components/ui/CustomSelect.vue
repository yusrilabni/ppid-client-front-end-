<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: [String, Number, null],
  options: {
    type: Array,
    default: () => [] // [{ value, label, description, badge, icon }]
  },
  placeholder: {
    type: String,
    default: 'Pilih opsi...'
  },
  searchable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: String,
  icon: String
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const search = ref('')
const selectRef = ref(null)

const selectedOption = computed(() => {
  return props.options.find(o => String(o.value) === String(props.modelValue))
})

const filteredOptions = computed(() => {
  if (!search.value.trim()) return props.options
  const q = search.value.toLowerCase()
  return props.options.filter(o => {
    const l = String(o.label || '').toLowerCase()
    const d = String(o.description || '').toLowerCase()
    return l.includes(q) || d.includes(q)
  })
})

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    search.value = ''
  }
}

function selectOption(opt) {
  emit('update:modelValue', opt.value)
  emit('change', opt)
  isOpen.value = false
}

function closeOnClickOutside(e) {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>

<template>
  <div ref="selectRef" class="relative w-full text-left">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      class="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border rounded-xl shadow-sm transition-all duration-200 outline-none"
      :class="[
        disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100',
        error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200',
        isOpen ? 'border-blue-500 ring-4 ring-blue-50' : ''
      ]"
    >
      <div class="flex items-center gap-2.5 truncate">
        <i v-if="icon || selectedOption?.icon" :class="[selectedOption?.icon || icon, 'text-blue-500 text-sm']"></i>
        <div v-if="selectedOption" class="flex flex-col truncate">
          <span class="text-sm font-semibold text-gray-800 truncate">{{ selectedOption.label }}</span>
          <span v-if="selectedOption.description" class="text-xs text-gray-400 truncate">{{ selectedOption.description }}</span>
        </div>
        <span v-else class="text-sm text-gray-400">{{ placeholder }}</span>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <span v-if="selectedOption?.badge" class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-600">
          {{ selectedOption.badge }}
        </span>
        <i class="fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200" :class="{ 'rotate-180 text-blue-600': isOpen }"></i>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-xl transition-all duration-200 animate-fadeIn"
    >
      <!-- Search Box inside dropdown -->
      <div v-if="searchable" class="p-3 border-b border-gray-100 bg-gray-50/50">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Ketik untuk mencari..."
            class="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            @click.stop
          />
        </div>
      </div>

      <!-- Option Items -->
      <div class="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
        <div
          v-if="filteredOptions.length === 0"
          class="py-4 text-center text-xs text-gray-400 italic"
        >
          Tidak ada opsi yang cocok
        </div>

        <button
          v-for="opt in filteredOptions"
          :key="opt.value"
          type="button"
          @click="selectOption(opt)"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors duration-150 group"
          :class="[
            String(opt.value) === String(modelValue)
              ? 'bg-blue-50/80 text-blue-900 font-semibold'
              : 'hover:bg-gray-50 text-gray-700'
          ]"
        >
          <div class="flex items-center gap-2.5 truncate">
            <i v-if="opt.icon" :class="[opt.icon, 'text-xs text-gray-400 group-hover:text-blue-500']"></i>
            <div class="truncate">
              <div class="text-sm font-medium leading-snug truncate">{{ opt.label }}</div>
              <div v-if="opt.description" class="text-xs text-gray-400 line-clamp-1">{{ opt.description }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <span v-if="opt.badge" class="px-2 py-0.5 text-[10px] font-semibold rounded bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700">
              {{ opt.badge }}
            </span>
            <i v-if="String(opt.value) === String(modelValue)" class="fas fa-check text-xs text-blue-600"></i>
          </div>
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
