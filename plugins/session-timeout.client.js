import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const authStore = useAuthStore()
    
    // Waktu timeout diset ke 2 jam (dalam milidetik)
    const TIMEOUT_MS = 2 * 60 * 60 * 1000;
    
    const updateActivity = () => {
      if (authStore.isAuthenticated) {
        localStorage.setItem('ppid_last_activity', Date.now().toString());
      }
    };

    // Pengecekan interval setiap 10 detik
    setInterval(async () => {
      if (!authStore.isAuthenticated) return;
      
      const lastActivity = localStorage.getItem('ppid_last_activity');
      if (lastActivity) {
        const now = Date.now();
        const diff = now - parseInt(lastActivity, 10);
        
        if (diff > TIMEOUT_MS) {
          // Jika sudah melebihi batas waktu, lakukan logout
          localStorage.removeItem('ppid_last_activity');
          await authStore.logout();
          alert('Sesi Anda telah berakhir karena tidak ada aktivitas selama 2 jam. Silakan login kembali.');
          window.location.href = '/login';
        }
      }
    }, 10000);

    // Setup event listeners untuk mendeteksi interaksi/aktivitas pengguna
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'];
    let throttleTimer = null;
    
    const activityHandler = () => {
      // Gunakan throttle agar tidak spam write ke localStorage (max tiap 2 detik)
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateActivity();
        throttleTimer = null;
      }, 2000); 
    };

    // Tambahkan listener ke window
    events.forEach(event => {
      window.addEventListener(event, activityHandler, { passive: true });
    });

    // Set waktu aktivitas pertama saat memuat halaman jika sudah login
    if (authStore.isAuthenticated) {
      updateActivity();
    }
  }
})
