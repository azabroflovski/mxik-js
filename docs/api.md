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
