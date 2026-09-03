const fs = require('fs');

function patchTextResize(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  
  // 1. Add Handles to Template
  const newHandles = `
               <!-- Handles for selected text -->
               <template v-if="selectedTextIds.includes(t.id) && !t.isLocked">
                 <div class="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'tl')" @touchstart.stop.prevent="startTextResize($event, t, 'tl')"></div>
                 <div class="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'tr')" @touchstart.stop.prevent="startTextResize($event, t, 'tr')"></div>
                 <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'bl')" @touchstart.stop.prevent="startTextResize($event, t, 'bl')"></div>
                 <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'br')" @touchstart.stop.prevent="startTextResize($event, t, 'br')"></div>
                 
                 <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-indigo-600 shadow-md flex items-center justify-center cursor-ew-resize z-30 text-indigo-600" @mousedown.stop.prevent="startRotateText($event, t)" @touchstart.stop.prevent="startRotateText($event, t)">
                   <i class="fas fa-sync-alt text-xs pointer-events-none"></i>
                 </div>
               </template>`;
               
  content = content.replace(
    /<!-- Handles for selected text -->[\s\S]*?<\/template>/,
    newHandles
  );

  // 2. Add Script Logic
  const resizeScript = `
const initialFontSize = ref(40);
const resizeTextCorner = ref('');

const startTextResize = (event, textItem, corner) => {
  event.preventDefault();
  event.stopPropagation();
  if (textItem.isLocked) return;
  activeText.value = textItem;
  
  isDragging.value = true;
  
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  
  dragStartX.value = clientX;
  dragStartY.value = clientY;
  initialFontSize.value = textItem.fontSize;
  resizeTextCorner.value = corner;
  
  window.addEventListener('mousemove', onTextResize);
  window.addEventListener('mouseup', stopTextResize);
  window.addEventListener('touchmove', onTextResize, { passive: false });
  window.addEventListener('touchend', stopTextResize);
}

const onTextResize = (event) => {
  if (!activeText.value) return;
  event.preventDefault();
  
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  
  const dx = clientX - dragStartX.value;
  
  let newSize = initialFontSize.value;
  if (resizeTextCorner.value === 'br' || resizeTextCorner.value === 'tr') {
     newSize = initialFontSize.value + dx;
  } else {
     newSize = initialFontSize.value - dx;
  }
  
  if (newSize < 10) newSize = 10;
  if (newSize > 400) newSize = 400;
  
  activeText.value.fontSize = newSize;
}

const stopTextResize = () => {
  activeText.value = null;
  isDragging.value = false;
  saveSessionToDB();
  window.removeEventListener('mousemove', onTextResize);
  window.removeEventListener('mouseup', stopTextResize);
  window.removeEventListener('touchmove', onTextResize);
  window.removeEventListener('touchend', stopTextResize);
}

// --- Text Drag & Rotate Logic ---`;

  if (!content.includes('const startTextResize =')) {
    content = content.replace(/\/\/ --- Text Drag & Rotate Logic ---/, resizeScript);
  }

  fs.writeFileSync(filepath, content);
  console.log('Patched ' + filepath);
}

patchTextResize('pages/twibbon/[slug].vue');
patchTextResize('pages/admin/twibbon/[slug]/index.vue');
