<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'fas fa-file-alt' },
  breadcrumbs: { type: Array, default: () => [] } // [{ label: 'Home', to: { name: 'home' } }]
})
</script>

<template>
  <div class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 lg:py-20 overflow-hidden">
    <!-- Abstract Background Patterns -->
    <div class="absolute inset-0 opacity-10">
      <svg class="absolute right-0 top-0 h-full w-1/2 transform translate-x-1/3" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="0,100 100,0 100,100" fill="currentColor"/>
      </svg>
      <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 lg:px-8 relative z-10">
      <div class="max-w-4xl">
        <!-- Breadcrumbs -->
        <nav v-if="breadcrumbs && breadcrumbs.length" class="flex items-center gap-2 text-sm font-medium text-blue-200 mb-6">
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <NuxtLink 
              v-if="crumb.to" 
              :to="crumb.to"
              class="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <i v-if="index === 0" class="fas fa-home text-xs"></i>
              {{ crumb.label }}
            </NuxtLink>
            <span v-else class="text-white">{{ crumb.label }}</span>
            
            <i v-if="index < breadcrumbs.length - 1" class="fas fa-chevron-right text-[10px] text-blue-400/60"></i>
          </template>
        </nav>

        <div class="flex items-start gap-6">
          <div v-if="icon" class="hidden sm:flex w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center flex-shrink-0 shadow-xl">
            <i :class="icon" class="text-3xl text-white"></i>
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {{ title }}
            </h1>
            <p v-if="subtitle" class="text-lg text-blue-100 max-w-2xl leading-relaxed">
              {{ subtitle }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Wave Decorator -->
    <div class="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
      <svg class="relative block w-full h-[30px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.5,193,109.1,236.46,101.81,279.7,80.12,321.39,56.44Z" fill="#f9fafb"></path>
      </svg>
    </div>
  </div>
</template>

