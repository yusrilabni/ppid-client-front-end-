<template>
  <div :class="[colors.wrapperHoverBorder, 'group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col h-full border border-gray-100 transform hover:-translate-y-2']">
      <div class="p-8 flex-grow flex flex-col">
          <div class="flex items-center justify-center mb-6">
              <div :class="[colors.iconBg, colors.iconBgHover, 'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300']">
                  <i :class="['fas', icon, colors.iconText, 'group-hover:text-white text-3xl transition-colors duration-300']"></i>
              </div>
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-3 text-center leading-tight">{{ unit.name }}</h2>
          <div class="flex items-start text-gray-500 mb-6 text-center justify-center text-sm">
              <i class="fas fa-map-marker-alt text-blue-500 mr-2 mt-0.5"></i>
              <p class="flex-grow line-clamp-2" v-html="unit.address || 'Alamat belum ditambahkan.'"></p>
          </div>
          
          <div class="mt-auto space-y-3">
              <template v-if="unit.slug">
                  <NuxtLink :to="`/dipunit/dip/${unit.slug}`" :class="[colors.btnBg, colors.btnBgHover, colors.btnShadow, colors.btnShadowHover, 'inline-flex items-center justify-center text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 w-full shadow-lg']">
                      <i class="fas fa-file-alt mr-2"></i> Lihat Daftar Informasi Publik
                  </NuxtLink>
              </template>
              <template v-else>
                  <span class="inline-flex items-center justify-center bg-gray-100 text-gray-400 font-bold py-3 px-6 rounded-xl w-full cursor-not-allowed italic">
                      Belum Terdaftar
                  </span>
              </template>
              
              <template v-if="unit.website_url">
                  <a :href="unit.website_url" target="_blank" class="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 w-full border border-gray-100">
                      <i class="fas fa-globe mr-2 text-blue-500"></i> Website Resmi
                  </a>
              </template>
          </div>
      </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  unit: {
    type: Object,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
})

const colors = computed(() => {
  const map = {
    blue: {
      wrapperHoverBorder: 'hover:border-blue-100',
      iconBg: 'bg-blue-50',
      iconBgHover: 'group-hover:bg-blue-600',
      iconText: 'text-blue-600',
      btnBg: 'bg-blue-600',
      btnBgHover: 'hover:bg-blue-700',
      btnShadow: 'shadow-blue-100',
      btnShadowHover: 'hover:shadow-blue-200'
    },
    indigo: {
      wrapperHoverBorder: 'hover:border-indigo-100',
      iconBg: 'bg-indigo-50',
      iconBgHover: 'group-hover:bg-indigo-600',
      iconText: 'text-indigo-600',
      btnBg: 'bg-indigo-600',
      btnBgHover: 'hover:bg-indigo-700',
      btnShadow: 'shadow-indigo-100',
      btnShadowHover: 'hover:shadow-indigo-200'
    }
  }
  return map[props.color] || map.blue
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

