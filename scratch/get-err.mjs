import fetch from 'node-fetch';

fetch('http://localhost:3000/standar-layanan/file/pengumuman')
  .then(r => r.text())
  .then(t => {
    const match = t.match(/<div class="description">(.*?)<\/div>/s);
    if (match) {
      console.log(match[1]);
    } else {
      console.log('No description found.');
      const scriptMatch = t.match(/<script>window\.__NUXT__=(.*?)<\/script>/s);
      if (scriptMatch) {
        console.log(scriptMatch[1].substring(0, 1000));
      } else {
        console.log(t.substring(0, 1000));
      }
    }
  });
