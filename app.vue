<template>
  <LoadingScreen />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import LoadingScreen from '@/components/LoadingScreen.vue'

const route = useRoute()

const capitalize = (str) => {
  if (!str) return ''
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const rawPageName = computed(() => {
  if (route.path === '/') return 'Beranda'
  const paths = route.path.split('/').filter(Boolean)
  if (paths.length === 0) return 'Beranda'
  
  const titleParts = paths.map(p => capitalize(p))
  const formattedParts = titleParts.map(part => {
    if (part.toLowerCase() === 'ppid') return 'PPID'
    if (part.toLowerCase() === 'pbj') return 'PBJ'
    if (part.toLowerCase() === 'dip') return 'DIP'
    if (part.toLowerCase() === 'lhkpn') return 'LHKPN'
    if (part.toLowerCase() === 'opd') return 'OPD'
    if (part.toLowerCase() === 'dipunit') return 'DIP Unit'
    return part
  })
  return formattedParts.join(' - ')
})

const pageTitle = computed(() => {
  return 'PPID - ' + rawPageName.value
})

const pageDescription = computed(() => {
  const baseDesc = 'Pejabat Pengelola Informasi dan Dokumentasi Kabupaten Sinjai - Transparansi Informasi Publik'
  return `${rawPageName.value} - ${baseDesc}`
})

useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: pageDescription.value },
    { property: 'og:title', content: pageTitle.value },
    { property: 'og:description', content: pageDescription.value },
    { name: 'twitter:title', content: pageTitle.value },
    { name: 'twitter:description', content: pageDescription.value }
  ]
}))
</script>
