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
        <div v-else-if="survey" class="bg-transparent">
          <!-- Form Section -->
          <div v-if="!submitted" class="bg-white shadow-xl rounded-2xl border border-gray-100">
            <div class="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative rounded-t-2xl overflow-hidden">
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

            <div class="p-6 md:p-10">
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
              <div v-for="(page, index) in pages" :key="page.id" class="survey-section" v-show="currentStep === index + 1">
                
                <!-- Section Header -->
                <div class="mb-6 md:mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 md:p-8 rounded-2xl border border-blue-100 shadow-md">
                  <div class="flex items-center mb-4 md:mb-6">
                    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center mr-4 md:mr-6 shadow-lg">
                      <i :class="page.icon + ' text-white text-xl md:text-2xl'"></i>
                    </div>
                    <div>
                      <h2 class="text-xl md:text-3xl font-bold text-gray-900 mb-1 leading-tight">
                        {{ page.id === 'general' ? (survey.title.length > 40 ? survey.title.substring(0,40) + '...' : survey.title) : page.title }}
                      </h2>
                      <div class="flex items-center text-sm md:text-lg text-gray-700 font-medium">
                        <i class="fas fa-layer-group mr-2"></i>
                        <span>Bagian {{ index + 1 }} / {{ pages.length }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="(page.id === 'general' && survey.description) || (page.id !== 'general' && page.description)" class="mt-4 description-box p-4 md:p-6 rounded-xl border-l-4 border-blue-500 bg-gradient-to-r from-slate-50 to-slate-100">
                    <div class="flex items-start">
                      <i class="fas fa-info-circle text-blue-500 text-lg md:text-2xl mr-3 mt-1"></i>
                      <div>
                        <p class="text-sm md:text-lg text-gray-700 leading-relaxed">{{ page.id === 'general' ? survey.description : page.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Questions in Section -->
                <div class="space-y-6 md:space-y-10 pl-0 md:pl-10">
                  <div v-for="(question, qIndex) in page.questions" :key="question.id" class="question-card bg-white rounded-2xl border border-gray-100 p-5 md:p-8 shadow-md relative" :style="{ zIndex: 50 - qIndex }">
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
                          <div v-if="['Isian Singkat', 'Email', 'Numeric', 'Url'].includes(question.question_type)">
                            <input :type="question.question_type === 'Email' ? 'email' : (question.question_type === 'Numeric' ? 'number' : (question.question_type === 'Url' ? 'url' : 'text'))" v-model="answers[question.id]" @input="calculateProgress" :required="question.is_required" class="w-full px-4 py-3 md:px-5 md:py-4 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200" placeholder="Tulis jawaban..." />
                          </div>

                          <!-- Textarea -->
                          <div v-else-if="question.question_type === 'Isian Panjang'">
                            <textarea v-model="answers[question.id]" @input="calculateProgress" :required="question.is_required" rows="4" class="w-full px-4 py-3 md:px-5 md:py-4 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200" placeholder="Tulis jawaban..."></textarea>
                          </div>

                          <!-- Dropdown & Pilihan Ganda -->
                          <div v-else-if="['Dropdown', 'Pilihan Ganda', 'Pilihan Ganda (Berbobot)'].includes(question.question_type)">
                            <div class="border-2 border-gray-200 rounded-xl bg-white p-1 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200">
                              <CustomSelect 
                                v-model="answers[question.id]" 
                                :options="question.options" 
                                labelKey="option_text" 
                                valueKey="option_text" 
                                placeholder="Pilih opsi..."
                                :searchable="question.options.length > 5"
                                @change="calculateProgress" 
                              />
                            </div>
                          </div>

                          <!-- Checkbox -->
                          <div v-else-if="question.question_type === 'Checkbox'" class="grid grid-cols-1 gap-3">
                            <label v-for="option in question.options" :key="option.id" class="flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-blue-50" :class="{ 'border-blue-500 bg-blue-50 ring-2 ring-blue-200': Array.isArray(answers[question.id]) && answers[question.id].includes(option.option_text), 'border-gray-200': !Array.isArray(answers[question.id]) || !answers[question.id].includes(option.option_text) }">
                              <div class="flex items-center h-6">
                                <input type="checkbox" :value="option.option_text" v-model="answers[question.id]" @change="calculateProgress" class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                              </div>
                              <div class="ml-3">
                                <span class="font-medium text-gray-700 text-base md:text-lg">{{ option.option_text }}</span>
                              </div>
                            </label>
                          </div>

                          <!-- Rating/Scale -->
                          <div v-else-if="question.question_type === 'Skala Kepuasan'" class="flex flex-wrap gap-2 md:gap-4 justify-center py-4 bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-2xl border-2 border-gray-50">
                            <label v-for="n in 5" :key="n" class="cursor-pointer">
                              <input type="radio" :name="'question_' + question.id" :value="n" v-model="answers[question.id]" @change="calculateProgress" :required="question.is_required" class="hidden" />
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

              <!-- Navigation & Submit Button -->
              <div class="pt-8 border-t border-gray-100 flex justify-between items-center">
                <button type="button" @click="prevStep" v-if="currentStep > 1" class="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <i class="fas fa-chevron-left"></i> Sebelumnya
                </button>
                <div v-else></div> <!-- Spacer -->

                <button type="button" @click="nextStep" v-if="currentStep < pages.length" class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md">
                  Selanjutnya <i class="fas fa-chevron-right"></i>
                </button>
                
                <button v-if="currentStep === pages.length" type="submit" :disabled="submitting" class="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-md">
                  <span v-if="submitting"><i class="fas fa-spinner fa-spin"></i> Mengirim...</span>
                  <span v-else><i class="fas fa-paper-plane"></i> Kirim Jawaban</span>
                </button>
              </div>

            </form>
          </div>
          
          <div v-else class="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
            <div class="max-w-lg w-full mx-auto">
                <div class="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                    <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
                        <div class="relative w-24 h-24 mx-auto mb-4">
                            <div class="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <i class="fas fa-check-circle text-white text-5xl transform transition-all duration-500 hover:scale-110"></i>
                            </div>
                        </div>
                        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-2 animate-fade-in-down">Terima Kasih!</h2>
                        <p class="text-green-100 text-lg font-medium">Partisipasi Anda sangat berharga</p>
                    </div>

                    <div class="p-8 text-center">
                        <div class="mb-8">
                            <p class="text-gray-700 text-lg mb-4 leading-relaxed">
                                <i class="fas fa-clipboard-check text-green-500 mr-2"></i>
                                Jawaban Anda telah berhasil kami rekam dan akan kami proses dengan seksama.
                            </p>
                            <p class="text-gray-600 mb-6">
                                Kontribusi Anda membantu kami dalam meningkatkan kualitas layanan dan penelitian kami.
                            </p>

                            <div class="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-100">
                                <div class="flex items-center justify-center text-blue-700">
                                    <i class="fas fa-lock text-xl mr-3"></i>
                                    <p class="font-medium">Data Anda aman dan rahasia</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-8">
                            <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                <i class="fas fa-check text-blue-500 text-2xl mb-2"></i>
                                <p class="text-sm text-gray-600">Status</p>
                                <p class="text-lg font-bold text-gray-800">Selesai</p>
                            </div>
                            <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                <i class="fas fa-shield-alt text-green-500 text-2xl mb-2"></i>
                                <p class="text-sm text-gray-600">Keamanan</p>
                                <p class="text-lg font-bold text-gray-800">Terjamin</p>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <router-link to="/laporan/survei" class="w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                <i class="fas fa-home mr-3"></i>
                                Kembali ke Daftar Survei
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CustomSelect from '@/components/CustomSelect.vue'
import api from '@/services/api'

const route = useRoute()
const survey = ref(null)
const loading = ref(true)
const answers = ref({})
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')
const progress = ref(0)
const currentStep = ref(1)

const pages = computed(() => {
  if (!survey.value) return []
  
  const p = []
  
  // 1. General Questions (No Section)
  const generalQuestions = survey.value.questions.filter(q => q.section_id === null || q.section_id === undefined)
  if (generalQuestions.length > 0) {
    p.push({
      id: 'general',
      title: 'Umum',
      description: null,
      questions: generalQuestions.sort((a, b) => a.order - b.order),
      icon: 'fas fa-list-alt'
    })
  }
  
  // 2. Sections
  if (survey.value.sections) {
    const sections = [...survey.value.sections].sort((a, b) => a.order - b.order)
    sections.forEach(section => {
      const sectionQuestions = survey.value.questions.filter(q => q.section_id === section.id).sort((a, b) => a.order - b.order)
      p.push({
        id: 'section_' + section.id,
        title: section.title,
        description: section.description,
        questions: sectionQuestions,
        icon: 'fas fa-folder'
      })
    })
  }
  
  // If empty
  if (p.length === 0) {
    p.push({
      id: 'empty',
      title: survey.value.title,
      description: survey.value.description,
      questions: [],
      icon: 'fas fa-poll'
    })
  }
  
  return p
})

const nextStep = () => {
  if (pages.value && currentStep.value < pages.value.length) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  try {
    const res = await api.get(`/surveys/${route.params.slug}`)
    survey.value = res.data.data
    
    // Initialize answers array for checkboxes
    survey.value.questions.forEach(q => {
      if (q.question_type === 'Checkbox') {
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
    if (q.question_type === 'Checkbox') {
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
