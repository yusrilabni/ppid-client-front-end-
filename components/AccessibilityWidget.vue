<template>
  <div class="fixed z-[99999] acc-widget-container flex flex-col items-center" style="bottom: 24px; left: 24px;">
    
    <!-- MASTER SOUND TOGGLE -->
    <button @click.stop="toggleMasterSound()" 
            class="flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg text-white mb-2" 
            :class="isSoundEnabled ? 'bg-green-500' : 'bg-red-500'"
            style="width: 32px; height: 32px; border-radius: 50%; border: none; cursor: pointer;">
      <i v-show="isSoundEnabled" class="fas fa-volume-up" style="font-size: 14px;"></i>
      <i v-show="!isSoundEnabled" class="fas fa-volume-mute" style="font-size: 14px;"></i>
    </button>

    <button @click.stop="accConfig.toggleMenu()" class="bg-[#0052FF] hover:bg-[#0041CC] text-white flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg" style="width: 64px; height: 64px; border-radius: 50%; border: none; cursor: pointer;">
      <i class="fas fa-universal-access" style="font-size: 30px;" v-show="!accConfig.isOpen"></i>
      <i class="fas fa-times" style="font-size: 28px;" v-show="accConfig.isOpen"></i>
    </button>

    <transition name="fade">
      <div v-show="accConfig.isOpen" @click.stop
           class="absolute bg-white overflow-hidden acc-menu-panel" style="bottom: 110px; left: 0; width: 360px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: 1px solid #E5E7EB;">
        <div class="bg-[#0052FF] text-white shrink-0 relative" style="padding: 24px 20px;">
          <h3 style="font-size: 18px; font-weight: 700;">Menu Aksesibilitas</h3>
          <p style="font-size: 12px; opacity: 0.9;">Optimalkan tampilan sesuai kebutuhan Anda</p>
        </div>

        <div class="overflow-y-auto" style="padding: 20px; max-height: 540px; background: #F9FAFB;">
          <div style="margin-bottom: 20px; background: #fff; padding: 16px; border-radius: 16px; border: 1px solid #E5E7EB;">
            <p style="font-size: 12px; font-weight: 700; color: #6B7280; margin-bottom: 12px; text-transform: uppercase;">Kontrol Suara (TTS)</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
              <button @click="toggleReader()" :class="(isReaderActive && isSoundEnabled) ? 'border-[#0052FF] border-2' : 'border-[#E5E7EB] border'" class="bg-white text-[#374151] flex items-center justify-center" style="padding: 12px; border-radius: 12px; cursor: pointer; font-size: 12px; font-weight: 700; border-style: solid;">
                <i class="fas fa-volume-up" style="margin-right: 8px;"></i> Klik Baca
              </button>
              <button @click="toggleHoverReader()" :class="(isHoverActive && isSoundEnabled) ? 'border-[#0052FF] border-2' : 'border-[#E5E7EB] border'" class="bg-white text-[#374151] flex items-center justify-center" style="padding: 12px; border-radius: 12px; cursor: pointer; font-size: 12px; font-weight: 700; border-style: solid;">
                <i class="fas fa-mouse-pointer" style="margin-right: 8px;"></i> Sorot Baca
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <!-- 1. Contrast -->
            <button @click="accConfig.cycleContrast()" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.contrast !== 'default'}">
              <i v-show="accConfig.contrast !== 'default'" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper">
                <i :class="{'fas fa-adjust': accConfig.contrast === 'default', 'fas fa-sun': accConfig.contrast === 'light', 'fas fa-eye-slash': accConfig.contrast === 'invert', 'fas fa-moon': accConfig.contrast === 'dark'}"></i>
              </div>
              <div class="acc-text-wrapper"><span>Kontras Tinggi</span><small class="capitalize">{{ accConfig.contrast }}</small></div>
              <div class="acc-dot-container">
                <div v-for="m in ['default', 'light', 'invert', 'dark']" :key="m" :style="{ width: accConfig.contrast === m ? '12px' : '6px', backgroundColor: accConfig.contrast === m ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div>
              </div>
            </button>
            
            <!-- 2. Text Size -->
            <button @click="cycleFont()" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.fontLevel !== 'normal'}">
              <i v-show="accConfig.fontLevel !== 'normal'" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper" style="height: 50px !important;">
                <div style="display: flex; align-items: baseline; justify-content: center; gap: 4px;">
                  <span :style="'font-size: ' + (accConfig.fontLevel === 'kecil' ? '12' : (accConfig.fontLevel === 'normal' ? '16' : (accConfig.fontLevel === 'sedang' ? '20' : '24'))) + 'px !important'" style="font-weight: bold; color: #374151 !important; line-height: 1 !important; margin: 0 !important;">T</span>
                  <span :style="'font-size: ' + (accConfig.fontLevel === 'kecil' ? '24' : (accConfig.fontLevel === 'normal' ? '32' : (accConfig.fontLevel === 'sedang' ? '40' : '48'))) + 'px !important'" style="font-weight: bold; color: #374151 !important; line-height: 1 !important; margin: 0 !important;">T</span>
                </div>
              </div>
              <div class="acc-text-wrapper"><span>Ukuran Teks</span><small class="capitalize">{{ accConfig.fontLevel }}</small></div>
              <div class="acc-dot-container">
                <div v-for="l in ['kecil', 'normal', 'sedang', 'besar']" :key="l" :style="{ width: accConfig.fontLevel === l ? '12px' : '6px', backgroundColor: accConfig.fontLevel === l ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div>
              </div>
            </button>
            
            <!-- 3. Highlight Links -->
            <button @click="accConfig.update('links', !accConfig.links)" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.links}">
              <i v-show="accConfig.links" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper"><i class="fas fa-link"></i></div>
              <div class="acc-text-wrapper"><span>Sorot Tautan</span><small>{{ accConfig.links ? 'Aktif' : 'Default' }}</small></div>
              <div class="acc-dot-container"><div :style="{ width: accConfig.links ? '24px' : '12px', backgroundColor: accConfig.links ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div></div>
            </button>
            
            <!-- 4. Text Spacing -->
            <button @click="accConfig.update('textSpacing', !accConfig.textSpacing)" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.textSpacing}">
              <i v-show="accConfig.textSpacing" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper"><i class="fas fa-arrows-alt-h"></i></div>
              <div class="acc-text-wrapper"><span>Spasi Teks</span><small>{{ accConfig.textSpacing ? 'Aktif' : 'Default' }}</small></div>
              <div class="acc-dot-container"><div :style="{ width: accConfig.textSpacing ? '24px' : '12px', backgroundColor: accConfig.textSpacing ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div></div>
            </button>
            
            <!-- 5. Hide Images -->
            <button @click="accConfig.update('hideImages', !accConfig.hideImages)" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.hideImages}">
              <i v-show="accConfig.hideImages" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper"><i class="fas fa-image"></i></div>
              <div class="acc-text-wrapper"><span>Sembunyi Gbr</span><small>{{ accConfig.hideImages ? 'Aktif' : 'Default' }}</small></div>
              <div class="acc-dot-container"><div :style="{ width: accConfig.hideImages ? '24px' : '12px', backgroundColor: accConfig.hideImages ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div></div>
            </button>
            
            <!-- 6. Dyslexia -->
            <button @click="accConfig.cycleDyslexic()" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.dyslexic !== 'default'}">
              <i v-show="accConfig.dyslexic !== 'default'" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper">
                <i :class="{'fas fa-font': accConfig.dyslexic === 'default', 'fas fa-universal-access': accConfig.dyslexic === 'open', 'fas fa-spell-check': accConfig.dyslexic === 'lexend'}"></i>
              </div>
              <div class="acc-text-wrapper"><span>Ramah Disleksia</span><small class="capitalize">{{ accConfig.dyslexic }}</small></div>
              <div class="acc-dot-container">
                <div v-for="m in ['default', 'open', 'lexend']" :key="m" :style="{ width: accConfig.dyslexic === m ? '12px' : '6px', backgroundColor: accConfig.dyslexic === m ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div>
              </div>
            </button>
            
            <!-- 7. Focus -->
            <button @click="accConfig.cycleFocus()" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.focus !== 'default'}">
              <i v-show="accConfig.focus !== 'default'" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper">
                <i :class="{'fas fa-eye': accConfig.focus === 'default', 'fas fa-mouse-pointer': accConfig.focus === 'cursor', 'fas fa-low-vision': accConfig.focus === 'mask', 'fas fa-grip-lines-vertical': accConfig.focus === 'guide'}"></i>
              </div>
              <div class="acc-text-wrapper"><span>Fokus Membaca</span><small class="capitalize">{{ accConfig.focus }}</small></div>
              <div class="acc-dot-container">
                <div v-for="m in ['default', 'cursor', 'mask', 'guide']" :key="m" :style="{ width: accConfig.focus === m ? '12px' : '6px', backgroundColor: accConfig.focus === m ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div>
              </div>
            </button>
            
            <!-- 8. Keyboard Nav -->
            <button @click="accConfig.update('keyboard', !accConfig.keyboard)" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.keyboard}">
              <i v-show="accConfig.keyboard" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper"><i class="fas fa-keyboard"></i></div>
              <div class="acc-text-wrapper"><span>Navigasi Key</span><small>{{ accConfig.keyboard ? 'Aktif' : 'Default' }}</small></div>
              <div class="acc-dot-container"><div :style="{ width: accConfig.keyboard ? '24px' : '12px', backgroundColor: accConfig.keyboard ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div></div>
            </button>
            
            <!-- 9. Alignment -->
            <button @click="accConfig.cycleAlignment()" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.alignment !== 'default'}">
              <i v-show="accConfig.alignment !== 'default'" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper">
                <i :class="{'fas fa-bars': accConfig.alignment === 'default', 'fas fa-align-left': accConfig.alignment === 'left', 'fas fa-align-center': accConfig.alignment === 'center', 'fas fa-align-right': accConfig.alignment === 'right'}"></i>
              </div>
              <div class="acc-text-wrapper"><span>Perataan</span><small class="capitalize">{{ accConfig.alignment }}</small></div>
              <div class="acc-dot-container">
                <div v-for="m in ['default', 'left', 'center', 'right']" :key="m" :style="{ width: accConfig.alignment === m ? '12px' : '6px', backgroundColor: accConfig.alignment === m ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div>
              </div>
            </button>
            
            <!-- 10. Saturation -->
            <button @click="accConfig.cycleSaturation()" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.saturation !== 'default'}">
              <i v-show="accConfig.saturation !== 'default'" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper">
                <i :class="{'fas fa-palette': accConfig.saturation === 'default', 'fas fa-brush': accConfig.saturation === 'low', 'fas fa-fill-drip': accConfig.saturation === 'high', 'fas fa-tint-slash': accConfig.saturation === 'mono'}"></i>
              </div>
              <div class="acc-text-wrapper"><span>Warna</span><small class="capitalize">{{ accConfig.saturation }}</small></div>
              <div class="acc-dot-container">
                <div v-for="s in ['default', 'low', 'high', 'mono']" :key="s" :style="{ width: accConfig.saturation === s ? '12px' : '6px', backgroundColor: accConfig.saturation === s ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div>
              </div>
            </button>
            
            <!-- 11. Headings -->
            <button @click="accConfig.update('headings', !accConfig.headings)" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.headings}">
              <i v-show="accConfig.headings" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper"><i class="fas fa-heading"></i></div>
              <div class="acc-text-wrapper"><span>Sorot Judul</span><small>{{ accConfig.headings ? 'Aktif' : 'Default' }}</small></div>
              <div class="acc-dot-container"><div :style="{ width: accConfig.headings ? '24px' : '12px', backgroundColor: accConfig.headings ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div></div>
            </button>
            
            <!-- 12. Line Height -->
            <button @click="accConfig.update('lineHeight', !accConfig.lineHeight)" class="acc-grid-btn acc-ignore" :class="{'active': accConfig.lineHeight}">
              <i v-show="accConfig.lineHeight" class="fas fa-check-circle acc-check-icon"></i>
              <div class="acc-icon-wrapper"><i class="fas fa-arrows-alt-v"></i></div>
              <div class="acc-text-wrapper"><span>Tinggi Baris</span><small>{{ accConfig.lineHeight ? 'Aktif' : 'Default' }}</small></div>
              <div class="acc-dot-container"><div :style="{ width: accConfig.lineHeight ? '24px' : '12px', backgroundColor: accConfig.lineHeight ? '#0052FF' : '#D1D5DB' }" class="acc-dot"></div></div>
            </button>
          </div>

          <div style="margin-top: 24px; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 20px;">
            <button @click="resetAcc()" class="bg-gray-800 text-white hover:bg-black w-full flex items-center justify-center acc-ignore" style="padding: 14px; border-radius: 12px; border: none; cursor: pointer; font-size: 13px !important; font-weight: 700; margin-bottom: 12px;">
              <i class="fas fa-undo" style="margin-right: 8px !important; font-size: 14px !important;"></i> Reset Semua
            </button>
            <p style="font-size: 11px !important; color: #9CA3AF !important; margin: 0 !important; font-weight: 600 !important;">&copy; 2026 PPID KABUPATEN SINJAI</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAccessibilityStore } from '@/stores/accessibility'

