// src/config/breadcrumbs.js

const truncate = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getBreadcrumbs = {
    dip: (year) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'DIP', url: '#', icon: 'fas fa-book' },
        { title: 'DIP ' + (year || ''), url: '#', icon: 'fas fa-file-alt' }
    ],
    dipUnit: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'DIP', url: '#', icon: 'fas fa-book' },
        { title: 'DIP Unit', url: '#', icon: 'fas fa-university' }
    ],
    dipUnitDetail: (unitName) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'DIP', url: '#', icon: 'fas fa-book' },
        { title: 'DIP Unit', url: '/dipunit', icon: 'fas fa-university' },
        { title: truncate(unitName, 30), url: '#', icon: 'fas fa-file-alt' }
    ],
    kategoriInformasi: (categoryName, categoryIcon) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Jenis Informasi', url: '#', icon: 'fas fa-folder' },
        { title: categoryName || 'Jenis Informasi', url: '', icon: categoryIcon || 'fas fa-folder' }
    ],
    detailInformasi: (categoryName, categorySlug, categoryIcon, title) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Jenis Informasi', url: '#', icon: 'fas fa-folder' },
        { title: categoryName || 'Jenis Informasi', url: `/informasi/${categorySlug}`, icon: categoryIcon || 'fas fa-folder' },
        { title: truncate(title, 25), url: '', icon: 'fas fa-file-alt' }
    ],
    laporanPpid: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Laporan PPID', url: '', icon: 'fas fa-chart-line' }
    ],
    laporanPermohonan: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Permohonan Informasi', url: '#', icon: 'fas fa-file-signature' }
    ],
    standarLayananDetail: (title, categoryIcon) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Standar Layanan', url: '#', icon: 'fas fa-clipboard-list' },
        { title: title || 'Detail Layanan', url: '#', icon: categoryIcon || 'fas fa-clipboard-list' }
    ],
    standarLayananFile: (title, categoryIcon, fileTitle) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Standar Layanan', url: '#', icon: 'fas fa-clipboard-list' },
        { title: title || 'Standar Layanan', url: '#', icon: categoryIcon || 'fas fa-clipboard-list' },
        { title: truncate(fileTitle, 25), url: '#', icon: 'fas fa-file-pdf' }
    ],
    lhkpn: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'LHKPN', url: '/lhkpn', icon: 'fas fa-file-invoice-dollar' }
    ],
    pbj: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'PBJ', url: '/pbj', icon: 'fas fa-shopping-cart' }
    ],
    pbjDetail: (year) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'PBJ', url: '/pbj', icon: 'fas fa-shopping-cart' },
        { title: `PBJ ${year}`, url: `/pbj/${year}`, icon: 'fas fa-file-alt' }
    ],
    pejabatDaerah: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Profil', url: '#', icon: 'fas fa-user' },
        { title: 'Pejabat Daerah', url: '', icon: 'fas fa-user-tie' }
    ],
    unitLokal: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Profil', url: '#', icon: 'fas fa-user' },
        { title: 'Unit Lokal', url: '', icon: 'fas fa-map-marked-alt' }
    ],
    tentangOpd: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Profil', url: '#', icon: 'fas fa-user' },
        { title: 'Tentang OPD', url: '', icon: 'fas fa-building' }
    ],
    profilPpid: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Profil', url: '#', icon: 'fas fa-user' },
        { title: 'PPID', url: '', icon: 'fas fa-info-circle' }
    ],
    officialProfile: (name, middleTitle, middleUrl, middleIcon) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Profil', url: '#', icon: 'fas fa-user' },
        { title: middleTitle || 'Pejabat Daerah', url: middleUrl || '/profil/pejabat-daerah', icon: middleIcon || 'fas fa-user-tie' },
        { title: truncate(name, 25) || 'Profil Pejabat', url: '', icon: 'fas fa-user' }
    ],
    opdDetail: (unitName) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Profil', url: '#', icon: 'fas fa-user' },
        { title: 'Tentang OPD', url: '/profil/tentang-opd', icon: 'fas fa-building' },
        { title: truncate(unitName, 30), url: '#', icon: 'fas fa-university' }
    ],
    informasiPemkab: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Informasi Pemkab', url: '', icon: 'fas fa-file-pdf' }
    ],
    informasiPemkabShow: (title) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Informasi Pemkab', url: '/transparansi/informasi-pemkab', icon: 'fas fa-file-pdf' },
        { title: truncate(title, 25) || 'Detail Informasi', url: '', icon: 'fas fa-file-alt' }
    ],
    surveyList: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Survei', url: '', icon: 'fas fa-poll' }
    ],
    surveyShow: (title) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Survei', url: '/survey', icon: 'fas fa-poll' },
        { title: truncate(title, 25) || 'Mulai Survei', url: '', icon: 'fas fa-pen-square' }
    ],
    permohonanCreate: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Form Permohonan', url: '', icon: 'fas fa-paper-plane' }
    ],
    keberatanCreate: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Pengajuan Keberatan', url: '', icon: 'fas fa-balance-scale' }
    ],
    galeri: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Publikasi', url: '#', icon: 'fas fa-bullhorn' },
        { title: 'Galeri', url: '', icon: 'fas fa-images' }
    ],
    kontak: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Kontak', url: '', icon: 'fas fa-phone' }
    ],
    regulasi: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Regulasi', url: '', icon: 'fas fa-gavel' }
    ],
    search: (query) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: `Pencarian: ${query || ''}`, url: '', icon: 'fas fa-search' }
    ],
    statistik: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Statistik', url: '', icon: 'fas fa-chart-pie' }
    ],
    maklumatLayanan: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Standar Layanan', url: '#', icon: 'fas fa-clipboard-list' },
        { title: 'Maklumat Pelayanan', url: '', icon: 'fas fa-bullhorn' }
    ],
    sopLayanan: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Standar Layanan', url: '#', icon: 'fas fa-clipboard-list' },
        { title: 'SOP', url: '', icon: 'fas fa-file-alt' }
    ],
    standarLayanan: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Standar Layanan', url: '', icon: 'fas fa-clipboard-list' }
    ],
    permohonanPage: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Buat Permohonan', url: '', icon: 'fas fa-pen-nib' }
    ],
    trackingPage: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Transparansi', url: '#', icon: 'fas fa-chart-bar' },
        { title: 'Cek Status', url: '', icon: 'fas fa-search-location' }
    ]
};
