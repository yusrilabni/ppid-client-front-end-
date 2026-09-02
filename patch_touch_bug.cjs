const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // 1. Fix the template hiding logic to use opacity instead of v-if
  const oldTemplate = '<template v-if="selectedPhotoIds.includes(photo.id) && !photo.isLocked && !isInteracting">';
  const newTemplate = '<template v-if="selectedPhotoIds.includes(photo.id) && !photo.isLocked">\n<div :class="{ \\"opacity-0\\": isInteracting }">';
  
  if (code.includes(oldTemplate)) {
    code = code.replace(oldTemplate, newTemplate);
    code = code.replace(/<\/template>/, '</div>\n               </template>');
  }

  // 2. Fix the snap logic
  const oldSnapRegex = /let rawDeg = newRotation % 360;[\s\S]*?break;\s*}\s*}/m;
  const newSnapLogic = `let remainder = newRotation % 45;
      if (Math.abs(remainder) < 5) {
        newRotation -= remainder;
      } else if (Math.abs(remainder) > 40) {
        newRotation += (newRotation > 0 ? 45 - remainder : -45 - remainder);
      }`;
  
  code = code.replace(oldSnapRegex, newSnapLogic);
  
  // 3. Fix the display logic
  const oldDisplayRegex = /let displayDeg = Math\.round\(newRotation % 360\);[\s\S]*?currentDegreeDisplay\.value = displayDeg > 0 \? '\+' \+ displayDeg : displayDeg;/m;
  const newDisplayLogic = `let displayDeg = Math.round(newRotation) % 360;
        if (displayDeg === -0) displayDeg = 0;
        currentDegreeDisplay.value = displayDeg > 0 ? '+' + displayDeg : displayDeg;`;
        
  code = code.replace(oldDisplayRegex, newDisplayLogic);

  fs.writeFileSync(file, code);
  console.log('Patched touch handle bug and degree logic in ' + file);
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
