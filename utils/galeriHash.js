// Hash link detail Galeri — SAMA PERSIS dengan GeneralHelper::encodeId/decodeId
// backend (salt 778899, encoded = base_convert((id + salt) * 3, 10, 36),
// huruf besar). Ini obfuskasi, BUKAN enkripsi rahasia: tujuannya supaya
// link detail tidak menampilkan id numerik mentah dan tidak bisa ditebak
// berurutan secara kasat mata. Data Galeri sendiri memang publik.
export const GALERI_HASH_SALT = 778899

export function encodeGaleriId(id) {
  const n = Number(id)
  if (!Number.isInteger(n) || n <= 0) return null
  return ((n + GALERI_HASH_SALT) * 3).toString(36).toUpperCase()
}

export function decodeGaleriHash(hash) {
  if (typeof hash !== 'string') return null
  const h = hash.trim().toUpperCase()
  if (!/^[0-9A-Z]+$/.test(h)) return null
  const parsed = parseInt(h, 36)
  if (!Number.isFinite(parsed) || parsed % 3 !== 0) return null
  const id = parsed / 3 - GALERI_HASH_SALT
  if (!Number.isInteger(id) || id <= 0) return null
  return id
}

export function isNumericGaleriParam(param) {
  return /^\d+$/.test(String(param || ''))
}
