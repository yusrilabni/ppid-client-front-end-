import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  // Only execute in browser client
  if (typeof window === 'undefined') return

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (prefersReducedMotion) {
    return
  }

  // Initialize Lenis smooth scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Buttery smooth exponential deceleration
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    autoResize: true,
    prevent: (node) => {
      // Do not intercept scroll inside nested scrollable containers / modals
      if (!node || typeof (node as any).closest !== 'function') return false
      const el = node as HTMLElement
      return (
        el.hasAttribute('data-lenis-prevent') ||
        el.closest('[data-lenis-prevent]') !== null ||
        el.closest('.overflow-y-auto') !== null ||
        el.closest('.overflow-auto') !== null ||
        el.closest('.acc-menu-panel') !== null ||
        el.closest('.glightbox-container') !== null ||
        el.closest('.modal') !== null ||
        el.closest('[role="dialog"]') !== null
      )
    }
  })

  // Start continuous requestAnimationFrame loop
  let rafId: number
  function raf(time: number) {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  // Sync scroll height and positions after page route transitions
  nuxtApp.hook('page:finish', () => {
    setTimeout(() => {
      lenis.resize()
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash)
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.0 })
        }
      }
    }, 100)
  })

  // Intercept anchor clicks on current page for smooth momentum gliding
  if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement)?.closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      // Handle in-page hash links like href="#layanan"
      if (href.startsWith('#') && href.length > 1) {
        const el = document.querySelector(href)
        if (el) {
          e.preventDefault()
          lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.2 })
        }
      }
    })
  }

  // Intercept window.scrollTo({ behavior: 'smooth' }) calls so programmatic scrolls use Lenis easing
  const nativeScrollTo = window.scrollTo.bind(window)
  window.scrollTo = function (optionsOrX: any, y?: any) {
    if (typeof optionsOrX === 'object' && optionsOrX !== null) {
      if (optionsOrX.behavior === 'smooth') {
        lenis.scrollTo(optionsOrX.top ?? 0, { duration: 1.2 })
        return
      }
    }
    nativeScrollTo(optionsOrX, y)
  }

  // Provide lenis instance to Nuxt app and window for external access
  nuxtApp.provide('lenis', lenis)
  ;(window as any).__lenis = lenis
})