const accConfig = useAccessibilityStore()

const isSoundEnabled = ref(true)
const isReaderActive = ref(false)
const isHoverActive = ref(false)
const isCurrentlySpeaking = ref(false)
let hoverTimeout = null
let speakingInterval = null

const closeMenuOnOutsideClick = (e) => {
  if (accConfig.isOpen && !e.target.closest('.acc-menu-panel')) {
    accConfig.toggleMenu()
  }
}

const toggleMasterSound = () => {
  isSoundEnabled.value = !isSoundEnabled.value
  if (process.client) {
    localStorage.setItem('acc_sound_enabled', isSoundEnabled.value.toString())
    if (!isSoundEnabled.value) window.speechSynthesis.cancel()
  }
}

const toggleReader = () => {
  isReaderActive.value = !isReaderActive.value
  isHoverActive.value = false
  saveStates()
  if (isReaderActive.value && !isSoundEnabled.value) toggleMasterSound()
}

const toggleHoverReader = () => {
  isHoverActive.value = !isHoverActive.value
  isReaderActive.value = false
  saveStates()
  if (isHoverActive.value && !isSoundEnabled.value) toggleMasterSound()
}

const saveStates = () => {
  if (process.client) {
    localStorage.setItem('acc_reader_active', isReaderActive.value.toString())
    localStorage.setItem('acc_hover_active', isHoverActive.value.toString())
  }
}

