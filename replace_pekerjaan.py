import re

with open('pages/laporan/permohonan/create.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace template
old_template = '''                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Pekerjaan
                            </label>
                            <div class="relative group">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-briefcase text-sm"></i>
                                </span>
                                <input v-model="form.pekerjaan" type="text"
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Contoh: PNS, Swasta, Pelajar">
                            </div>
                        </div>'''

new_template = '''                        <div class="space-y-1.5">
                            <label class="block text-xs md:text-sm font-semibold text-gray-700">
                                Pekerjaan
                            </label>
                            <CustomSelect 
                                v-model="selectedPekerjaan" 
                                :options="pekerjaanOptions" 
                                searchable 
                                placeholder="Pilih Pekerjaan..." 
                            />
                            
                            <!-- Input manual jika memilih Lainnya -->
                            <div v-if="selectedPekerjaan === 'Lainnya'" class="mt-3 relative group animate-fade-in-down">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <i class="fas fa-briefcase text-sm"></i>
                                </span>
                                <input v-model="customPekerjaan" type="text"
                                    class="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Ketik pekerjaan Anda di sini...">
                            </div>
                        </div>'''

content = content.replace(old_template, new_template)

# 2. Add reactive vars
script_add = '''const units = ref([])
const pekerjaanOptions = ref([])
const selectedPekerjaan = ref('')
const customPekerjaan = ref('')'''
content = content.replace("const units = ref([])", script_add)

# 3. Add fetch logic in onMounted
mount_add = '''  try {
    const resPekerjaan = await api.get('/pekerjaan')
    pekerjaanOptions.value = [...(resPekerjaan.data?.data || resPekerjaan.data || []), 'Lainnya']
  } catch (e) {
    pekerjaanOptions.value = ['ASN / Pegawai Negeri', 'Karyawan Swasta', 'Pelajar / Mahasiswa', 'Lainnya']
  }'''
content = content.replace("  try {\n    const res = await api.get('/units')", mount_add + "\n\n  try {\n    const res = await api.get('/units')")

# 4. Handle auto-fill logic for dropdown
autofill_old = "form.value.pekerjaan = authStore.user.nip ? 'ASN / Pegawai Negeri' : ''"
autofill_new = "selectedPekerjaan.value = authStore.user.nip ? 'ASN / Pegawai Negeri' : ''"
content = content.replace(autofill_old, autofill_new)

# 5. Handle submit form
submit_old = "const formData = new FormData()"
submit_new = '''const formData = new FormData()
    
    // Set form.pekerjaan based on dropdown selection
    form.value.pekerjaan = selectedPekerjaan.value === 'Lainnya' ? customPekerjaan.value : selectedPekerjaan.value'''
content = content.replace(submit_old, submit_new)

# 6. Handle reset
reset_old = "trackingCode.value = ''"
reset_new = "trackingCode.value = ''\n  customPekerjaan.value = ''"
content = content.replace(reset_old, reset_new)

with open('pages/laporan/permohonan/create.vue', 'w', encoding='utf-8') as f:
    f.write(content)
