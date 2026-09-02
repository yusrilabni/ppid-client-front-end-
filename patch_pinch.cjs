const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // Replace initialGroupStates.set missing aspectRatio
  // There are a few instances of this.
  
  // 1. In startDrag
  code = code.replace(
    /initialGroupStates\.set\(p\.id, \{ x: p\.x, y: p\.y, width: p\.width, height: p\.height, rotation: p\.rotation \}\);/g,
    'initialGroupStates.set(p.id, { x: p.x, y: p.y, width: p.width, height: p.height, rotation: p.rotation, aspectRatio: p.aspectRatio });'
  );

  // 2. In startRotate (if any missed)
  // Actually the regex above matches globally, so it will replace it everywhere it exactly matches that string without aspectRatio.

  // 3. Double check if any `newH` calculates NaN
  // In pinch logic:
  // const newH = newW / state.aspectRatio;
  // Let's add a fallback just in case state.aspectRatio is falsy for some reason (e.g. 0 or undefined).
  // const newH = newW / (state.aspectRatio || (state.width / state.height));
  code = code.replace(
    /const newH = newW \/ state\.aspectRatio;/g,
    'const newH = newW / (state.aspectRatio || (state.width / state.height));'
  );

  fs.writeFileSync(file, code);
  console.log('Patched pinch bug in ' + file);
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
