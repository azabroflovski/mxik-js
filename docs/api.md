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

In-memory LRU cache with TTL. `cache: true` uses it with default options.

```ts
function createMemoryCache(options?: MemoryCacheOptions): MemoryCache

interface MemoryCacheOptions {
  ttl?: number // ms, default 1 hour
  max?: number // entries, default 500
}

interface MemoryCache extends MxikCache {
  delete: (key: string) => void
  clear: () => void
  readonly size: number
}
```

## `MxikCache`

What `createMxik({ cache })` accepts. Methods may be async.

```ts
interface MxikCache {
  get: (key: string) => unknown // undefined on a miss
  set: (key: string, value: unknown) => unknown
  clear: () => unknown // called by mxik.cache.clear()
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
