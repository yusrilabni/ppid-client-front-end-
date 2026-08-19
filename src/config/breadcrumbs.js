// src/config/breadcrumbs.js

const truncate = (text, length) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getBreadcrumbs = {
    dip: (year) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'DIP ' + (year || ''), url: '#', icon: 'fas fa-file-alt' }
    ],
    dipUnit: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'DIP Unit', url: '#', icon: 'fas fa-university' }
    ],
    dipUnitDetail: (unitName) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'DIP Unit', url: '/dipunit', icon: 'fas fa-university' },
        { title: truncate(unitName, 30), url: '#', icon: 'fas fa-file-alt' }
    ],
    kategoriInformasi: (categoryName, categoryIcon) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: categoryName || 'Jenis Informasi', url: '', icon: categoryIcon || 'fas fa-folder' }
    ],
    detailInformasi: (categoryName, categorySlug, categoryIcon, title) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: categoryName || 'Jenis Informasi', url: `/informasi/${categorySlug}`, icon: categoryIcon || 'fas fa-folder' },
        { title: truncate(title, 25), url: '', icon: 'fas fa-file-alt' }
    ],
    laporanPpid: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Laporan PPID', url: '', icon: 'fas fa-chart-line' }
    ],
    laporanPermohonan: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Permohonan Informasi', url: '#', icon: 'fas fa-file-signature' }
    ],
    standarLayananDetail: (title, categoryIcon) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: title || 'Standar Layanan', url: '#', icon: categoryIcon || 'fas fa-clipboard-list' }
    ],
    standarLayananFile: (title, categoryIcon, fileTitle) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
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
        { title: 'Pejabat Daerah', url: '', icon: 'fas fa-user-tie' }
    ],
    unitLokal: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Unit Lokal', url: '', icon: 'fas fa-map-marked-alt' }
    ],
    tentangOpd: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Tentang OPD', url: '', icon: 'fas fa-building' }
    ],
    profilPpid: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'PPID', url: '', icon: 'fas fa-info-circle' }
    ],
    officialProfile: (name, middleTitle, middleUrl, middleIcon) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: middleTitle || 'Pejabat Daerah', url: middleUrl || '/profil/pejabat-daerah', icon: middleIcon || 'fas fa-user-tie' },
        { title: truncate(name, 25) || 'Profil Pejabat', url: '', icon: 'fas fa-user' }
    ],
    opdDetail: (unitName) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Tentang OPD', url: '/profil/tentang-opd', icon: 'fas fa-building' },
        { title: truncate(unitName, 30), url: '#', icon: 'fas fa-university' }
    ],
    informasiPemkab: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Informasi Pemkab', url: '', icon: 'fas fa-file-pdf' }
    ],
    informasiPemkabShow: (title) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Informasi Pemkab', url: '/transparansi/informasi-pemkab', icon: 'fas fa-file-pdf' },
        { title: truncate(title, 25) || 'Detail Informasi', url: '', icon: 'fas fa-file-alt' }
    ],
    surveyList: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Survei', url: '', icon: 'fas fa-poll' }
    ],
    surveyShow: (title) => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Survei', url: '/survey', icon: 'fas fa-poll' },
        { title: truncate(title, 25) || 'Mulai Survei', url: '', icon: 'fas fa-pen-square' }
    ],
    permohonanCreate: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Permohonan Informasi', url: '', icon: 'fas fa-file-signature' }
    ],
    keberatanCreate: () => [
        { title: 'Beranda', url: '/', icon: 'fas fa-home' },
        { title: 'Pengajuan Keberatan', url: '', icon: 'fas fa-balance-scale' }
    ]
};
