import fs from 'fs';
const html = fs.readFileSync('../ppid_version2/resources/views/frontend/layouts/app.blade.php', 'utf8');

// The widget container HTML
let startIndex = html.indexOf('<div x-data="accessibilityWidget()"');
let endIndex = html.indexOf('<!-- JS Frameworks & Plugins -->', startIndex);
if (endIndex === -1) endIndex = html.indexOf('</body>', startIndex);

fs.writeFileSync('acc_extracted.txt', html.substring(startIndex, endIndex));
console.log('Extracted to acc_extracted.txt');
