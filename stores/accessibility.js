import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAccessibilityStore = defineStore('accessibility', () => {
  const getLocal = (key, defaultVal) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) || defaultVal;
    }
    return defaultVal;
  };

  const isOpen = ref(false)
  const fontLevel = ref(getLocal('acc_font_level', 'normal'))
  const contrast = ref(getLocal('acc_contrast', 'default'))
  const links = ref(getLocal('acc_links', 'false') === 'true')
  const headings = ref(getLocal('acc_headings', 'false') === 'true')
  const focus = ref(getLocal('acc_focus', 'default'))
  const keyboard = ref(getLocal('acc_keyboard', 'false') === 'true')
  const textSpacing = ref(getLocal('acc_text_spacing', 'false') === 'true')
  const hideImages = ref(getLocal('acc_hide_images', 'false') === 'true')
  const dyslexic = ref(getLocal('acc_dyslexic', 'default'))
  const lineHeight = ref(getLocal('acc_line_height', 'false') === 'true')
  const alignment = ref(getLocal('acc_alignment', 'default'))
  const saturation = ref(getLocal('acc_saturation', 'default'))

  const fontMap = { 'kecil': 12, 'normal': 16, 'sedang': 20, 'besar': 24 }
  const fontSize = computed(() => fontMap[fontLevel.value] || 16)

  const wrapperClasses = computed(() => ({
    'acc-contrast-light': contrast.value === 'light',
    'acc-contrast-invert': contrast.value === 'invert',
    'acc-contrast-dark': contrast.value === 'dark',
    'acc-sat-low': saturation.value === 'low',
    'acc-sat-high': saturation.value === 'high',
    'acc-sat-mono': saturation.value === 'mono',
    'acc-highlight-links': links.value,
    'acc-highlight-headings': headings.value,
    'acc-text-spacing': textSpacing.value,
    'acc-hide-images': hideImages.value,
    'acc-dyslexic-open': dyslexic.value === 'open',
    'acc-dyslexic-lexend': dyslexic.value === 'lexend',
    'acc-line-height': lineHeight.value,
    'acc-align-left': alignment.value === 'left',
    'acc-align-center': alignment.value === 'center',
    'acc-align-right': alignment.value === 'right',
  }))

  function setFontLevel(level) {
    fontLevel.value = level
    localStorage.setItem('acc_font_level', level)
    document.documentElement.style.fontSize = (fontMap[level] || 16) + 'px'
  }

  function update(key, val) {
    const refMap = { links, headings, keyboard, textSpacing, hideImages, lineHeight }
    if (refMap[key]) {
      refMap[key].value = val
      localStorage.setItem('acc_' + key.replace(/([A-Z])/g, '_$1').toLowerCase(), val)
    }
  }

  function cycleContrast() {
    const modes = ['default', 'light', 'invert', 'dark']
    contrast.value = modes[(modes.indexOf(contrast.value) + 1) % modes.length]
    localStorage.setItem('acc_contrast', contrast.value)
  }

  function cycleFocus() {
    const modes = ['default', 'cursor', 'mask', 'guide']
    focus.value = modes[(modes.indexOf(focus.value) + 1) % modes.length]
    localStorage.setItem('acc_focus', focus.value)
  }

  function cycleDyslexic() {
    const modes = ['default', 'open', 'lexend']
    dyslexic.value = modes[(modes.indexOf(dyslexic.value) + 1) % modes.length]
    localStorage.setItem('acc_dyslexic', dyslexic.value)
  }

  function cycleAlignment() {
    const modes = ['default', 'left', 'center', 'right']
    alignment.value = modes[(modes.indexOf(alignment.value) + 1) % modes.length]
    localStorage.setItem('acc_alignment', alignment.value)
  }

  function cycleSaturation() {
    const modes = ['default', 'low', 'high', 'mono']
    saturation.value = modes[(modes.indexOf(saturation.value) + 1) % modes.length]
    localStorage.setItem('acc_saturation', saturation.value)
  }

  function cycleFont() {
    const levels = ['kecil', 'normal', 'sedang', 'besar']
    setFontLevel(levels[(levels.indexOf(fontLevel.value) + 1) % levels.length])
  }

  function toggleMenu() {
    isOpen.value = !isOpen.value
  }

  function resetAll() {
    setFontLevel('normal')
    contrast.value = 'default'; localStorage.setItem('acc_contrast', 'default')
    links.value = false; localStorage.setItem('acc_links', 'false')
    headings.value = false; localStorage.setItem('acc_headings', 'false')
    focus.value = 'default'; localStorage.setItem('acc_focus', 'default')
    keyboard.value = false; localStorage.setItem('acc_keyboard', 'false')
    textSpacing.value = false; localStorage.setItem('acc_text_spacing', 'false')
    hideImages.value = false; localStorage.setItem('acc_hide_images', 'false')
    dyslexic.value = 'default'; localStorage.setItem('acc_dyslexic', 'default')
    lineHeight.value = false; localStorage.setItem('acc_line_height', 'false')
    alignment.value = 'default'; localStorage.setItem('acc_alignment', 'default')
    saturation.value = 'default'; localStorage.setItem('acc_saturation', 'default')
  }

  return {
    isOpen, fontLevel, contrast, links, headings, focus, keyboard,
    textSpacing, hideImages, dyslexic, lineHeight, alignment, saturation,
    fontSize, wrapperClasses,
    setFontLevel, update, cycleContrast, cycleFocus, cycleDyslexic,
    cycleAlignment, cycleSaturation, cycleFont, toggleMenu, resetAll
  }
})
