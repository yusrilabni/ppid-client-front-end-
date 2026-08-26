import { defineNuxtPlugin } from '#app'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 60 * 24,
        refetchOnWindowFocus: false,
        retry: 1,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  })

  // Only run this on the client
  if (process.client) {
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
    })

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
      maxAge: 1000 * 60 * 60 * 24,
    })
  }

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})
