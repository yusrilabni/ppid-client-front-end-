const fs = require('fs');

function patch(file, replacer) {
  let code = fs.readFileSync(file, 'utf8');
  code = replacer(code);
  fs.writeFileSync(file, code);
  console.log('Patched ' + file);
}

// 1. Patch google-callback.vue
patch('./pages/google-callback.vue', (code) => {
  const redirectLogic = `          if (state === 'link') {
            router.push('/profile?linked=success')
          } else {
            const pending = localStorage.getItem('pending_download_twibbon');
            if (pending) {
              localStorage.removeItem('pending_download_twibbon');
              router.push('/twibbon/' + pending + '?auto_download=1');
            } else {
              router.push('/')
            }
          }`;
  return code.replace(/if \(state === 'link'\) \{\s*router\.push\('\/profile\?linked=success'\)\s*\} else \{\s*router\.push\('\/'\)\s*\}/, redirectLogic);
});

// 2. Patch register.vue
patch('./pages/register.vue', (code) => {
  const redirectLogic = `      const pending = localStorage.getItem('pending_download_twibbon');
      if (pending) {
        localStorage.removeItem('pending_download_twibbon');
        router.push('/twibbon/' + pending + '?auto_download=1');
      } else {
        router.push('/');
      }`;
      
  let res = code.replace(/router\.push\('\/'\)/g, (match, offset, str) => {
    // Only replace the ones in handleRegister and handleVerifyOtp
    return `const pending = localStorage.getItem('pending_download_twibbon');
      if (pending) {
        localStorage.removeItem('pending_download_twibbon');
        router.push('/twibbon/' + pending + '?auto_download=1');
      } else {
        router.push('/');
      }`;
  });
  return res;
});

// 3. Patch login.vue
patch('./pages/login.vue', (code) => {
  return code.replace(/router\.push\(route\.query\.redirect \|\| '\/'\)/, `const pending = localStorage.getItem('pending_download_twibbon');
    if (pending) {
      localStorage.removeItem('pending_download_twibbon');
      router.push('/twibbon/' + pending + '?auto_download=1');
    } else {
      router.push(route.query.redirect || '/');
    }`);
});

// 4. Patch twibbon/[slug].vue and admin/twibbon/[slug]/index.vue
const twibbonReplacer = (code) => {
  // Import authStore
  if (!code.includes('import { useAuthStore }')) {
    code = code.replace(/import \{ useRoute \} from 'vue-router'/, `import { useRoute } from 'vue-router'\nimport { useAuthStore } from '@/stores/auth'`);
  }
  if (!code.includes('const authStore = useAuthStore()')) {
    code = code.replace(/const route = useRoute\(\)/, `const route = useRoute()\nconst authStore = useAuthStore()`);
  }

  // Update downloadTwibbon
  const oldDownloadStart = `const downloadTwibbon = () => {
  if (photos.value.length === 0 || !frameImgObj) return
  isDownloading.value = true`;

  const newDownloadStart = `const downloadTwibbon = () => {
  if (photos.value.length === 0 || !frameImgObj) return
  
  if (!authStore.isAuthenticated) {
    if (process.client) {
      localStorage.setItem('pending_download_twibbon', route.params.slug);
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://ppidkab.sinjaikab.go.id';
      window.location.href = \`\${apiUrl}/api/v1/auth/google/redirect?action=login\`;
    }
    return;
  }
  
  isDownloading.value = true`;

  code = code.replace(oldDownloadStart, newDownloadStart);

  // Auto download logic in onMounted
  const autoDownloadLogic = `  await restoreSession()
  if (route.query.auto_download === '1') {
    setTimeout(() => {
      downloadTwibbon();
    }, 1500);
    router.replace('/twibbon/' + route.params.slug);
  }`;
  
  code = code.replace(/await restoreSession\(\)/, autoDownloadLogic);

  // In admin index.vue, replace URL for route cleaning
  code = code.replace(/router\.replace\('\/twibbon\/' \+ route\.params\.slug\);/g, `router.replace(route.path);`);
  return code;
};

patch('./pages/twibbon/[slug].vue', twibbonReplacer);
patch('./pages/admin/twibbon/[slug]/index.vue', twibbonReplacer);
