const home = { title: 'Beranda', url: '/', icon: 'fas fa-home' };

export const getBreadcrumbs = {
  dip: (year) => [home, { title: 'DIP', icon: 'fas fa-book' }, { title: 'Daftar Informasi Publik (DIP) ' + (year || ''), url: '/dip/' + (year || ''), icon: 'fas fa-book' }],
  dipUnitDetail: (unitName) => [home, { title: 'DIP', icon: 'fas fa-book' }, { title: 'DIP Unit', url: '/dipunit', icon: 'fas fa-university' }, { title: unitName || 'Detail Unit', icon: 'fas fa-building' }],
  dipUnit: () => [home, { title: 'DIP', icon: 'fas fa-book' }, { title: 'Daftar Informasi Publik (DIP) Unit', url: '/dipunit', icon: 'fas fa-university' }],
  galeri: () => [home, { title: 'Galeri', url: '/galeri', icon: 'fas fa-images' }],
  detailInformasi: (category, categorySlug, categoryIcon, title) => [
    home,
    { title: 'Jenis Informasi', icon: 'fas fa-folder' },
    { title: category, url: '/informasi/' + categorySlug, icon: categoryIcon || 'fas fa-folder' },
    { title: title || 'Detail Informasi', icon: 'fas fa-file-alt' }
  ],
  kategoriInformasi: (categoryName, categoryIcon) => [
    home,
    { title: 'Jenis Informasi', icon: 'fas fa-folder' },
    { title: categoryName || 'Kategori Informasi', icon: categoryIcon || 'fas fa-folder' }
  ],
  kontak: () => [home, { title: 'Kontak', url: '/kontak', icon: 'fas fa-envelope' }],
  laporanPermohonan: () => [home, { title: 'Transparansi', icon: 'fas fa-chart-bar' }, { title: 'Laporan Permohonan Informasi', url: '/laporan/permohonan', icon: 'fas fa-file-signature' }],
  laporanPpid: () => [home, { title: 'Transparansi', icon: 'fas fa-chart-bar' }, { title: 'Laporan PPID', url: '/laporan/ppid', icon: 'fas fa-chart-line' }],
  surveyList: () => [home, { title: 'Transparansi', icon: 'fas fa-chart-bar' }, { title: 'Survei Kepuasan', url: '/laporan/survei', icon: 'fas fa-poll' }],
  lhkpn: () => [home, { title: 'LHKPN', url: '/lhkpn', icon: 'fas fa-file-invoice-dollar' }],
  loginPage: () => [home, { title: 'Login', url: '/login', icon: 'fas fa-sign-in-alt' }],
  maklumatLayanan: () => [home, { title: 'Standar Layanan', icon: 'fas fa-clipboard-list' }, { title: 'Maklumat Pelayanan', url: '/maklumat-layanan', icon: 'fas fa-bullhorn' }],
  pbj: () => [home, { title: 'Pengadaan Barang dan Jasa', url: '/pbj', icon: 'fas fa-shopping-cart' }],
  pbjDetail: (year) => [home, { title: 'Pengadaan Barang dan Jasa', url: '/pbj', icon: 'fas fa-shopping-cart' }, { title: 'Tahun ' + year, icon: 'fas fa-calendar' }],
  permohonanPage: () => [home, { title: 'Permohonan Informasi', url: '/permohonan-informasi', icon: 'fas fa-file-signature' }],
  pejabatDaerah: () => [home, { title: 'Profil', icon: 'fas fa-user' }, { title: 'Pejabat Daerah', url: '/profil/pejabat-daerah', icon: 'fas fa-user-tie' }],
  tentangOpd: () => [home, { title: 'Profil', icon: 'fas fa-user' }, { title: 'Tentang OPD', url: '/profil/tentang-opd', icon: 'fas fa-building' }],
  opdDetail: (organizationName) => [home, { title: 'Profil', icon: 'fas fa-user' }, { title: 'Tentang OPD', url: '/profil/tentang-opd', icon: 'fas fa-building' }, { title: organizationName || 'Detail OPD', icon: 'fas fa-info-circle' }],
  unitLokal: () => [home, { title: 'Profil', icon: 'fas fa-user' }, { title: 'Unit Lokal', url: '/profil/unit-lokal', icon: 'fas fa-map-marked-alt' }],
  officialProfile: (title, middleTitle, middleUrl, middleIcon) => {
    if (middleTitle) {
      return [home, { title: 'Profil', icon: 'fas fa-user' }, { title: middleTitle, url: middleUrl, icon: middleIcon }, { title: title || 'Profil Pejabat', icon: 'fas fa-user-circle' }];
    }
    return [home, { title: 'Profil', icon: 'fas fa-user' }, { title: title || 'Profil Pejabat', icon: 'fas fa-user-circle' }];
  },
  profilePage: () => [home, { title: 'Profil Pengguna', url: '/profile', icon: 'fas fa-user-circle' }],
  registerPage: () => [home, { title: 'Registrasi', url: '/register', icon: 'fas fa-user-plus' }],
  regulasi: () => [home, { title: 'Regulasi', url: '/regulasi', icon: 'fas fa-gavel' }],
  search: (searchQuery) => [home, { title: 'Pencarian', url: '/search', icon: 'fas fa-search' }, { title: searchQuery || 'Hasil', icon: 'fas fa-file-alt' }],
  sopLayanan: () => [home, { title: 'Standar Layanan', icon: 'fas fa-clipboard-list' }, { title: 'SOP Layanan', url: '/sop-layanan', icon: 'fas fa-file-alt' }],
  standarLayanan: () => [home, { title: 'Standar Layanan', url: '/standar-layanan', icon: 'fas fa-clipboard-list' }],
  standarLayananDetail: (title, icon) => [home, { title: 'Standar Layanan', url: '/standar-layanan', icon: 'fas fa-clipboard-list' }, { title: title || 'Detail', icon: icon || 'fas fa-file-alt' }],
  standarLayananFile: (categoryTitle, categoryIcon, fileTitle) => [home, { title: 'Standar Layanan', url: '/standar-layanan', icon: 'fas fa-clipboard-list' }, { title: categoryTitle || 'Detail', icon: categoryIcon || 'fas fa-folder' }, { title: fileTitle || 'File', icon: 'fas fa-file-pdf' }],
  statistik: () => [home, { title: 'Statistik', url: '/statistik', icon: 'fas fa-chart-pie' }],
  surveyShow: (title) => [home, { title: 'Survei Kepuasan', url: '/laporan/survei', icon: 'fas fa-poll' }, { title: title || 'Isi Survei', icon: 'fas fa-edit' }],
  trackingPage: () => [home, { title: 'Lacak Permohonan', url: '/tracking', icon: 'fas fa-search-location' }],
  informasiPemkab: () => [home, { title: 'Transparansi', icon: 'fas fa-layer-group' }, { title: 'Informasi Pemkab', url: '/transparansi/informasi-pemkab', icon: 'fas fa-building' }],
  informasiPemkabDetail: (title) => [home, { title: 'Transparansi', icon: 'fas fa-layer-group' }, { title: 'Informasi Pemkab', url: '/transparansi/informasi-pemkab', icon: 'fas fa-building' }, { title: title || 'Detail Informasi', icon: 'fas fa-eye' }]
};
