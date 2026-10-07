export const DEFAULT_BASE_URL = 'https://tasnif.soliq.uz/api/cls-api'
export const DEFAULT_TIMEOUT = 10_000

/**
 * Thrown when the API responds with an HTTP error, a non-JSON body
 * or `success: false`. Network errors, timeouts and aborts are passed
 * through as is (`TypeError`, `TimeoutError`, `AbortError`).
 */
export class MxikError extends Error {
  override name = 'MxikError'

  constructor(
    message: string,
    /** HTTP status of the response. */
    public status: number,
    /** `reason` field from the API envelope, if any. */
    public reason?: string,
    options?: ErrorOptions,
  ) {
    super(message, options)
  }
}

export interface HttpConfig {
  baseURL: string
  timeout: number
  fetch: typeof globalThis.fetch
  headers?: Record<string, string>
}

export type Query = Record<string, string | number | undefined>

/** API envelope, only the fields we rely on. */
export interface Envelope<T> {
  success: boolean
  code: number
  reason: string
  data: T | null
  recordTotal?: number
}

export interface SpringPage<T> {
  content: T[]
  totalElements: number
  number: number
  size: number
  last: boolean
}

/** Performs a GET request and returns the parsed JSON body without inspecting the envelope. */
export async function request<T>(config: HttpConfig, path: string, query: Query = {}, signal?: AbortSignal): Promise<T> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined)
      params.set(key, String(value))
  }
  const qs = params.size ? `?${params}` : ''

  const signals = [signal, config.timeout > 0 ? AbortSignal.timeout(config.timeout) : undefined]
    .filter(s => s !== undefined)

  const response = await config.fetch(`${config.baseURL}${path}${qs}`, {
    headers: { accept: 'application/json', ...config.headers },
    signal: signals.length ? AbortSignal.any(signals) : undefined,
  })

  if (!response.ok)
    throw new MxikError(`HTTP ${response.status} ${response.statusText}`.trim(), response.status)

  try {
    return await response.json() as T
  }
  catch (cause) {
    if (cause instanceof DOMException && (cause.name === 'AbortError' || cause.name === 'TimeoutError'))
      throw cause
    throw new MxikError('Invalid JSON response', response.status, undefined, { cause })
  }
}
