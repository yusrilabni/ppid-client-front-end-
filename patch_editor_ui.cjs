const fs = require('fs');

function buildTopToolbar() {
  return `
        <!-- Area Editor -->
        <div class="w-full md:w-3/5 flex flex-col items-center relative">
          
          <!-- Top Canva-style Toolbar -->
          <div class="w-full bg-white border border-gray-200 rounded-t-xl p-2 flex items-center gap-3 shadow-sm overflow-x-auto whitespace-nowrap z-40 relative">
            <button @click="addText" class="px-3 py-1.5 hover:bg-gray-100 rounded text-gray-700 text-sm font-medium flex items-center gap-2" title="Tambah Teks"><i class="fas fa-font"></i></button>
            <label for="upload-photo-top" class="px-3 py-1.5 hover:bg-gray-100 rounded text-gray-700 text-sm font-medium flex items-center gap-2 cursor-pointer" title="Tambah Foto" :class="{ 'opacity-50 cursor-not-allowed': photos.length >= 10 }">
              <i class="fas fa-image"></i>
              <input v-if="photos.length < 10" id="upload-photo-top" type="file" class="hidden" accept="image/*" @change="handlePhotoUpload">
            </label>
            
            <div class="w-px h-6 bg-gray-300 mx-1 shrink-0"></div> <!-- Divider -->
            
            <template v-if="selectedPhotoIds.length > 0">
              <div class="flex items-center gap-3">
                <button @click="centerSelected" class="px-2 py-1.5 hover:bg-gray-100 rounded text-gray-700" title="Tengahkan Foto"><i class="fas fa-crosshairs"></i></button>
                <button @click="toggleLockSelected" class="px-2 py-1.5 hover:bg-gray-100 rounded" :class="selectedPhoto.isLocked ? 'text-orange-500' : 'text-gray-700'" title="Kunci/Buka"><i :class="selectedPhoto.isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i></button>
                <button @click="deleteSelected" class="px-2 py-1.5 hover:bg-red-50 text-red-500 rounded" title="Hapus Foto"><i class="fas fa-trash"></i></button>
                
                <div class="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  <i class="fas fa-tint text-gray-400 text-xs"></i>
                  <input type="range" min="0" max="20" step="0.5" v-model.number="selectedPhoto.blur" @change="saveSessionToDB" class="w-20" title="Efek Blur">
                </div>
              </div>
            </template>
            
            <template v-else-if="selectedTextIds.length > 0 && selectedText">
              <div class="flex items-center gap-3 shrink-0">
                <input type="text" v-model="selectedText.text" @change="saveSessionToDB" class="w-32 border border-gray-300 rounded text-sm px-2 py-1 placeholder-gray-400" placeholder="Isi teks...">
                
                <div class="flex items-center border border-gray-300 rounded bg-white">
                  <input type="number" min="10" max="400" v-model.number="selectedText.fontSize" @change="saveSessionToDB" class="w-16 border-0 text-sm px-2 py-1 text-center" title="Ukuran Font">
                </div>
                
                <div class="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                  <input type="color" v-model="selectedText.color" @change="saveSessionToDB" class="w-8 h-8 cursor-pointer border-0 p-0 rounded-none bg-transparent" title="Pilih Warna">
                  <input type="text" v-model="selectedText.color" @change="saveSessionToDB" class="w-20 border-0 text-sm px-2 uppercase font-mono text-gray-600" maxlength="7">
                  <button @click="pickColorForText(selectedText)" class="px-2 py-1 hover:bg-gray-100 border-l border-gray-200 text-gray-600" title="Pipet Warna Layar (Scope Color)"><i class="fas fa-eye-dropper"></i></button>
                </div>

                <button @click="selectedText.isLocked = !selectedText.isLocked" class="px-2 py-1.5 hover:bg-gray-100 rounded" :class="selectedText.isLocked ? 'text-orange-500' : 'text-gray-700'" title="Kunci/Buka"><i :class="selectedText.isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i></button>
                <button @click="deleteSelectedText" class="px-2 py-1.5 hover:bg-red-50 text-red-500 rounded" title="Hapus Teks"><i class="fas fa-trash"></i></button>
              </div>
            </template>
            
            <template v-else>
              <span class="text-xs text-gray-400 italic">Pilih foto/teks pada kanvas untuk mengedit...</span>
            </template>
          </div>
          
          <div v-if="loading" class="w-full aspect-square bg-gray-100 rounded-b-xl animate-pulse flex items-center justify-center">
            <i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
          </div>

          <div v-else ref="editorContainer" class="relative w-full aspect-square mx-auto bg-gray-200 rounded-b-xl overflow-hidden shadow-inner checkerboard"`;
}

