<script setup>
defineProps({
  type: { type: String, default: 'card' }, // card, text, image, list
  count: { type: Number, default: 1 }
})
</script>

<template>
  <div v-for="i in count" :key="i" class="animate-pulse">
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="h-48 bg-gray-200 w-full"></div>
      <div class="p-5 space-y-4">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="space-y-2">
          <div class="h-3 bg-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div class="flex justify-between items-center pt-2">
          <div class="h-8 bg-gray-200 rounded-lg w-24"></div>
          <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="space-y-3">
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-full"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>

    <!-- Image Skeleton -->
    <div v-else-if="type === 'image'" class="bg-gray-200 rounded-2xl w-full h-full min-h-[200px] flex items-center justify-center">
      <i class="fas fa-image text-4xl text-gray-300"></i>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" class="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0">
      <div class="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>
      <div class="flex-1 space-y-2 py-1">
        <div class="h-5 bg-gray-200 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
</template>
