const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // 1. Add isInteracting = ref(false)
  if (!code.includes('const isInteracting = ref(false)')) {
    code = code.replace('const isDragOverCanvas = ref(false)', 'const isDragOverCanvas = ref(false)\nconst isInteracting = ref(false)');
  }

  // 2. Hide toolbar
  // <div v-if="selectedPhotos.length > 0" class="absolute top-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl px-4 py-2 flex items-center gap-4 z-50 border border-gray-200" @click.stop>
  code = code.replace(
    'v-if="selectedPhotos.length > 0" class="absolute top-2',
    'v-if="selectedPhotos.length > 0 && !isInteracting" class="absolute top-2'
  );

  // 3. Hide handles
  // <template v-if="selectedPhotoIds.includes(photo.id) && !photo.isLocked">
  code = code.replace(
    'v-if="selectedPhotoIds.includes(photo.id) && !photo.isLocked"',
    'v-if="selectedPhotoIds.includes(photo.id) && !photo.isLocked && !isInteracting"'
  );

  // 4. Update interactions to set isInteracting = true
  code = code.replace(/isDragging = true;/g, 'isDragging = true;\n  isInteracting.value = true;');
  code = code.replace(/isResizing = true;/g, 'isResizing = true;\n  isInteracting.value = true;');
  code = code.replace(/isRotating = true;/g, 'isRotating = true;\n  isInteracting.value = true;');
  
  // Update pinch in startDrag (if any)
  code = code.replace(/isPinching = true;/g, 'isPinching = true;\n    isInteracting.value = true;');

  // 5. Update endInteraction
  code = code.replace(/isRotating = false/g, 'isRotating = false\n  isInteracting.value = false');

  // 6. Fix rotation mirrored math and degrees in onDrag
  // Replace: let newRotation = state.rotation + dx * 0.5;
  // With: let newRotation = state.rotation - dx * 0.5;
  code = code.replace(/let newRotation = state\.rotation \+ dx \* 0\.5;/g, 'let newRotation = state.rotation + dx * 0.5; // Changed to minus logic below');
  
  // Replace the entire rotation block logic in onDrag
  const oldRotateLogic = `else if (isRotating) {
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      let newRotation = state.rotation + dx * 0.5; // Changed to minus logic below
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
  }`;
  
  const newRotateLogic = `else if (isRotating) {
    activePhotos.forEach(photo => {
      const state = initialGroupStates.get(photo.id);
      let newRotation = state.rotation + dx * 0.5; // Switched to positive logic based on mouse movement towards right. But wait! The handle is at the bottom, so moving right (dx > 0) should turn it counter-clockwise? No, moving right means spinning the bottom to the right, which is counter-clockwise (negative). 
      // User says: "miroro saya gerakin kekiri kok mutarnya kekkanan". If handle is at bottom, drag left (dx < 0), wheel turns clockwise (positive).
      // So dx < 0 should result in positive rotation.
      newRotation = state.rotation - dx * 0.5;
      
      let rawDeg = newRotation % 360;
      if (rawDeg < 0) rawDeg += 360;
      const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
      for (let angle of snapAngles) {
        if (Math.abs(rawDeg - angle) < 5 || Math.abs(rawDeg - angle) > 355) {
          newRotation = newRotation - rawDeg + (angle === 360 ? 0 : angle);
          break;
        }
      }
      photo.rotation = newRotation;
      
      if (photo.id === activePhotos[0].id) {
        let displayDeg = Math.round(newRotation % 360);
        if (displayDeg > 180) displayDeg -= 360;
        if (displayDeg <= -180) displayDeg += 360;
        currentDegreeDisplay.value = displayDeg > 0 ? '+' + displayDeg : displayDeg;
      }
    });
  }`;

  // wait, the old string might just have `state.rotation + dx * 0.5;` without the comment yet. Let's do it clean:
  const exactOldBlock = `else if (isRotating) {
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
  }`;

  code = code.replace(exactOldBlock, newRotateLogic);

  fs.writeFileSync(file, code);
  console.log('Patched ' + file);
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
