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
        staleTime: 60000,
        refetchOnWindowFocus: true,
      },
    },
  },
})
app.mount('#app')
