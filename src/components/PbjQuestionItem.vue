<template>
  <div :class="['border-l-2 md:border-l-4 border-gray-100 pl-4 md:pl-8 py-3 mt-4 transition-all hover:border-blue-100', level > 1 ? 'ml-2 md:ml-8' : '']">
    <div class="flex items-start">
        <span class="text-sm md:text-base font-bold text-gray-400 mr-2 md:mr-3 mt-0.5">
            {{ formatIndex(index, level) }}
        </span>
        
        <div class="flex-1">
            <a v-if="hasLink(question)" :href="getLink(question)" class="text-sm md:text-base font-bold text-blue-600 hover:text-blue-800 leading-snug block transition-colors">
                {{ question.question }}
                <i class="fas fa-external-link-alt ml-2 text-[10px] opacity-50"></i>
            </a>
            <p v-else class="text-sm md:text-base font-medium text-gray-700 leading-snug">
                {{ question.question }}
            </p>
        </div>
    </div>

    <div v-if="question.children && question.children.length > 0" class="mt-2">
        <PbjQuestionItem 
            v-for="(child, childIndex) in question.children" 
            :key="child.id" 
            :question="child"
            :index="childIndex"
            :level="level + 1"
        />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    default: 1
  }
})

const formatIndex = (idx, lvl) => {
    if (lvl === 1) {
        // level 1 => a, b, c, d
        return String.fromCharCode(97 + idx) + '.'
    } else {
        // level > 1 => 1), 2), 3)
        return (idx + 1) + ').'
    }
}

const hasLink = (question) => {
    return !!(question.answer?.informasi?.slug || question.answer?.document_url || question.answer?.informasi?.url)
}

const getLink = (question) => {
    if (question.answer?.informasi?.slug) {
        return `/informasi/${question.answer.informasi.slug}`
    }
    if (question.answer?.document_url) {
        return question.answer.document_url
    }
    if (question.answer?.informasi?.url) {
        return question.answer.informasi.url
    }
    return '#'
}
</script>
