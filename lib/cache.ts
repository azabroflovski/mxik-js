/**
 * Cache implementation for `createMxik({ cache })`. Expiration is up to the
 * implementation. Every method may return a promise, so Redis or KV fit too.
 */
export interface MxikCache {
  /** Returns `undefined` on a miss. `null` is a valid cached value (code not found). */
  get: (key: string) => unknown
  set: (key: string, value: unknown) => unknown
  delete: (key: string) => unknown
  /** Called by `mxik.cache.clear()`. A shared cache should remove only the client's entries. */
  clear: () => unknown
}

export interface MemoryCacheOptions {
  /** Time to live in ms. @default 3_600_000 (1 hour) */
  ttl?: number
  /** Max entries, the least recently used one is evicted beyond that. @default 500 */
  max?: number
}

export interface MemoryCache extends MxikCache {
  delete: (key: string) => void
  clear: () => void
  readonly size: number
}

/**
 * In-memory LRU cache with TTL. `cache: true` uses it with default options.
 *
 * @example
 * const mxik = createMxik({ cache: createMemoryCache({ ttl: 10 * 60 * 1000, max: 2000 }) })
 */
export function createMemoryCache({ ttl = 60 * 60 * 1000, max = 500 }: MemoryCacheOptions = {}): MemoryCache {
  const entries = new Map<string, { value: unknown, expires: number }>()

  return {
    get(key) {
      const entry = entries.get(key)
      if (!entry)
        return undefined
      entries.delete(key)
      if (entry.expires <= Date.now())
        return undefined
      // Map keeps insertion order, re-inserting moves the key to the "recent" end
      entries.set(key, entry)
      return entry.value
    },
    set(key, value) {
      entries.delete(key)
      entries.set(key, { value, expires: Date.now() + ttl })
      if (entries.size > max)
        entries.delete(entries.keys().next().value!)
    },
    delete(key) {
      entries.delete(key)
    },
    clear: () => entries.clear(),
    get size() {
      return entries.size
    },
  }
}
