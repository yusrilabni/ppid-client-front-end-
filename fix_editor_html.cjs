const fs = require('fs');

function fixEditorContainer(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');

  // We need to find this malformed string:
  // <div v-else ref="editorContainer" class="relative w-full aspect-square mx-auto bg-gray-200 rounded-b-xl overflow-hidden shadow-inner checkerboard"
  //           
  //           <!-- Snapping Guides -->

  const badString = `<div v-else ref="editorContainer" class="relative w-full aspect-square mx-auto bg-gray-200 rounded-b-xl overflow-hidden shadow-inner checkerboard"`;
  
  if (content.includes(badString)) {
    const fixedString = `<div v-else ref="editorContainer" class="relative w-full aspect-square mx-auto bg-gray-200 rounded-b-xl overflow-hidden shadow-inner checkerboard"
               :class="{ 'ring-4 ring-blue-500 bg-blue-50': isDragOverCanvas }"
               @dragover.prevent="isDragOverCanvas = true"
               @dragleave.prevent="isDragOverCanvas = false"
               @drop.prevent="handleCanvasDrop"
               @click="deselectAll">`;
               
    // The previous replace removed everything up to ">", meaning it deleted the events and the ">".
    // Wait, let's see exactly what follows `checkerboard"` in the current file.
    content = content.replace(badString, fixedString);
    fs.writeFileSync(filepath, content);
    console.log('Fixed ' + filepath);
  } else {
    console.log('Not found in ' + filepath);
  }
}

fixEditorContainer('pages/twibbon/[slug].vue');
fixEditorContainer('pages/admin/twibbon/[slug]/index.vue');
