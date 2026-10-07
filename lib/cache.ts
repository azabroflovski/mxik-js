export interface CacheEntry {
  value: unknown
  /** Expiration time, ms since epoch. */
  expires: number
}

/**
 * Storage for cached results. `Map` fits as is, async stores (Redis, KV)
 * work too: every method may return a promise.
 */
export interface CacheStore {
  get: (key: string) => CacheEntry | undefined | Promise<CacheEntry | undefined>
  set: (key: string, entry: CacheEntry) => unknown
  delete: (key: string) => unknown
}

export interface MemoryCache extends CacheStore {
  get: (key: string) => CacheEntry | undefined
  clear: () => void
  readonly size: number
}

/**
 * In-memory LRU store: once `max` entries is reached, the least recently used one is evicted.
 *
 * @example
 * const cache = createMemoryCache({ max: 1000 })
 * const mxik = createMxik({ cache: { store: cache } })
 * cache.clear()
 */
export function createMemoryCache({ max = 500 }: { max?: number } = {}): MemoryCache {
  const entries = new Map<string, CacheEntry>()

  return {
    get(key) {
      const entry = entries.get(key)
      if (entry) {
        // Map keeps insertion order, re-inserting moves the key to the "recent" end
        entries.delete(key)
        entries.set(key, entry)
      }
      return entry
    },
    set(key, entry) {
      entries.delete(key)
      entries.set(key, entry)
      if (entries.size > max)
        entries.delete(entries.keys().next().value!)
    },
    delete: key => entries.delete(key),
    clear: () => entries.clear(),
    get size() {
      return entries.size
    },
  }
}
