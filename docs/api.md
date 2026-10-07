# API reference

## createMxik

```ts
function createMxik(options?: MxikOptions): Mxik
```

Creates a client. All options are described in [Client options](/guide/options).

## search

<!-- eslint-skip -->

```ts
mxik.search(
  query: string,
  options?: PageOptions,
): Promise<Page<SearchItem>>
```

Full-text search by name, brand, attributes or code. See [By keyword](/guide/searching#by-keyword).

## get

<!-- eslint-skip -->

```ts
mxik.get(
  code: string,
  options?: RequestOptions,
): Promise<MxikDetails | null>
```

Full card of a code, or `null` if it doesn't exist. See [A single code](/guide/searching#a-single-code).

## filter

<!-- eslint-skip -->

```ts
mxik.filter(
  filters: Filters,
  options?: PageOptions,
): Promise<Page<CatalogItem>>
```

Search by `text`, `brand`, `code` or `barcode`. See [By fields](/guide/searching#by-fields).

## dvCert

<!-- eslint-skip -->

```ts
mxik.dvCert(
  certNumber: string,
  options?: PageOptions,
): Promise<Page<CatalogItem>>
```

Codes linked to a certificate number. See [By certificate number](/guide/searching#by-certificate-number).

## searchAll, filterAll

<!-- eslint-skip -->

```ts
mxik.searchAll(
  query: string,
  options?: AllOptions,
): AsyncGenerator<SearchItem>

mxik.filterAll(
  filters: Filters,
  options?: AllOptions,
): AsyncGenerator<CatalogItem>

type AllOptions = Omit<PageOptions, 'page'>
```

Go through every page, requesting the next one as you iterate. See [All results](/guide/searching#all-results).

## cache.clear

<!-- eslint-skip -->

```ts
mxik.cache.clear(): Promise<void>
```

Removes cached results. Does nothing when the cache is off. See [Cache](/guide/cache).

## createMemoryCache

```ts
function createMemoryCache(options?: MemoryCacheOptions): MemoryCache

interface MemoryCacheOptions {
  ttl?: number // ms, default 1 hour
  max?: number // entries, default 500
}

interface MemoryCache extends MxikCache {
  readonly size: number
}
```

In-memory cache that evicts the least recently used entry beyond `max`. `cache: true` creates one with the defaults.

## MxikCache

```ts
interface MxikCache {
  get: (key: string) => unknown // undefined when missing
  set: (key: string, value: unknown) => unknown
  delete: (key: string) => unknown
  clear: () => unknown // called by mxik.cache.clear()
}
```

What the `cache` option accepts. Methods may return promises. See [Your own cache](/guide/cache#your-own-cache).

## isMxikCode

```ts
function isMxikCode(value: unknown): value is string
```

Whether `value` is a string of exactly 17 digits. Doesn't check that the code exists.

## MxikError

```ts
class MxikError extends Error {
  status: number // HTTP status
  reason?: string // message from the API
}
```

Thrown when the API returns an error or a response that isn't JSON. See [Errors](/guide/errors).

## Types

Included from the source code, so they always match the published package.

<<< @/../lib/types.ts

## Deprecated

`MxikClient`, `createMxikClient()`, `fetchByKeyword()`, `fetchByParams()`, `fetchByBrand()`, `fetchByBarcode()`, `fetchByCode()` and `fetchByDvCert()` return raw API responses and will be removed in 2.0. See [Migrating from 1.1](/guide/migration).

<<< @/../lib/legacy/types.ts