const cycleFont = () => {
  accConfig.cycleFont()
}

const resetAcc = () => {
  accConfig.resetAll()
}

const formatTextForTTS = (text) => {
  if (!text) return ''
  
  const replacements = [
    { p: /\bA\.\s/gi, r: "Andi' " },
    { p: /\bDra\./gi, r: 'Doktoranda' },
    { p: /\bDrs\./gi, r: 'Doktorandus' },
    { p: /\bDr\./gi, r: 'Doktor' },
    { p: /\bIr\./gi, r: 'Insinyur' },
    { p: /\bHj\./gi, r: 'Hajjah' },
    { p: /\bH\./gi, r: 'Haji' },
    { p: /\bDra\b/gi, r: 'Doktoranda' },
    { p: /\bDrs\b/gi, r: 'Doktorandus' },
    { p: /\bHj\b/gi, r: 'Hajjah' },
    { p: /\bM\.Si\b/gi, r: 'Magister Sains' },
    { p: /\bM\.Pd\b/gi, r: 'Magister Pendidikan' },
    { p: /\bM\.H\b/gi, r: 'Magister Hukum' },
    { p: /\bM\.T\b/gi, r: 'Magister Teknik' },
    { p: /\bM\.M\b/gi, r: 'Magister Manajemen' },
    { p: /\bS\.Si\b/gi, r: 'Sarjana Sains' },
    { p: /\bS\.Pd\b/gi, r: 'Sarjana Pendidikan' },
    { p: /\bS\.Sos\b/gi, r: 'Sarjana Sosial' },
    { p: /\bS\.H\b/gi, r: 'Sarjana Hukum' },
    { p: /\bS\.T\b/gi, r: 'Sarjana Teknik' },
    { p: /\bS\.E\b/gi, r: 'Sarjana Ekonomi' },
    { p: /\bS\.Kom\b/gi, r: 'Sarjana Komputer' },
    { p: /\bS\.IP\b/gi, r: 'Sarjana Ilmu Politik' },
    { p: /\bS\.AP\b/gi, r: 'Sarjana Administrasi Publik' },
    { p: /\bA\.Md\b/gi, r: 'Ahli Madya' },
    { p: /\bNo\.\b/gi, r: 'Nomor' },
    { p: /\bKab\.\b/gi, r: 'Kabupaten' },
    { p: /\bKec\.\b/gi, r: 'Kecamatan' },
    { p: /\bTtd\b/gi, r: 'Tertanda' }
  ]

  let processedText = text
  
  replacements.forEach(item => {
    processedText = processedText.replace(item.p, item.r)
  })

  const abbreviations = ['SOP', 'DIP', 'PPID', 'IPM', 'TPAK', 'RKPD', 'RPJMD', 'LKPJ', 'SPBU', 'ASN', 'OPD', 'TTS']
  abbreviations.forEach(abbr => { 
    const regex = new RegExp('\\b' + abbr + '\\b', 'gi') 
    processedText = processedText.replace(regex, abbr.split('').join(' ')) 
  })

  return processedText
}

