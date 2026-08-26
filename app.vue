<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const capitalize = (str) => {
  if (!str) return ''
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const pageTitle = computed(() => {
  if (route.path === '/') return 'Pejabat Pengelola Informasi dan Dokumentasi'
  
  const paths = route.path.split('/').filter(Boolean)
  if (paths.length === 0) return 'Pejabat Pengelola Informasi dan Dokumentasi'
  
  const titleParts = paths.map(p => capitalize(p))
  
  // Custom replacements for abbreviations
  const formattedParts = titleParts.map(part => {
    if (part.toLowerCase() === 'ppid') return 'PPID'
    if (part.toLowerCase() === 'pbj') return 'PBJ'
    if (part.toLowerCase() === 'dip') return 'DIP'
    if (part.toLowerCase() === 'lhkpn') return 'LHKPN'
    if (part.toLowerCase() === 'opd') return 'OPD'
    if (part.toLowerCase() === 'dipunit') return 'DIP Unit'
    return part
  })

  return 'PPID - ' + formattedParts.join(' - ')
})

useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: 'Transparansi Informasi Publik' },
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:description', content: 'Transparansi Informasi Publik' },
    { name: 'twitter:title', content: pageTitle.value },
    { name: 'twitter:description', content: 'Transparansi Informasi Publik' }
  ]
}))
</script>
