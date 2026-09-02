const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // We need to inject the IndexedDB helper functions at the top of <script setup>
  const idbLogic = `
// --- IndexedDB Cache Logic ---
const DB_NAME = 'TwibbonCache';
const STORE_NAME = 'sessions';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const saveSessionToDB = async () => {
  if (!process.client) return;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const stateToSave = photos.value.map(p => ({
        id: p.id,
        dataUrl: p.dataUrl,
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height,
        rotation: p.rotation,
        blur: p.blur,
        isLocked: p.isLocked,
        aspectRatio: p.aspectRatio
      }));
      store.put(stateToSave, route.params.slug);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch(e) { console.error('IDB Save Error:', e); }
}

const loadSessionFromDB = async () => {
  if (!process.client) return;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(route.params.slug);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch(e) { console.error('IDB Load Error:', e); return null; }
}

const restoreSession = async () => {
  if (!process.client) return;
  const saved = await loadSessionFromDB();
  if (saved && saved.length > 0) {
    const restoredPhotos = [];
    for (const p of saved) {
      const imgObj = new Image();
      imgObj.src = p.dataUrl;
      await new Promise(resolve => {
        imgObj.onload = resolve;
        imgObj.onerror = resolve; // Continue even if one fails
      });
      restoredPhotos.push({
        ...p,
        imgObj
      });
    }
    photos.value = restoredPhotos;
  }
}
// -----------------------------
`;

  if (!code.includes('const DB_NAME = \'TwibbonCache\';')) {
    code = code.replace(/const route = useRoute\(\)/, `const route = useRoute()\n\n${idbLogic}`);
  }

  // Inject saveSessionToDB at explicit points
  // 1. In processFile (when a new photo is fully added)
  // photos.value.push({ ... });
  code = code.replace(/photos\.value\.push\(\{[\s\S]*?\}\)/g, (match) => {
    if (match.includes('imgObj')) {
      return match + ';\n      saveSessionToDB()';
    }
    return match;
  });

  // 2. In deleteSelected
  // const deleteSelected = () => { ... photos.value = photos.value.filter(...) ... }
  code = code.replace(/photos\.value = photos\.value\.filter\(p => !selectedPhotoIds\.value\.includes\(p\.id\)\)/g, 
                      'photos.value = photos.value.filter(p => !selectedPhotoIds.value.includes(p.id)); saveSessionToDB()');

  // 3. In endInteraction
  code = code.replace(/removeWindowListeners\(\)/g, 'removeWindowListeners()\n  saveSessionToDB()');

  // 4. In toggleLockSelected
  code = code.replace(/photo\.isLocked = !photo\.isLocked/g, 'photo.isLocked = !photo.isLocked;\n      saveSessionToDB()');

  // 5. Blur slider in template. Replace @input or v-model with @change listener
  // <input type="range" min="0" max="20" step="0.5" v-model.number="selectedPhoto.blur" class="w-20" title="Efek Blur">
  // We can just add @change="saveSessionToDB"
  code = code.replace(/v-model\.number="selectedPhoto\.blur" class="w-20" title="Efek Blur">/g, 
                      'v-model.number="selectedPhoto.blur" @change="saveSessionToDB" class="w-20" title="Efek Blur">');

  // 6. Restore on Mount
  // In onMounted(async () => {
  if (!code.includes('await restoreSession()')) {
    code = code.replace(/await fetchTwibbon\(\)/g, 'await fetchTwibbon()\n  await restoreSession()');
  }

  fs.writeFileSync(file, code);
  console.log('Patched IndexedDB cache into ' + file);
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