const speak = (text) => {
  if (!isSoundEnabled.value || !process.client) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(formatTextForTTS(text))
  utterance.lang = 'id-ID'
  window.speechSynthesis.speak(utterance)
}

const handleElementSource = (target) => {
  const el = target.closest('a, button, h1, h2, h3, h4, h5, h6, p, li, span, img, td, th, label, input')
  if (!el) return
  let text = el.tagName.toLowerCase() === 'img' ? (el.alt || 'Gambar') : (el.innerText || el.getAttribute('aria-label') || '')
  if (text.trim().length > 1) speak(text.trim())
}

const onGlobalClick = (e) => {
  closeMenuOnOutsideClick(e)
  if (!isSoundEnabled.value || !isReaderActive.value || e.target.closest('.acc-widget-container')) return
  handleElementSource(e.target)
}

const onGlobalMouseOver = (e) => {
  if (!isSoundEnabled.value || !isHoverActive.value || e.target.closest('.acc-widget-container')) return
  clearTimeout(hoverTimeout)
  hoverTimeout = setTimeout(() => { handleElementSource(e.target) }, 600)
}

const onGlobalMouseMove = (e) => {
  if (process.client) {
    const mask = document.getElementById('reading-mask')
    if (mask && accConfig.focus === 'mask') {
      const y = e.clientY
      mask.style.clipPath = `polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 0% ${y - 50}px, 100% ${y - 50}px, 100% ${y + 50}px, 0% ${y + 50}px, 0% ${y - 50}px)`
    }
  }
}

