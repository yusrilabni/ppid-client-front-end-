const fs = require('fs');

let oldMd = fs.readFileSync('C:/laragon/www/PPID/ppid-laravel/production_deployment/progress.md', 'utf8');
let newMd = fs.readFileSync('C:/laragon/www/PPID/ppid-laravel/production_deployment/ppid_client/progress_migrasi_vue_ke_nuxt.md', 'utf8');

const regex = /## Pekerjaan yang Sudah Diselesaikan \(Terbaru\)([\s\S]*?)## Aturan Deployment/;
const match = oldMd.match(regex);
if (match) {
    let history = match[1].trim();
    // Replace 'Laravel ke Vue' -> 'Vue ke Nuxt'
    history = history.replace(/Laravel ke Vue/gi, 'Vue ke Nuxt');
    // Replace standalone 'Vue' -> 'Nuxt'
    history = history.replace(/\bVue\b/g, 'Nuxt');

    const historySection = `\n\n===========================================================================
[HISTORI LAMA - SEBELUM MIGRASI NUXT (DARI progress.md)]
===========================================================================\n` + history + `\n`;
    
    // Inject before STRUKTUR FILE PENTING
    newMd = newMd.replace(
        /===========================================================================\r?\nSTRUKTUR FILE PENTING/g,
        historySection + '\n===========================================================================\nSTRUKTUR FILE PENTING'
    );
    
    fs.writeFileSync('C:/laragon/www/PPID/ppid-laravel/production_deployment/ppid_client/progress_migrasi_vue_ke_nuxt.md', newMd);
    console.log('Appended history successfully.');
} else {
    console.log('Regex failed to match old history.');
}
