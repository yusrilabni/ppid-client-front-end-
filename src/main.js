import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh longer
        gcTime: 1000 * 60 * 30,   // 30 minutes - keep inactive data in cache
        refetchOnWindowFocus: false, // CRITICAL: prevent blank screen on tab switch
        retry: 2,                    // Auto-retry failed requests
        keepPreviousData: true,      // Keep showing old data during refetch
      },
    },
  },
})
app.mount('#app')
