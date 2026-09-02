const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // Replace state
  code = code.replace('const selectedPhotoId = ref(null)', 'const selectedPhotoIds = ref([])');
  code = code.replace(
    'const selectedPhoto = computed(() => photos.value.find(p => p.id === selectedPhotoId.value) || null)',
    'const selectedPhotos = computed(() => photos.value.filter(p => selectedPhotoIds.value.includes(p.id)));\nconst selectedPhoto = computed(() => selectedPhotos.value[0] || null);'
  );

  // HTML updates
  code = code.replace(/selectedPhotoId !== photo\.id/g, '!selectedPhotoIds.includes(photo.id)');
  code = code.replace(/selectedPhotoId === photo\.id/g, 'selectedPhotoIds.includes(photo.id)');
  code = code.replace(/v-if="selectedPhoto"/g, 'v-if="selectedPhotos.length > 0"');

  // Replace selectPhoto logic
  const oldSelect = `const selectPhoto = (id, e) => {
  selectedPhotoId.value = id
  const photo = photos.value.find(p => p.id === id)
  if (photo && !photo.isLocked) {
    startDrag(e, photo)
  }
}`;
  const newSelect = `const selectPhoto = (id, e) => {
  if (e && e.ctrlKey) {
    if (selectedPhotoIds.value.includes(id)) {
      selectedPhotoIds.value = selectedPhotoIds.value.filter(pid => pid !== id);
    } else {
      selectedPhotoIds.value.push(id);
    }
  } else {
    if (!selectedPhotoIds.value.includes(id)) {
      selectedPhotoIds.value = [id];
    }
  }
  const photo = photos.value.find(p => p.id === id);
  if (photo && !photo.isLocked) {
    startDrag(e, photo);
  }
}`;
  code = code.replace(oldSelect, newSelect);

  // Update deleteSelected
  const oldDel = `const deleteSelected = () => {
  if (selectedPhotoId.value) {
    photos.value = photos.value.filter(p => p.id !== selectedPhotoId.value)
    selectedPhotoId.value = null
  }
}`;
  const newDel = `const deleteSelected = () => {
  if (selectedPhotoIds.value.length > 0) {
    photos.value = photos.value.filter(p => !selectedPhotoIds.value.includes(p.id));
    selectedPhotoIds.value = [];
  }
}`;
  code = code.replace(oldDel, newDel);

  // Replace deselectAll logic
  code = code.replace('selectedPhotoId.value = null', 'selectedPhotoIds.value = []');
  
  // Update toggleLockSelected
  const oldLock = `const toggleLockSelected = () => {
  if (selectedPhoto.value) {
    selectedPhoto.value.isLocked = !selectedPhoto.value.isLocked
  }
}`;
  const newLock = `const toggleLockSelected = () => {
  const allLocked = selectedPhotos.value.every(p => p.isLocked);
  selectedPhotos.value.forEach(p => p.isLocked = !allLocked);
}`;
  code = code.replace(oldLock, newLock);

  // Update centerSelected
  const oldCenter = `const centerSelected = () => {
  if (selectedPhoto.value) {
    const containerSize = editorContainer.value?.clientWidth || 400
    selectedPhoto.value.x = (containerSize - selectedPhoto.value.width) / 2
    selectedPhoto.value.y = (containerSize - selectedPhoto.value.height) / 2
  }
}`;
  const newCenter = `const centerSelected = () => {
  const containerSize = editorContainer.value?.clientWidth || 400;
  selectedPhotos.value.forEach(p => {
    p.x = (containerSize - p.width) / 2;
    p.y = (containerSize - p.height) / 2;
  });
}`;
  code = code.replace(oldCenter, newCenter);

  // Interaction State - Initial values
  code = code.replace('let initialRotation = 0', 'let initialRotation = 0\nlet initialGroupStates = new Map()');

  // Update startDrag
  const oldStartDrag = `const startDrag = (e, photo) => {
  if (!photo || photo.isLocked) return
  
  if (e.touches && e.touches.length >= 2) {
    isPinching = true
    initialDistance = getPinchDistance(e)
    initialPosX = photo.x
    initialPosY = photo.y
    startImgWidth = photo.width
    startImgHeight = photo.height
    addWindowListeners()
    return
  }

  isDragging = true
  const coords = getClientCoords(e)
  startX = coords.x
  startY = coords.y
  initialPosX = photo.x
  initialPosY = photo.y
  addWindowListeners()
}`;
  const newStartDrag = `const startDrag = (e, targetPhoto) => {
  const activePhotos = selectedPhotos.value.filter(p => !p.isLocked);
  if (activePhotos.length === 0) return;
  
  initialGroupStates.clear();
  activePhotos.forEach(p => {
    initialGroupStates.set(p.id, { x: p.x, y: p.y, width: p.width, height: p.height, rotation: p.rotation });
  });

  if (e.touches && e.touches.length >= 2) {
    isPinching = true;
    initialDistance = getPinchDistance(e);
    initialPosX = targetPhoto.x;
    initialPosY = targetPhoto.y;
    startImgWidth = targetPhoto.width;
    startImgHeight = targetPhoto.height;
    addWindowListeners();
    return;
  }

  isDragging = true;
  const coords = getClientCoords(e);
  startX = coords.x;
  startY = coords.y;
  initialPosX = targetPhoto.x;
  initialPosY = targetPhoto.y;
  addWindowListeners();
}`;
  code = code.replace(oldStartDrag, newStartDrag);

  // Update startResize
  const oldStartResize = `const startResize = (e, corner) => {
  if (!selectedPhoto.value || selectedPhoto.value.isLocked) return
  isResizing = true
  resizeCorner = corner
  const coords = getClientCoords(e)
  startX = coords.x
  startY = coords.y
  initialPosX = selectedPhoto.value.x
  initialPosY = selectedPhoto.value.y
  startImgWidth = selectedPhoto.value.width
  startImgHeight = selectedPhoto.value.height
  addWindowListeners()
}`;
  const newStartResize = `const startResize = (e, corner) => {
  const activePhotos = selectedPhotos.value.filter(p => !p.isLocked);
  if (activePhotos.length === 0) return;
  isResizing = true;
  resizeCorner = corner;
  const coords = getClientCoords(e);
  startX = coords.x;
  startY = coords.y;
  initialGroupStates.clear();
  activePhotos.forEach(p => {
    initialGroupStates.set(p.id, { x: p.x, y: p.y, width: p.width, height: p.height, rotation: p.rotation, aspectRatio: p.aspectRatio });
  });
  addWindowListeners();
}`;
  code = code.replace(oldStartResize, newStartResize);

  // Update startRotate
  const oldStartRotate = `const startRotate = (e) => {
  if (!selectedPhoto.value || selectedPhoto.value.isLocked) return
  isRotating = true
  const coords = getClientCoords(e)
  startX = coords.x
  startY = coords.y
  initialRotation = selectedPhoto.value.rotation
  addWindowListeners()
}`;
  const newStartRotate = `const startRotate = (e) => {
  const activePhotos = selectedPhotos.value.filter(p => !p.isLocked);
  if (activePhotos.length === 0) return;
  isRotating = true;
  const coords = getClientCoords(e);
  startX = coords.x;
  startY = coords.y;
  initialGroupStates.clear();
  activePhotos.forEach(p => {
    initialGroupStates.set(p.id, { x: p.x, y: p.y, width: p.width, height: p.height, rotation: p.rotation });
  });
  initialRotation = activePhotos[0].rotation;
  addWindowListeners();
}`;
  code = code.replace(oldStartRotate, newStartRotate);

  // Replace onDrag
  const oldOnDrag = `const onDrag = (e) => {
  const photo = selectedPhoto.value
  if (!photo || photo.isLocked) return

  if (isPinching && e.touches && e.touches.length >= 2) {
    if (e.cancelable) e.preventDefault()
    const currentDistance = getPinchDistance(e)
    const scale = currentDistance / initialDistance
    
    let newW = startImgWidth * scale
    if (newW < 50) newW = 50
    const newH = newW / photo.aspectRatio
    
    const dx = (newW - startImgWidth) / 2
    const dy = (newH - startImgHeight) / 2
    
    photo.width = newW
    photo.height = newH
    photo.x = initialPosX - dx
    photo.y = initialPosY - dy
    return
  }

  if (!isDragging && !isResizing && !isRotating) return
  if (e.cancelable) e.preventDefault()
  
  const coords = getClientCoords(e)
  const dx = coords.x - startX
  const dy = coords.y - startY
  
  if (isDragging) {
    let newX = initialPosX + dx
    let newY = initialPosY + dy
    
    const containerSize = editorContainer.value?.clientWidth || 400
    const centerX = containerSize / 2
    const centerY = containerSize / 2
    
    const imgCenterX = newX + photo.width / 2
    const imgCenterY = newY + photo.height / 2
    
    if (Math.abs(imgCenterX - centerX) < 8) {
      newX = centerX - photo.width / 2
      isSnappedX.value = true
    } else {
      isSnappedX.value = false
    }
    
    if (Math.abs(imgCenterY - centerY) < 8) {
      newY = centerY - photo.height / 2
      isSnappedY.value = true
    } else {
      isSnappedY.value = false
    }
    
    photo.x = newX
    photo.y = newY
  } 
  else if (isResizing) {
    let newW = startImgWidth
    
    if (resizeCorner === 'br') {
      newW = startImgWidth + dx
    } else if (resizeCorner === 'bl') {
      newW = startImgWidth - dx
    } else if (resizeCorner === 'tr') {
      newW = startImgWidth + dx
    } else if (resizeCorner === 'tl') {
      newW = startImgWidth - dx
    }
    
    if (newW < 50) newW = 50
    const newH = newW / photo.aspectRatio
    
    if (resizeCorner === 'bl' || resizeCorner === 'tl') {
      photo.x = initialPosX + (startImgWidth - newW)
    }
    if (resizeCorner === 'tr' || resizeCorner === 'tl') {
      photo.y = initialPosY + (startImgHeight - newH)
    }
    
    photo.width = newW
    photo.height = newH
  }
  else if (isRotating) {
    let newRotation = initialRotation + dx * 0.5
    let rawDeg = newRotation % 360
    if (rawDeg < 0) rawDeg += 360
    const snapAngles = [0, 45, 90, 180, 270, 360]
    for (let angle of snapAngles) {
      if (Math.abs(rawDeg - angle) < 5 || Math.abs(rawDeg - angle) > 355) {
        newRotation = newRotation - rawDeg + (angle === 360 ? 0 : angle)
        break
      }
    }
    photo.rotation = newRotation
    currentDegreeDisplay.value = Math.round(newRotation % 360)
  }
}`;

  const newOnDrag = `const onDrag = (e) => {
  const activePhotos = selectedPhotos.value.filter(p => !p.isLocked);
  if (activePhotos.length === 0) return;

  if (isPinching && e.touches && e.touches.length >= 2) {
    if (e.cancelable) e.preventDefault();
    const currentDistance = getPinchDistance(e);
    const scale = currentDistance / initialDistance;
    
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      if (!state) return;
      let newW = state.width * scale;
      if (newW < 50) newW = 50;
      const newH = newW / state.aspectRatio;
      const dxP = (newW - state.width) / 2;
      const dyP = (newH - state.height) / 2;
      photo.width = newW;
      photo.height = newH;
      photo.x = state.x - dxP;
      photo.y = state.y - dyP;
    });
    return;
  }

  if (!isDragging && !isResizing && !isRotating) return;
  if (e.cancelable) e.preventDefault();
  
  const coords = getClientCoords(e);
  const dx = coords.x - startX;
  const dy = coords.y - startY;
  
  if (isDragging) {
    const target = activePhotos[0];
    const targetState = initialGroupStates.get(target.id);
    let newX = targetState.x + dx;
    let newY = targetState.y + dy;
    
    const containerSize = editorContainer.value?.clientWidth || 400;
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    
    let snappedDx = dx;
    let snappedDy = dy;

    if (Math.abs((newX + target.width/2) - centerX) < 8) {
      snappedDx = (centerX - target.width/2) - targetState.x;
      isSnappedX.value = true;
    } else {
      isSnappedX.value = false;
    }
    if (Math.abs((newY + target.height/2) - centerY) < 8) {
      snappedDy = (centerY - target.height/2) - targetState.y;
      isSnappedY.value = true;
    } else {
      isSnappedY.value = false;
    }
    
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      photo.x = state.x + snappedDx;
      photo.y = state.y + snappedDy;
    });
  } 
  else if (isResizing) {
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      let newW = state.width;
      if (resizeCorner === 'br' || resizeCorner === 'tr') newW = state.width + dx;
      if (resizeCorner === 'bl' || resizeCorner === 'tl') newW = state.width - dx;
      if (newW < 50) newW = 50;
      
      const newH = newW / state.aspectRatio;
      
      if (resizeCorner === 'bl' || resizeCorner === 'tl') {
        photo.x = state.x + (state.width - newW);
      }
      if (resizeCorner === 'tr' || resizeCorner === 'tl') {
        photo.y = state.y + (state.height - newH);
      }
      
      photo.width = newW;
      photo.height = newH;
    });
  }
  else if (isRotating) {
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      let newRotation = state.rotation + dx * 0.5;
      let rawDeg = newRotation % 360;
      if (rawDeg < 0) rawDeg += 360;
      const snapAngles = [0, 45, 90, 180, 270, 360];
      for (let angle of snapAngles) {
        if (Math.abs(rawDeg - angle) < 5 || Math.abs(rawDeg - angle) > 355) {
          newRotation = newRotation - rawDeg + (angle === 360 ? 0 : angle);
          break;
        }
      }
      photo.rotation = newRotation;
      if (photo.id === activePhotos[0].id) currentDegreeDisplay.value = Math.round(newRotation % 360);
    });
  }
}`;
  code = code.replace(oldOnDrag, newOnDrag);

  fs.writeFileSync(file, code);
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
console.log('Patched multi-select successfully!');
