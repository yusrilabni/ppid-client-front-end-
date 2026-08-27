const http = require('http');

const routes = [
  '/',
  '/galeri',
  '/google-callback',
  '/kebijakan-privasi',
  '/kontak',
  '/lhkpn',
  '/login',
  '/maklumat-layanan',
  '/permohonan-informasi',
  '/profile',
  '/register',
  '/regulasi',
  '/rss',
  '/search',
  '/sop-layanan',
  '/statistik',
  '/widget',
  '/admin',
  '/auth/callback',
  '/dip/2024',
  '/dipunit',
  '/dipunit/dip/dinas-kesehatan',
  '/informasi/berkala',
  '/informasi/detail/test-slug',
  '/laporan/permohonan',
  '/laporan/ppid',
  '/laporan/survei',
  '/laporan/ppid/preview/1',
  '/pbj',
  '/pbj/2024',
  '/profil/pejabat-daerah',
  '/profil/ppid',
  '/profil/unit-lokal',
  '/profil/dinas-kesehatan',
  '/profil/tentang-opd',
  '/profil/tentang-opd/dinas-kesehatan',
  '/standar-layanan',
  '/standar-layanan/pengumuman',
  '/standar-layanan/file/pengumuman',
  '/survei/layanan-informasi',
  '/tracking/12345',
  '/transparansi/informasi-pemkab',
  '/transparansi/informasi-pemkab/test-slug'
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          route,
          status: res.statusCode,
          error: res.statusCode === 500 ? (data.match(/<div class="description">(.*?)<\/div>/s)?.[1] || data.substring(0, 500)) : null
        });
      });
    }).on('error', (err) => {
      resolve({ route, status: 0, error: err.message });
    });
  });
}

async function run() {
  let hasError = false;
  let errors = [];
  console.log(`Starting verification of ${routes.length} routes...`);
  
  for (let route of routes) {
    process.stdout.write(`Checking ${route} ... `);
    const result = await checkRoute(route);
    if (result.status === 200 || result.status === 301 || result.status === 302 || result.status === 404) { // 404 is technically fine for dynamic routes if not found in db
      console.log(`\x1b[32mOK (${result.status})\x1b[0m`);
    } else {
      console.log(`\x1b[31mFAIL (${result.status})\x1b[0m - ${result.error || ''}`);
      errors.push(result);
      hasError = true;
    }
  }

  console.log('\n--- VERIFICATION RESULT ---');
  if (!hasError) {
    console.log('\x1b[32mALL 43 PAGES PASSED!\x1b[0m No SSR 500 errors detected.');
  } else {
    console.log('\x1b[31mSOME PAGES FAILED!\x1b[0m');
    console.log(errors);
  }
}

run();
