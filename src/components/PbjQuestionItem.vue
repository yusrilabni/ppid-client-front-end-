<template>
  <div class="pbj-item group relative">
    <!-- Connecting Line for Children -->
    <div v-if="level > 0" class="absolute left-0 top-0 bottom-0 w-px bg-blue-100 group-last:bottom-auto group-last:h-full"></div>
    <div v-if="level > 0" class="absolute left-0 top-7 w-6 h-px bg-blue-100"></div>

    <div :class="['flex flex-col md:flex-row md:items-start gap-4 transition-all duration-300', level > 0 ? 'ml-8' : '']">
      
      <!-- Number or Bullet -->
      <div class="flex-shrink-0 mt-1">
        <div v-if="level === 0" class="w-10 h-10 bg-blue-50 text-blue-700 font-black rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
          {{ index }}
        </div>
        <div v-else class="w-6 h-6 bg-gray-50 text-gray-500 font-bold text-xs rounded-full flex items-center justify-center border border-gray-200 mt-1">
          {{ index }}
        </div>
      </div>

      <!-- Question and Answer Content -->
      <div class="flex-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
        <h4 :class="['font-bold text-gray-800 leading-relaxed mb-3', level === 0 ? 'text-lg' : 'text-base']">
          {{ question.question }}
        </h4>

        <!-- Answer / Document Link -->
        <div v-if="question.answer" class="mt-4 pt-4 border-t border-gray-50">
          <a v-if="question.answer.document_url || question.answer.informasi?.url || question.answer.informasi?.file_url" 
             :href="getDocumentUrl(question.answer)" 
             target="_blank"
             class="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-xl text-sm font-bold transition-colors border border-green-100 group/btn">
            <i class="fas fa-file-alt mr-2 text-green-500 group-hover/btn:text-white"></i>
            Lihat Dokumen
            <i class="fas fa-arrow-right ml-2 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-transform"></i>
          </a>
          <div v-else class="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-sm font-medium border border-gray-100">
            <i class="fas fa-times-circle mr-2 text-gray-400"></i>
            Dokumen belum tersedia
          </div>
        </div>
        <div v-else-if="question.children.length === 0" class="mt-4 pt-4 border-t border-gray-50">
          <div class="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-sm font-medium border border-gray-100">
            <i class="fas fa-clock mr-2 text-gray-400"></i>
            Belum dijawab
          </div>
        </div>
      </div>
    </div>

    <!-- Recursive Children -->
    <div v-if="question.children && question.children.length > 0" class="mt-4 space-y-4">
      <PbjQuestionItem 
        v-for="(child, childIndex) in question.children" 
        :key="child.id" 
        :question="child"
        :index="String.fromCharCode(97 + childIndex)"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  index: {
    type: [Number, String],
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
})

const getDocumentUrl = (answer) => {
  if (answer.document_url) {
    return answer.document_url
  }
  if (answer.informasi?.url) {
    return answer.informasi.url
  }
  if (answer.informasi?.file_url) {
    return `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/storage/${answer.informasi.file_url}`
  }
  return '#'
}
</script>
