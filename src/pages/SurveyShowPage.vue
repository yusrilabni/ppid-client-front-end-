<template>
  <div class="survey-show-page bg-gray-50 min-h-screen pb-12">
    <div class="container mx-auto py-6 md:py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Breadcrumbs -->
        <nav class="flex mb-8 text-sm text-gray-500 font-medium">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <router-link to="/" class="inline-flex items-center hover:text-blue-600 transition-colors">
                <i class="fas fa-home mr-2"></i> Beranda
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <i class="fas fa-chevron-right text-gray-400 mx-2 text-xs"></i>
                <router-link to="/laporan/survei" class="text-gray-400 flex items-center hover:text-blue-600 transition-colors">
                  <i class="fas fa-poll mr-2"></i> Survei
                </router-link>
              </div>
            </li>
            <li v-if="survey">
              <div class="flex items-center">
                <i class="fas fa-chevron-right text-gray-400 mx-2 text-xs"></i>
                <span class="text-gray-500 font-semibold line-clamp-1 max-w-[200px]">{{ survey.title }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center">
          <i class="fas fa-spinner fa-spin text-blue-600 text-5xl mb-4"></i>
          <p class="text-gray-500">Memuat pertanyaan survei...</p>
        </div>

        <!-- Survey Content -->
        <div v-else-if="survey" class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div class="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
            <div class="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
              <i class="fas fa-poll-h text-9xl"></i>
            </div>
            
            <div class="relative z-10">
              <span v-if="survey.type === 'skm' || !survey.type" class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                SKM
              </span>
              <span v-else-if="survey.type === 'ppid'" class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                Survei PPID
              </span>
              
              <h1 class="text-3xl font-black mb-3">{{ survey.title }}</h1>
              <p class="text-blue-100 max-w-2xl text-sm leading-relaxed">{{ survey.description }}</p>
            </div>
          </div>

          <div v-if="!submitted" class="p-6 md:p-10">
            <!-- Progress Bar -->
            <div class="mb-10">
              <div class="flex justify-between items-end mb-2">
                <span class="text-sm font-bold text-gray-700">Progres Pengisian</span>
                <span class="text-sm font-bold text-blue-600">{{ progress }}%</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out" :style="{ width: progress + '%' }"></div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="submitError" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
              <i class="fas fa-exclamation-circle mt-0.5"></i>
              <div>
                <p class="font-bold">{{ submitError }}</p>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="submitSurvey" class="space-y-10">
              <div v-for="(section, index) in survey.sections" :key="section.id" class="survey-section">
                
                <!-- Section Header -->
                <div class="mb-6 md:mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 md:p-8 rounded-2xl border border-blue-100 shadow-md">
                  <div class="flex items-center mb-4 md:mb-6">
                    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center mr-4 md:mr-6 shadow-lg">
                      <i class="fas fa-list-alt text-white text-xl md:text-2xl"></i>
                    </div>
                    <div>
                      <h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-1 leading-tight">
                        {{ section.title }}
                      </h2>
                      <div class="flex items-center text-sm md:text-lg text-gray-700 font-medium">
                        <i class="fas fa-layer-group mr-2"></i>
                        <span>Bagian {{ index + 1 }} / {{ survey.sections.length }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="section.description" class="mt-4 description-box p-4 md:p-6 rounded-xl">
                    <div class="flex items-start">
                      <i class="fas fa-info-circle text-blue-500 text-lg md:text-2xl mr-3 mt-1"></i>
                      <div>
                        <p class="text-sm md:text-lg text-gray-700 leading-relaxed">{{ section.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Questions in Section -->
                <div class="space-y-6 md:space-y-10 pl-0 md:pl-10">
                  <div v-for="(question, qIndex) in getQuestionsBySection(section.id)" :key="question.id" class="question-card bg-white rounded-2xl border border-gray-100 p-5 md:p-8 shadow-md relative">
                    <div class="flex flex-col md:flex-row items-start">
                      
                      <!-- Question Number Badge -->
                      <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                          <span class="text-white font-bold text-lg md:text-xl">{{ qIndex + 1 }}</span>
                        </div>
                      </div>

                      <div class="flex-grow w-full min-w-0">
                        <div class="block mb-4 md:mb-6">
                          <div class="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3 w-full">
                            <div class="text-lg md:text-xl font-bold text-gray-900 leading-snug break-words flex-1 min-w-0">
                              {{ question.question_text }}
                            </div>
                            <span v-if="question.is_required" class="bg-red-50 text-red-600 text-xs md:text-sm font-black px-3 py-1 rounded-full border border-red-100 flex items-center justify-center w-max flex-shrink-0">
                              <i class="fas fa-exclamation-circle mr-1.5"></i>
                              WAJIB
                            </span>
                          </div>
                          
                          <div v-if="question.help_text" class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                            <div class="flex items-start">
                              <i class="fas fa-lightbulb text-yellow-500 text-base mr-2 mt-0.5 flex-shrink-0"></i>
                              <p class="text-xs md:text-sm text-gray-700 italic break-words flex-1 min-w-0">
                                {{ question.help_text }}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div class="mt-4 md:mt-6">
                          <!-- Text Input -->
                          <div v-if="question.type === 'text'">
                            <input type="text" v-model="answers[question.id]" @input="calculateProgress" :required="question.is_required" class="w-full px-4 py-3 md:px-5 md:py-4 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200" placeholder="Tulis jawaban...">
                          </div>

                          <!-- Textarea -->
                          <div v-else-if="question.type === 'textarea'">
                            <textarea v-model="answers[question.id]" @input="calculateProgress" :required="question.is_required" rows="4" class="w-full px-4 py-3 md:px-5 md:py-4 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200" placeholder="Tulis jawaban..."></textarea>
                          </div>

                          <!-- Radio -->
                          <div v-else-if="question.type === 'radio'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label v-for="option in question.options" :key="option.id" class="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-blue-50" :class="{ 'border-blue-500 bg-blue-50 ring-2 ring-blue-200': answers[question.id] === option.option_text, 'border-gray-200': answers[question.id] !== option.option_text }">
                              <div class="flex items-center h-6">
                                <input type="radio" :name="'question_' + question.id" :value="option.option_text" v-model="answers[question.id]" @change="calculateProgress" :required="question.is_required" class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500">
                              </div>
                              <div class="ml-3">
                                <span class="font-medium text-gray-700 text-base md:text-lg">{{ option.option_text }}</span>
                              </div>
                            </label>
                          </div>

                          <!-- Checkbox -->
                          <div v-else-if="question.type === 'checkbox'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label v-for="option in question.options" :key="option.id" class="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-blue-50" :class="{ 'border-blue-500 bg-blue-50 ring-2 ring-blue-200': Array.isArray(answers[question.id]) && answers[question.id].includes(option.option_text), 'border-gray-200': !Array.isArray(answers[question.id]) || !answers[question.id].includes(option.option_text) }">
                              <div class="flex items-center h-6">
                                <input type="checkbox" :value="option.option_text" v-model="answers[question.id]" @change="calculateProgress" class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                              </div>
                              <div class="ml-3">
                                <span class="font-medium text-gray-700 text-base md:text-lg">{{ option.option_text }}</span>
                              </div>
                            </label>
                          </div>

                          <!-- Select -->
                          <div v-else-if="question.type === 'select'">
                            <select v-model="answers[question.id]" @change="calculateProgress" :required="question.is_required" class="w-full px-4 py-3 md:px-5 md:py-4 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white">
                              <option value="" disabled>Pilih opsi...</option>
                              <option v-for="option in question.options" :key="option.id" :value="option.option_text">{{ option.option_text }}</option>
                            </select>
                          </div>

                          <!-- Rating/Scale -->
                          <div v-else-if="question.type === 'scale'" class="flex flex-wrap gap-2 md:gap-4">
                            <label v-for="n in 5" :key="n" class="cursor-pointer">
                              <input type="radio" :name="'question_' + question.id" :value="n" v-model="answers[question.id]" @change="calculateProgress" :required="question.is_required" class="hidden">
                              <div class="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold transition-all border-2" :class="{ 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-transparent shadow-lg transform scale-110': String(answers[question.id]) === String(n), 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:bg-blue-50': String(answers[question.id]) !== String(n) }">
                                {{ n }}
                              </div>
                            </label>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Submit Button -->
              <div class="pt-8 border-t border-gray-100 flex justify-end">
                <button type="submit" :disabled="submitting" class="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                  <span v-if="submitting"><i class="fas fa-spinner fa-spin"></i> Mengirim...</span>
                  <span v-else><i class="fas fa-paper-plane"></i> Kirim Jawaban</span>
                </button>
              </div>

            </form>
          </div>
          
          <div v-else class="p-16 text-center">
            <div class="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
              <i class="fas fa-check"></i>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-4">Terima Kasih!</h2>
            <p class="text-gray-600 mb-8 max-w-lg mx-auto">Jawaban Anda telah berhasil kami simpan. Partisipasi Anda sangat berarti bagi peningkatan kualitas layanan kami.</p>
            <router-link to="/laporan/survei" class="inline-block px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
              Kembali ke Daftar Survei
            </router-link>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
          <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p class="text-gray-500 mb-6">{{ submitError || 'Survei tidak ditemukan atau terjadi kesalahan saat memuat data.' }}</p>
          <router-link to="/laporan/survei" class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
            Kembali ke Daftar Survei
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const survey = ref(null)
const loading = ref(true)
const answers = ref({})
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')
const progress = ref(0)

onMounted(async () => {
  try {
    const res = await api.get(`/surveys/${route.params.slug}`)
    survey.value = res.data.data
    
    // Initialize answers array for checkboxes
    survey.value.questions.forEach(q => {
      if (q.type === 'checkbox') {
        answers.value[q.id] = []
      } else {
        answers.value[q.id] = ''
      }
    })
    
  } catch (error) {
    console.error('Error fetching survey details:', error)
    if (error.response?.status === 404) {
      submitError.value = "Survei tidak ditemukan atau tidak aktif."
    } else {
      submitError.value = "Terjadi kesalahan saat memuat survei."
    }
  } finally {
    loading.value = false
  }
})

const getQuestionsBySection = (sectionId) => {
  if (!survey.value || !survey.value.questions) return []
  return survey.value.questions.filter(q => q.section_id === sectionId)
}

const calculateProgress = () => {
  if (!survey.value || !survey.value.questions) return
  
  let answered = 0
  const total = survey.value.questions.length
  
  survey.value.questions.forEach(q => {
    const ans = answers.value[q.id]
    if (q.type === 'checkbox') {
      if (Array.isArray(ans) && ans.length > 0) answered++
    } else {
      if (ans !== '' && ans !== null && ans !== undefined) answered++
    }
  })
  
  progress.value = total > 0 ? Math.round((answered / total) * 100) : 0
}

const submitSurvey = async () => {
  submitError.value = ''
  submitting.value = true
  
  try {
    await api.post(`/surveys/${route.params.slug}/submit`, {
      answers: answers.value
    })
    submitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('Error submitting survey:', error)
    if (error.response?.status === 429) {
      submitError.value = 'Anda sudah mengisi survei ini dalam 24 jam terakhir.'
    } else if (error.response?.data?.message) {
      submitError.value = error.response.data.message
    } else {
      submitError.value = 'Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    submitting.value = false
  }
}
</script>
