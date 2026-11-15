// La configuración se inyecta durante la compilación en Cloudflare Pages.
// En Cloudflare: Settings > Environment variables (Production).
export const NOCODB_URL = import.meta.env.VITE_NOCODB_URL || 'https://app.nocodb.com'
export const NOCODB_BASE_ID = import.meta.env.VITE_NOCODB_BASE_ID || ''
export const NOCODB_TABLE_ID = import.meta.env.VITE_NOCODB_TABLE_ID || ''
export const NOCODB_API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN || ''
