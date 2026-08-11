<template>
  <div class="relative w-full">
    <input 
      type="date" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full pl-4 pr-10 py-2.5 text-xs bg-transparent focus:outline-none font-bold text-gray-600 rounded-2xl transition-all hover:bg-gray-50/50 focus:bg-white focus:shadow-sm focus:ring-2 focus:ring-blue-500/20 custom-date-input"
    />
    <i class="far fa-calendar-alt absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[12px]"></i>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.custom-date-input {
  appearance: none;
  -webkit-appearance: none;
}
.custom-date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 10;
}
.custom-date-input::-webkit-datetime-edit {
  color: inherit;
}
.custom-date-input::-webkit-datetime-edit-fields-wrapper {
  color: inherit;
}
</style>