function buildTextDOM() {
  return `
            <!-- Text Layers -->
            <div v-for="t in texts" :key="t.id"
                 class="absolute flex flex-col items-center justify-center pointer-events-auto"
                 :class="{ 'z-10': !selectedTextIds.includes(t.id), 'z-30': selectedTextIds.includes(t.id) }"
                 :style="{ 
                   transform: \`translate(calc(-50% + \${t.x}px), calc(-50% + \${t.y}px)) rotate(\${t.rotation}deg)\`,
                   cursor: t.isLocked ? 'not-allowed' : (isDragging && selectedTextIds.includes(t.id) ? 'grabbing' : 'grab'),
                   left: '50%', top: '50%'
                 }"
                 @mousedown.stop="selectText(t.id, $event); startTextDrag($event, t)"
                 @touchstart.stop="selectText(t.id, $event); startTextDrag($event, t)"
                 @click.stop>
                 
               <div :style="{ color: t.color, fontSize: t.fontSize + 'px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', whiteSpace: 'nowrap', padding: '4px', border: selectedTextIds.includes(t.id) ? '1px dashed rgba(255,255,255,0.7)' : '1px solid transparent' }" class="select-none pointer-events-none">
                 {{ t.text }}
               </div>
               
               <!-- Handles for selected text -->
               <template v-if="selectedTextIds.includes(t.id) && !t.isLocked">
                 <div class="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'tl')" @touchstart.stop.prevent="startTextResize($event, t, 'tl')"></div>
                 <div class="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'tr')" @touchstart.stop.prevent="startTextResize($event, t, 'tr')"></div>
                 <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nesw-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'bl')" @touchstart.stop.prevent="startTextResize($event, t, 'bl')"></div>
                 <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full border-4 border-indigo-600 shadow-md cursor-nwse-resize z-30" @mousedown.stop.prevent="startTextResize($event, t, 'br')" @touchstart.stop.prevent="startTextResize($event, t, 'br')"></div>
                 
                 <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-indigo-600 shadow-md flex items-center justify-center cursor-ew-resize z-30 text-indigo-600" @mousedown.stop.prevent="startRotateText($event, t)" @touchstart.stop.prevent="startRotateText($event, t)">
                   <i class="fas fa-sync-alt text-xs pointer-events-none"></i>
                 </div>
               </template>
            </div>
            
            <!-- Frame Twibbon`;
}

function patchFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // 1. Remove Sidebar Toolbar FIRST so we don't accidentally match it later
  // The sidebar toolbar we injected starts with `<button @click="addText"` and ends before `downloadTwibbon`
  const sidebarToolbarStart = content.indexOf('<button @click="addText"');
  if (sidebarToolbarStart !== -1) {
    const sidebarToolbarEnd = content.indexOf('<button \n              @click="downloadTwibbon"');
    if (sidebarToolbarEnd !== -1) {
      content = content.replace(content.substring(sidebarToolbarStart, sidebarToolbarEnd), '');
    }
  }

  // 2. Replace Top Area with Canva-style Top Bar
  const editorAreaStart = content.indexOf('<!-- Area Editor -->');
  const editorContainerStart = content.indexOf('<div v-else ref="editorContainer"', editorAreaStart);
  
  if (editorAreaStart !== -1 && editorContainerStart !== -1) {
    const endOfContainerDiv = content.indexOf('>', editorContainerStart) + 1;
    const toReplace = content.substring(editorAreaStart, endOfContainerDiv);
    content = content.replace(toReplace, buildTopToolbar());
  }

  // 3. Fix Text Bounding Box (remove translate(-50%, -50%) from inner div and put it in parent)
  const textDOMStart = content.indexOf('<!-- Text Layers -->');
  const frameTwibbonStart = content.indexOf('<!-- Frame Twibbon');
  if (textDOMStart !== -1 && frameTwibbonStart !== -1) {
    const oldTextDOM = content.substring(textDOMStart, frameTwibbonStart + '<!-- Frame Twibbon'.length);
    content = content.replace(oldTextDOM, buildTextDOM());
  }

  // 4. Add `const selectedText = computed(() => texts.value.find(t => selectedTextIds.value.includes(t.id)));`
  if (!content.includes('const selectedText = computed')) {
    content = content.replace('const selectedPhotos = computed', 'const selectedText = computed(() => texts.value.find(t => selectedTextIds.value.includes(t.id)));\nconst selectedPhotos = computed');
  }

  fs.writeFileSync(filepath, content);
  console.log('Patched UI for ' + filepath);
}

patchFile('pages/twibbon/[slug].vue');
patchFile('pages/admin/twibbon/[slug]/index.vue');
