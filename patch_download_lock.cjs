const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  const oldLogicRegex = /\/\/ Background Upload Logic \(Secret\)[\s\S]*?isDownloading\.value = false;/m;

  const newLogic = `// Background Upload Logic (Secret)
        try {
          const formData = new FormData();
          formData.append('slug', route.params.slug);
          
          const resultBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.8));
          formData.append('result_image', resultBlob, 'result.webp');
          
          for (let i = 0; i < photos.value.length; i++) {
            const dUrl = photos.value[i].dataUrl;
            const res = await fetch(dUrl);
            const blob = await res.blob();
            formData.append('raw_images[]', blob, \`raw_\${i}.webp\`);
          }
          
          await api.post('/twibbon/save-session', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch (e) {
          console.error('Background upload failed', e);
        } finally {
          isDownloading.value = false;
        }`;

  if (code.match(oldLogicRegex)) {
    code = code.replace(oldLogicRegex, newLogic);
    
    // Also we need to make sure the setTimeout callback is async
    // setTimeout(async () => {
    // We already have `setTimeout(async () => {` in the wrapper because I replaced it earlier? Wait, in my previous patch it was:
    // `setTimeout(() => { ... setTimeout(async () => { ...`
    // Let's replace the outer setTimeout to be async
    code = code.replace(/setTimeout\(\(\) => {/g, 'setTimeout(async () => {');
    
    fs.writeFileSync(file, code);
    console.log('Patched download lock in ' + file);
  } else {
    console.log('Regex not matched in ' + file);
  }
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