onMounted(() => {
  if (!process.client) return

  // Terapkan font size dari store (restore setelah hard refresh)
  const fontMap = { 'kecil': 12, 'normal': 16, 'sedang': 20, 'besar': 24 }
  document.documentElement.style.fontSize = (fontMap[accConfig.fontLevel] || 16) + 'px'

  const userRole = 'guest'
  const userName = ''
  const authStatus = false

  const path = window.location.pathname.replace(/\/$/, "")
  const isHome = path === "" || path === "/home"

  const savedSound = localStorage.getItem('acc_sound_enabled')
  isSoundEnabled.value = (savedSound !== null) ? (savedSound === 'true') : true

  const sReader = localStorage.getItem('acc_reader_active')
  const sHover = localStorage.getItem('acc_hover_active')
  if (sReader !== null || sHover !== null) {
    isReaderActive.value = (sReader === 'true')
    isHoverActive.value = (sHover === 'true')
  } else {
    isReaderActive.value = false
    isHoverActive.value = true
  }

  const curId = authStatus ? 'u_auth' : 'guest'
  if (isHome && sessionStorage.getItem('acc_greeted') !== curId) {
    sessionStorage.setItem('acc_greeted', curId)
    setTimeout(() => {
      if (!isSoundEnabled.value) return
      speak("Selamat datang di website P P I D Kabupaten Sinjai.")
    }, 1500)
  }

  speakingInterval = setInterval(() => {
    isCurrentlySpeaking.value = window.speechSynthesis.speaking
  }, 200)

  document.addEventListener('click', onGlobalClick)
  document.addEventListener('mouseover', onGlobalMouseOver)
  document.addEventListener('mousemove', onGlobalMouseMove)
})

onUnmounted(() => {
  if (!process.client) return
  clearInterval(speakingInterval)
  clearTimeout(hoverTimeout)
  document.removeEventListener('click', onGlobalClick)
  document.removeEventListener('mouseover', onGlobalMouseOver)
  document.removeEventListener('mousemove', onGlobalMouseMove)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
