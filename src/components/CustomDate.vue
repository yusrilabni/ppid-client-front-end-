<template>
  <div class="relative w-full" ref="calendarRef" :class="isOpen ? 'z-[100]' : 'z-10'">
    <!-- Input Trigger -->
    <div 
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between pl-4 pr-10 py-2.5 text-xs bg-transparent focus:outline-none font-bold text-gray-600 rounded-2xl transition-all cursor-pointer border-none"
      :class="isOpen ? 'bg-white shadow-sm ring-2 ring-blue-500/20' : 'hover:bg-gray-50/50'"
    >
      <span :class="modelValue ? 'text-gray-700' : 'text-gray-400'">
        {{ formattedDate || placeholder }}
      </span>
    </div>
    
    <i 
      class="far fa-calendar-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300"
      :class="{ 'text-blue-500': isOpen }"
    ></i>

    <!-- Dropdown Calendar -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isOpen" class="absolute z-[100] mt-2 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 w-[280px] right-0 md:left-0">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <button @click.prevent="changeMonth(-1)" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">
            <i class="fas fa-chevron-left text-xs"></i>
          </button>
          <div class="font-bold text-sm text-gray-800">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>
          <button @click.prevent="changeMonth(1)" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>

        <!-- Days of Week -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" :key="day" class="text-center text-[10px] font-bold text-gray-400">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Empty spots for previous month -->
          <div v-for="empty in emptyDays" :key="'empty-'+empty" class="w-8 h-8"></div>
          
          <!-- Days -->
          <button 
            v-for="day in daysInMonth" 
            :key="day"
            @click="selectDate(day)"
            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all hover:bg-blue-50 hover:text-blue-600"
            :class="[
              isSelected(day) ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:text-white' : 'text-gray-700',
              isToday(day) && !isSelected(day) ? 'border border-blue-500 text-blue-600' : ''
            ]"
          >
            {{ day }}
          </button>
        </div>

        <!-- Action / Reset -->
        <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <button @click="clearDate" class="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
            Reset
          </button>
          <button @click="isOpen = false" class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Pilih tanggal...'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const calendarRef = ref(null)

// Current view state
const currentDate = new Date()
const currentMonth = ref(currentDate.getMonth())
const currentYear = ref(currentDate.getFullYear())

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

// Initialize view to modelValue if it exists
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const d = new Date(newVal)
    if (!isNaN(d.getTime())) {
      currentMonth.value = d.getMonth()
      currentYear.value = d.getFullYear()
    }
  }
}, { immediate: true })

const formattedDate = computed(() => {
  if (!props.modelValue) return ''
  const d = new Date(props.modelValue)
  if (isNaN(d.getTime())) return ''
  
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  
  return `${day}/${month}/${year}` // European/Indonesian format DD/MM/YYYY
})

// Calendar Logic
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const emptyDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return firstDay // 0 is Sunday, which matches our grid starting with 'Min'
})

const changeMonth = (delta) => {
  let newMonth = currentMonth.value + delta
  let newYear = currentYear.value
  
  if (newMonth > 11) {
    newMonth = 0
    newYear++
  } else if (newMonth < 0) {
    newMonth = 11
    newYear--
  }
  
  currentMonth.value = newMonth
  currentYear.value = newYear
}

const selectDate = (day) => {
  const year = currentYear.value
  const month = String(currentMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  
  emit('update:modelValue', `${year}-${month}-${d}`) // standard YYYY-MM-DD
  isOpen.value = false
}

const clearDate = () => {
  emit('update:modelValue', '')
  isOpen.value = false
}

const isSelected = (day) => {
  if (!props.modelValue) return false
  const [y, m, d] = props.modelValue.split('-')
  return parseInt(y) === currentYear.value && 
         parseInt(m) === currentMonth.value + 1 && 
         parseInt(d) === day
}

const isToday = (day) => {
  const today = new Date()
  return today.getDate() === day && 
         today.getMonth() === currentMonth.value && 
         today.getFullYear() === currentYear.value
}

// Click outside to close
const handleClickOutside = (event) => {
  if (calendarRef.value && !calendarRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
