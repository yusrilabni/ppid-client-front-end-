import fs from 'fs';

const FILE_PATH = 'pages/profil/pimpinan/[slug]/edit.vue';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Add refs
content = content.replace(
  "const official = ref(null)",
  "const official = ref(null)\nconst positions = ref([])\nconst organizations = ref([])"
);

// 2. Add to form ref
content = content.replace(
  "nip: '', birth_place: ''",
  "nip: '', position_id: '', status_jabatan: '', organization_id: '', email: '', start_term: '', end_term: '', birth_place: ''"
);

// 3. Populate in onMounted
content = content.replace(
  "official.value = res.data.official",
  "official.value = res.data.official\n        positions.value = res.data.positions || []\n        organizations.value = res.data.organizations || []"
);

// 4. Inject HTML
const HTML_FIELDS = `
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Jabatan Utama</label>
                <select v-model="form.position_id" required class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="" disabled>Pilih Jabatan</option>
                  <option v-for="pos in positions" :key="pos.id" :value="pos.id">{{ pos.name }}</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Jabatan</label>
                <select v-model="form.status_jabatan" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="" disabled>Pilih Status Jabatan</option>
                  <option value="Definitif">Definitif</option>
                  <option value="Penjabat (Pj)">Penjabat (Pj)</option>
                  <option value="Pelaksana Tugas (Plt)">Pelaksana Tugas (Plt)</option>
                  <option value="Pelaksana Harian (Plh)">Pelaksana Harian (Plh)</option>
                  <option value="Pejabat Sementara (Pjs)">Pejabat Sementara (Pjs)</option>
                </select>
              </div>

              <div v-if="positions.find(p => p.id == form.position_id)?.name === 'Kepala OPD'" class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">OPD / Organisasi</label>
                <select v-model="form.organization_id" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
                  <option value="" disabled>Pilih OPD</option>
                  <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input v-model="form.email" type="email" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mulai Menjabat</label>
                <input v-model="form.start_term" type="date" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Selesai Menjabat</label>
                <input v-model="form.end_term" type="date" class="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none font-bold text-gray-800 focus:ring-2 focus:ring-blue-500">
              </div>
`;

let parts = content.split('<label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tempat Lahir</label>');
if (parts.length > 1) {
    content = parts[0] + HTML_FIELDS + '\n              <div class="space-y-2">\n                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tempat Lahir</label>' + parts[1];
}

fs.writeFileSync(FILE_PATH, content);
console.log('Done');
