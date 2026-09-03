const fs = require('fs');

function patchFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // --- 1. Add Text State ---
  if (!content.includes('const texts = ref([])')) {
    content = content.replace(
      /const photos = ref\(\[\]\)/,
      `const photos = ref([])\nconst texts = ref([])\nconst selectedTextIds = ref([])`
    );
  }

  // --- 2. Deselect All ---
  content = content.replace(
    /const deselectAll = \(\) => \{\n\s+selectedPhotoIds\.value = \[\]\n\s+\}/,
    `const deselectAll = () => {
  selectedPhotoIds.value = []
  selectedTextIds.value = []
}`
  );

  // --- 3. Selection Logic ---
  if (!content.includes('const selectText =')) {
    content = content.replace(
      /const selectPhoto = \(id, e\) => \{/,
      `const selectText = (id, event) => {
  selectedPhotoIds.value = []
  if (event && event.shiftKey) {
    if (selectedTextIds.value.includes(id)) {
      selectedTextIds.value = selectedTextIds.value.filter(i => i !== id)
    } else {
      selectedTextIds.value.push(id)
    }
  } else {
    selectedTextIds.value = [id]
  }
}

const selectPhoto = (id, e) => {
  selectedTextIds.value = []`
    );
  }

  // --- 4. Text Add & Delete Logic ---
  if (!content.includes('const addText =')) {
    content = content.replace(
      /const deleteSelected = \(\) => \{/,
      `const addText = () => {
  texts.value.push({ 
    id: Date.now(), 
    text: 'Teks Baru', 
    x: 0, 
    y: 0, 
    fontSize: 40, 
    color: '#ffffff', 
    rotation: 0, 
    isLocked: false 
  })
  selectedTextIds.value = [texts.value[texts.value.length - 1].id]
  selectedPhotoIds.value = []
  saveSessionToDB()
}

const deleteSelectedText = () => {
  texts.value = texts.value.filter(t => !selectedTextIds.value.includes(t.id))
  selectedTextIds.value = []
  saveSessionToDB()
}

const pickColorForText = async (textItem) => {
  if (!window.EyeDropper) {
    alert('Browser Anda tidak mendukung fitur Pipet Warna (EyeDropper).');
    return;
  }
  try {
    const dropper = new EyeDropper();
    const result = await dropper.open();
    textItem.color = result.sRGBHex;
    saveSessionToDB();
  } catch (e) {
    console.log('Eyedropper cancelled', e);
  }
}

const deleteSelected = () => {`
    );
  }

  // --- 5. Download Logic Updates (Draw Texts) ---
  const renderTextLogic = `      // Draw Texts
        for (const t of texts.value) {
          ctx.save();
          const finalXText = t.x * ratio;
          const finalYText = t.y * ratio;
          const imgCenterXText = (canvas.width / 2) + finalXText;
          const imgCenterYText = (canvas.height / 2) + finalYText;
          ctx.translate(imgCenterXText, imgCenterYText);
          ctx.rotate((t.rotation * Math.PI) / 180);
          ctx.font = \`bold \${t.fontSize * ratio}px Arial\`;
          ctx.fillStyle = t.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.text, 0, 0);
          ctx.restore();
        }

        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);`;
  
  content = content.replace(/ctx\.drawImage\(bgImg, 0, 0, canvas\.width, canvas\.height\);/, renderTextLogic);

  // --- 6. Template Updates: Remove Floating Toolbar ---
  content = content.replace(
    /<!-- Floating Toolbar \(Appears above the canvas when a photo is selected\) -->[\s\S]*?<\/div>\s*<div v-if="photos\.length > 0"/,
    `<div v-if="photos.length > 0 || texts.length > 0"`
  );

  // --- 7. Add Texts to Canvas DOM ---
  const textDOM = `
            <!-- Text Layers -->
            <div v-for="t in texts" :key="t.id"
                 class="absolute flex flex-col items-center justify-center pointer-events-auto"
                 :class="{ 'z-10': !selectedTextIds.includes(t.id), 'z-30': selectedTextIds.includes(t.id) }"
                 :style="{ 
                   transform: \`translate(\${t.x}px, \${t.y}px) rotate(\${t.rotation}deg)\`,
                   cursor: t.isLocked ? 'not-allowed' : (isDragging && selectedTextIds.includes(t.id) ? 'grabbing' : 'grab'),
                   left: '50%', top: '50%'
                 }"
                 @mousedown.stop.prevent="selectText(t.id, $event); startTextDrag($event, t)"
                 @touchstart.stop.prevent="selectText(t.id, $event); startTextDrag($event, t)"
                 @click.stop>
                 
               <div :style="{ color: t.color, fontSize: t.fontSize + 'px', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', transform: 'translate(-50%, -50%)', whiteSpace: 'nowrap' }" class="select-none pointer-events-none">
                 {{ t.text }}
               </div>
               
               <!-- Handles for selected text -->
               <template v-if="selectedTextIds.includes(t.id) && !t.isLocked">
                 <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-blue-600 shadow-md flex items-center justify-center cursor-ew-resize z-30 text-blue-600" @mousedown.stop.prevent="startRotateText($event, t)" @touchstart.stop.prevent="startRotateText($event, t)">
                   <i class="fas fa-sync-alt text-xs pointer-events-none"></i>
                 </div>
               </template>
            </div>
            
            <!-- Frame Twibbon`;
  content = content.replace(/<!-- Frame Twibbon/g, textDOM);

  // --- 8. Add Toolbar to Sidebar ---
  const sidebarToolbar = `
            <button @click="addText" class="w-full border-2 border-indigo-600 bg-white text-indigo-700 font-medium py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 mb-6 hover:bg-indigo-50 transition cursor-pointer">
              <i class="fas fa-font text-xl"></i>
              <span>Tambah Teks Baru</span>
            </button>

            <!-- Persistent Toolbar Panel -->
            <div class="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
              <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 border-b pb-2">
                <i class="fas fa-sliders-h"></i> Alat Edit
              </h4>
              
              <div v-if="selectedPhotoIds.length > 0" class="flex flex-col gap-3">
                <div class="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
                  <span class="text-xs font-semibold text-blue-700">Foto Terpilih</span>
                  <div class="flex gap-2">
                    <button @click="centerSelected" class="p-2 bg-white rounded shadow-sm text-blue-600 hover:bg-blue-100" title="Tengahkan"><i class="fas fa-crosshairs"></i></button>
                    <button @click="toggleLockSelected" class="p-2 bg-white rounded shadow-sm text-orange-600 hover:bg-orange-100" title="Kunci/Buka"><i :class="selectedPhoto.isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i></button>
                    <button @click="deleteSelected" class="p-2 bg-white rounded shadow-sm text-red-600 hover:bg-red-100" title="Hapus"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-600">Efek Blur</label>
                  <input type="range" min="0" max="20" step="0.5" v-model.number="selectedPhoto.blur" @change="saveSessionToDB" class="w-full">
                </div>
              </div>

              <div v-else-if="selectedTextIds.length > 0" class="flex flex-col gap-3">
                <div class="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                  <span class="text-xs font-semibold text-indigo-700">Teks Terpilih</span>
                  <div class="flex gap-2">
                    <button @click="texts.find(t=>t.id===selectedTextIds[0]).isLocked = !texts.find(t=>t.id===selectedTextIds[0]).isLocked" class="p-2 bg-white rounded shadow-sm text-orange-600 hover:bg-orange-100" title="Kunci/Buka"><i :class="texts.find(t=>t.id===selectedTextIds[0]).isLocked ? 'fas fa-lock' : 'fas fa-lock-open'"></i></button>
                    <button @click="deleteSelectedText" class="p-2 bg-white rounded shadow-sm text-red-600 hover:bg-red-100" title="Hapus"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-gray-600">Isi Teks</label>
                  <input type="text" v-model="texts.find(t=>t.id===selectedTextIds[0]).text" @change="saveSessionToDB" class="w-full border-gray-300 rounded-lg text-sm p-2">
                </div>
                <div class="flex gap-4">
                  <div class="flex flex-col gap-1 flex-1">
                    <label class="text-xs text-gray-600">Warna (Pilih / Pipet)</label>
                    <div class="flex gap-2">
                      <input type="color" v-model="texts.find(t=>t.id===selectedTextIds[0]).color" @change="saveSessionToDB" class="w-full h-8 rounded cursor-pointer border-0 p-0">
                      <button @click="pickColorForText(texts.find(t=>t.id===selectedTextIds[0]))" class="px-3 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-gray-700" title="Pipet Warna Layar (Scope Color)">
                        <i class="fas fa-eye-dropper"></i>
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-col gap-1 flex-1">
                    <label class="text-xs text-gray-600">Ukuran</label>
                    <input type="range" min="10" max="150" step="1" v-model.number="texts.find(t=>t.id===selectedTextIds[0]).fontSize" @change="saveSessionToDB" class="w-full">
                  </div>
                </div>
              </div>

              <div v-else class="py-4 text-center text-gray-400 text-sm">
                <i class="fas fa-hand-pointer block text-2xl mb-2 opacity-50"></i>
                Klik sebuah foto atau teks pada kanvas untuk memunculkan menu pengaturannya di sini.
              </div>
            </div>
            
            <button 
              @click="downloadTwibbon"`;
  content = content.replace(/<button [\s\S]*?@click="downloadTwibbon"/, sidebarToolbar);

  // --- 9. Add Text Drag & Rotate Logic ---
  const textDragLogic = `
// --- Text Drag & Rotate Logic ---
const activeText = ref(null)
const startTextDrag = (event, textItem) => {
  if (textItem.isLocked) return;
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  
  isDragging.value = true
  activeText.value = textItem
  
  dragStartX.value = clientX - textItem.x
  dragStartY.value = clientY - textItem.y
  
  window.addEventListener('mousemove', onTextDrag)
  window.addEventListener('mouseup', stopTextDrag)
  window.addEventListener('touchmove', onTextDrag, { passive: false })
  window.addEventListener('touchend', stopTextDrag)
}

const onTextDrag = (event) => {
  if (!isDragging.value || !activeText.value) return;
  event.preventDefault();
  
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  
  activeText.value.x = clientX - dragStartX.value
  activeText.value.y = clientY - dragStartY.value
}

const stopTextDrag = () => {
  isDragging.value = false
  activeText.value = null
  saveSessionToDB()
  window.removeEventListener('mousemove', onTextDrag)
  window.removeEventListener('mouseup', stopTextDrag)
  window.removeEventListener('touchmove', onTextDrag)
  window.removeEventListener('touchend', stopTextDrag)
}

const startRotateText = (event, textItem) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (textItem.isLocked) return;
  activeText.value = textItem;
  
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  
  const rect = editorContainer.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2 + textItem.x;
  const centerY = rect.top + rect.height / 2 + textItem.y;
  
  const radians = Math.atan2(clientY - centerY, clientX - centerX);
  initialRotation.value = textItem.rotation || 0;
  rotationStartAngle.value = radians;
  
  window.addEventListener('mousemove', onRotateText);
  window.addEventListener('mouseup', stopRotateText);
  window.addEventListener('touchmove', onRotateText, { passive: false });
  window.addEventListener('touchend', stopRotateText);
}

const onRotateText = (event) => {
  if (!activeText.value) return;
  event.preventDefault();
  
  const clientX = event.touches ? event.touches[0].clientX : event.clientX
  const clientY = event.touches ? event.touches[0].clientY : event.clientY
  
  const rect = editorContainer.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2 + activeText.value.x;
  const centerY = rect.top + rect.height / 2 + activeText.value.y;
  
  const radians = Math.atan2(clientY - centerY, clientX - centerX);
  const degreeDiff = (radians - rotationStartAngle.value) * (180 / Math.PI);
  
  let newRotation = (initialRotation.value + degreeDiff) % 360;
  if (newRotation < 0) newRotation += 360;
  
  // Snap to 45 degree increments
  const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  const snapThreshold = 5;
  for (const angle of snapAngles) {
    if (Math.abs(newRotation - angle) < snapThreshold || Math.abs(newRotation - (angle - 360)) < snapThreshold) {
      newRotation = angle === 360 ? 0 : angle;
      break;
    }
  }
  
  activeText.value.rotation = newRotation;
  currentDegreeDisplay.value = Math.round(newRotation);
}

const stopRotateText = () => {
  activeText.value = null;
  currentDegreeDisplay.value = null;
  saveSessionToDB();
  window.removeEventListener('mousemove', onRotateText);
  window.removeEventListener('mouseup', stopRotateText);
  window.removeEventListener('touchmove', onRotateText);
  window.removeEventListener('touchend', stopRotateText);
}

`;
  if (!content.includes('const startTextDrag')) {
    content = content.replace(/\/\/ --- Canvas Export Engine ---/, textDragLogic + '\n// --- Canvas Export Engine ---');
  }

  // --- 10. Fix state saving/loading ---
  content = content.replace(/photos: JSON\.parse\(JSON\.stringify\(photos\.value\)\)/g, `photos: JSON.parse(JSON.stringify(photos.value)), texts: JSON.parse(JSON.stringify(texts.value || []))`);
  
  if (!content.includes('texts.value = session.texts || []')) {
    content = content.replace(/photos\.value = session\.photos/g, `photos.value = session.photos\n        texts.value = session.texts || []`);
  }

  fs.writeFileSync(filepath, content);
  console.log('Patched ' + filepath);
}

patchFile('pages/twibbon/[slug].vue');
patchFile('pages/admin/twibbon/[slug]/index.vue');
