const fs = require('fs');

function patch(file) {
  let code = fs.readFileSync(file, 'utf8');

  // Fix processFile push
  code = code.replace(
    /photos\.value\.push\(newPhoto\)/g,
    'photos.value.push(newPhoto);\n      saveSessionToDB();'
  );

  fs.writeFileSync(file, code);
  console.log('Patched push bug in ' + file);
}

patch('./pages/twibbon/[slug].vue');
patch('./pages/admin/twibbon/[slug]/index.vue');
