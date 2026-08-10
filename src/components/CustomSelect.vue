<template>
  <div class="relative" ref="dropdownRef" :class="isOpen ? 'z-[100]' : 'z-10'">
    <!-- Trigger Button -->
    <button 
      type="button" 
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between px-4 py-2.5 text-xs bg-transparent focus:outline-none font-bold text-gray-600 rounded-2xl transition-all"
      :class="isOpen ? 'bg-white shadow-sm ring-2 ring-blue-500/20' : 'hover:bg-gray-50/50'"
    >
      <span class="truncate pr-4">{{ selectedLabel }}</span>
      <i class="fas fa-chevron-down text-[10px] text-gray-400 transition-transform duration-300" :class="{ 'rotate-180': isOpen }"></i>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isOpen" class="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <!-- Search Input -->
        <div v-if="searchable" class="p-2 border-b border-gray-50 bg-gray-50/50">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="w-full pl-8 pr-3 py-2 text-xs border-none bg-white rounded-xl focus:ring-2 focus:ring-blue-500/20 font-medium"
              :placeholder="searchPlaceholder"
              @click.stop
            />
          </div>
        </div>
        
        <!-- Options List -->
        <ul class="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-xs text-gray-500 text-center italic">
            Pencarian tidak ditemukan
          </li>
          <li 
            v-for="option in filteredOptions" 
            :key="option[valueKey]"
            @click="selectOption(option)"
            class="px-4 py-2.5 text-xs cursor-pointer transition-colors flex items-center justify-between group"
            :class="modelValue === option[valueKey] ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 font-medium hover:bg-gray-50'"
          >
            <span class="truncate mr-2">{{ option[labelKey] }}</span>
            <i v-if="modelValue === option[valueKey]" class="fas fa-check text-blue-500 text-[10px]"></i>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Pilih opsi...'
  },
  searchPlaceholder: {
    type: String,
    default: 'Cari...'
  },
  searchable: {
    type: Boolean,
    default: true
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt[props.valueKey] == props.modelValue)
  return selected ? selected[props.labelKey] : props.placeholder
})

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) return props.options
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt => {
    const label = String(opt[props.labelKey]).toLowerCase()
    return label.includes(query)
  })
})

const selectOption = (option) => {
  emit('update:modelValue', option[props.valueKey])
  emit('change', option[props.valueKey])
  isOpen.value = false
  searchQuery.value = ''
}

// Click outside to close
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Reset search when dropdown closes
watch(isOpen, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      searchQuery.value = ''
    }, 200) // wait for animation
  }
})
</script>
