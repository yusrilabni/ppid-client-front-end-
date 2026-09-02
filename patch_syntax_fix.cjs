const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // Fix the invalid escaped quotes in the class binding
  code = code.replace(/<div :class="\{ \\"opacity-0\\": isInteracting \}">/g, '<div :class="{ \\'opacity-0\\': isInteracting }">');

  fs.writeFileSync(file, code);
  console.log('Fixed syntax error in ' + file);
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
