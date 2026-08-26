<template>
  <div class="relative w-full">
    <i 
      v-if="icon" 
      :class="[icon, 'absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[12px]']"
    ></i>
    <input 
      :type="type" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :class="[
        'w-full py-2.5 text-xs bg-transparent focus:outline-none font-bold text-gray-600 rounded-2xl transition-all hover:bg-gray-50/50 focus:bg-white focus:shadow-sm focus:ring-2 focus:ring-blue-500/20 custom-input',
        icon ? 'pl-10 pr-4' : 'px-4'
      ]"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  icon: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.custom-input {
  /* Ensure consistent appearance */
}
</style>

