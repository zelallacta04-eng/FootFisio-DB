import {
  NOCODB_URL, NOCODB_BASE_ID, NOCODB_TABLE_ID, NOCODB_API_TOKEN
} from '../nocodb.config'

const base = `${NOCODB_URL}/api/v3/data/${NOCODB_BASE_ID}/${NOCODB_TABLE_ID}/records`
export const NOCODB_CONFIGURADO = Boolean(
  NOCODB_BASE_ID && NOCODB_TABLE_ID && NOCODB_API_TOKEN &&
  !NOCODB_BASE_ID.startsWith('REEMPLAZAR') &&
  !NOCODB_TABLE_ID.startsWith('REEMPLAZAR') &&
  !NOCODB_API_TOKEN.startsWith('REEMPLAZAR')
)

async function request(url: string, init: RequestInit = {}) {
  if (!NOCODB_CONFIGURADO) throw new Error('Completa src/nocodb.config.ts con los datos de NocoDB Cloud.')
  const response = await fetch(url, {
    ...init,
    headers: {
      'xc-token': NOCODB_API_TOKEN,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = body?.msg || body?.message || body?.error || `Error HTTP ${response.status}`
    throw new Error(`NocoDB: ${message}`)
  }
  return body
}

export async function cargarDatos(): Promise<Record<string, unknown[]>> {
  if (!NOCODB_CONFIGURADO) return {}
  const result = await request(`${base}?pageSize=100`)
  const data: Record<string, unknown[]> = {}
  for (const row of result.records || []) {
    const tipo = row.fields?.tipo
    const raw = row.fields?.datos_json
    if (typeof tipo === 'string' && typeof raw === 'string') {
      try { data[tipo] = JSON.parse(raw) } catch { console.warn(`No se pudo interpretar el módulo ${tipo}`) }
    }
  }
  return data
}

const colasGuardado = new Map<string, Promise<void>>()

export async function guardarDatos(tipo: string, registros: unknown[]): Promise<void> {
  if (!NOCODB_CONFIGURADO) return
  const anterior = colasGuardado.get(tipo) || Promise.resolve()
  const actual = anterior.catch(() => undefined).then(async () => {
    await request(`${base}/upsert`, {
      method: 'POST',
      body: JSON.stringify({
        fieldsToMergeOn: ['tipo'],
        records: { fields: { tipo, datos_json: JSON.stringify(registros) } }
      })
    })
  })
  colasGuardado.set(tipo, actual)
  await actual
}
