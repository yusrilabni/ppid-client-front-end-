import type { RouterConfig } from 'nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // If browser back/forward button is pressed, restore exact previous position
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition)
        }, 50)
      })
    }

    // If anchor hash is present, scroll smoothly to target with navbar offset
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            top: 80,
            behavior: 'smooth'
          })
        }, 100)
      })
    }

    // If navigating to a different page, scroll smoothly to top
    if (to.path !== from.path) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0, left: 0, behavior: 'smooth' })
        }, 50)
      })
    }

    return false
  }
}
