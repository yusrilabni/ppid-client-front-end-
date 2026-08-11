import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// Public Pages
import HomePage from '@/pages/HomePage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'

// Information pages
import InformasiCategory from '@/pages/informasi/CategoryPage.vue'
import InformasiDetail from '@/pages/informasi/DetailPage.vue'

// Gallery
import GaleriPage from '@/pages/GaleriPage.vue'

// Profil
import ProfilPpid from '@/pages/profil/ProfilPpidPage.vue'
import TentangOpd from '@/pages/profil/TentangOpdPage.vue'
import OpdDetail from '@/pages/profil/OpdDetailPage.vue'
import OfficialProfile from '@/pages/profil/OfficialProfilePage.vue'
import PejabatDaerahPage from '@/pages/profil/PejabatDaerahPage.vue'
import UnitLokalPage from '@/pages/profil/UnitLokalPage.vue'

// Layanan
import StandarLayanan from '@/pages/layanan/StandarLayananPage.vue'
import StandarLayananDetail from '@/pages/layanan/StandarLayananDetailPage.vue'
import StandarLayananFileDetail from '@/pages/layanan/StandarLayananFileDetailPage.vue'
import MaklumatLayanan from '@/pages/layanan/MaklumatLayananPage.vue'
import SopLayanan from '@/pages/layanan/SopLayananPage.vue'

// Permohonan
import PermohonanInformasi from '@/pages/permohonan/PermohonanPage.vue'
import TrackingPage from '@/pages/permohonan/TrackingPage.vue'

// Survey, Regulasi, Laporan, DIP, Kontak
import SurveyListPage from '@/pages/SurveyListPage.vue'
import RegulasiPage from '@/pages/RegulasiPage.vue'
import LaporanPage from '@/pages/LaporanPage.vue'
import DipPage from '@/pages/DipPage.vue'
import DipUnitPage from '@/pages/DipUnitPage.vue'
import DipUnitDetailPage from '@/pages/DipUnitDetailPage.vue'
import KontakPage from '@/pages/KontakPage.vue'
import StatistikPage from '@/pages/StatistikPage.vue'

// Admin Pages
import AdminDashboard from '@/pages/admin/DashboardPage.vue'

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'search', name: 'search', component: SearchPage },
      { path: 'login', name: 'login', component: LoginPage },
      { path: 'register', name: 'register', component: RegisterPage },
      // Information
      { path: 'informasi/:category', name: 'informasi.category', component: InformasiCategory },
      { path: 'informasi/detail/:slug', name: 'informasi.detail', component: InformasiDetail },
      // Gallery
      { path: 'galeri', name: 'galeri', component: GaleriPage },
      // Profil
      { path: 'profil/ppid', name: 'profil.ppid', component: ProfilPpid },
      { path: 'profil/tentang-opd', name: 'profil.opd', component: TentangOpd },
      { path: 'profil/organisasi/:slug', name: 'profil.opd.detail', component: OpdDetail },
      { path: 'profil/pejabat-daerah', name: 'profil.pejabat-daerah', component: PejabatDaerahPage },
      { path: 'profil/unit-lokal', name: 'profil.unit-lokal', component: UnitLokalPage },
      { path: 'profil/:slug', name: 'profil.official', component: OfficialProfile },
      // Layanan
      { path: 'standar-layanan', name: 'standar-layanan', component: StandarLayanan },
      { path: 'standar-layanan/file/:slug', name: 'standar-layanan.file-detail', component: StandarLayananFileDetail },
      { path: 'standar-layanan/:slug', name: 'standar-layanan.detail', component: StandarLayananDetail },
      { path: 'maklumat-layanan', name: 'maklumat-layanan', component: MaklumatLayanan },
      { path: 'sop-layanan', name: 'sop-layanan', component: SopLayanan },
      // Permohonan
      { path: 'permohonan-informasi', name: 'permohonan', component: PermohonanInformasi },
      { path: 'tracking/:code?', name: 'tracking', component: TrackingPage },
      // Other
      { path: 'survei', name: 'survei', component: SurveyListPage },
      { path: 'regulasi', name: 'regulasi', component: RegulasiPage },
      { path: 'laporan', name: 'laporan', component: LaporanPage },
      { path: 'dip/:year?', name: 'dip', component: DipPage },
      { path: 'dipunit', name: 'dipunit', component: DipUnitPage },
      { path: 'dipunit/dip/:slug', name: 'dipunit.detail', component: DipUnitDetailPage },
      { path: 'kontak', name: 'kontak', component: KontakPage },
      { path: 'statistik', name: 'statistik', component: StatistikPage },
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'admin.dashboard', component: AdminDashboard },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore()
  loadingStore.startLoading()

  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
  } else {
    next()
  }
})

router.afterEach(() => {
  const loadingStore = useLoadingStore()
  // Berikan sedikit jeda (50ms) untuk memberi kesempatan komponen baru me-mount
  // dan memanggil startLoading() (jika data belum ada di cache),
  // sehingga count tidak sempat menyentuh 0 (mencegah loading berkedip).
  setTimeout(() => {
    loadingStore.stopLoading()
  }, 50)
})

export default router
