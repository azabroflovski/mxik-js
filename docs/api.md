# API Reference

## `createMxik(options?)`

Creates a client. Returns a plain object with the methods below.

```ts
function createMxik(options?: MxikOptions): Mxik
```

### Methods

```ts
interface Mxik {
  search: (query: string, options?: PageOptions) => Promise<Page<SearchItem>>
  searchAll: (query: string, options?: Omit<PageOptions, 'page'>) => AsyncGenerator<SearchItem>
  get: (code: string, options?: RequestOptions) => Promise<MxikDetails | null>
  filter: (filters: Filters, options?: PageOptions) => Promise<Page<CatalogItem>>
  filterAll: (filters: Filters, options?: Omit<PageOptions, 'page'>) => AsyncGenerator<CatalogItem>
  dvCert: (certNumber: string, options?: PageOptions) => Promise<Page<CatalogItem>>
  cache: {
    clear: () => Promise<void> // no-op when caching is off
  }
}
```

## `createMemoryCache(options?)`

In-memory LRU store, evicts the least recently used entry once `max` is reached. `cache: true` uses it under the hood, create it yourself to share one store between several clients or to read its `size`.

```ts
function createMemoryCache(options?: { max?: number }): MemoryCache // max defaults to 500

interface MemoryCache extends CacheStore {
  get: (key: string) => CacheEntry | undefined
  readonly size: number
}
```

```ts
interface CacheStore {
  get: (key: string) => CacheEntry | undefined | Promise<CacheEntry | undefined>
  set: (key: string, entry: CacheEntry) => unknown
  delete: (key: string) => unknown // called for expired entries
  clear: () => unknown // called by mxik.cache.clear()
}

interface CacheEntry {
  value: unknown
  expires: number // ms since epoch
}
```

## `isMxikCode(value)`

Checks that a value is a string of exactly 17 digits. Doesn't check that the code exists.

```ts
function isMxikCode(value: unknown): value is string
```

## `MxikError`

Thrown on HTTP errors, non-JSON responses and `success: false` from the API.

```ts
class MxikError extends Error {
  status: number // HTTP status
  reason?: string // `reason` from the API response
}
```

## Types

<<< @/../lib/types.ts

## Deprecated

`MxikClient`, `createMxikClient()`, `fetchByKeyword()`, `fetchByParams()`, `fetchByBrand()`, `fetchByBarcode()`, `fetchByCode()` and `fetchByDvCert()` return raw API responses and will be removed in 2.0. See the [migration guide](/guide/migration).

<<< @/../lib/legacy/types.ts
