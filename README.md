# mxik

[![npm](https://img.shields.io/npm/v/mxik)](https://www.npmjs.com/package/mxik)
[![CI](https://github.com/azabroflovski/mxik-js/actions/workflows/ci.yml/badge.svg)](https://github.com/azabroflovski/mxik-js/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlejs/size/mxik)](https://bundlejs.com/?q=mxik)
[![license](https://img.shields.io/npm/l/mxik)](./LICENSE)

Unofficial typed JavaScript client for [tasnif.soliq.uz](https://tasnif.soliq.uz), the national catalogue of goods and services of Uzbekistan. Find MXIK (IKPU) codes by keyword, barcode, brand or certificate number.

Not affiliated with the Tax Committee of Uzbekistan or tasnif.soliq.uz.

- Zero dependencies, about 4 kB gzipped
- ESM and CommonJS, runs in Node 20+, Bun, Deno, browsers and edge runtimes
- Returns plain data instead of raw API envelopes, with pagination, language selection, timeouts and `AbortSignal`
- Optional cache, in memory or your own implementation (Redis, KV)

[Documentation](https://azabroflovski.github.io/mxik-js/) · [API reference](https://azabroflovski.github.io/mxik-js/api) · [Changelog](./CHANGELOG.md)

## Install

```sh
npm i mxik
```

## Quick start

```ts
import { createMxik } from 'mxik'

const mxik = createMxik()

const { items } = await mxik.search('кофе')
console.log(items[0].mxikCode, items[0].name)
```

## API

| Method                         | Returns                       | Description                                  |
| ------------------------------ | ----------------------------- | -------------------------------------------- |
| `search(query, options?)`      | `Page<SearchItem>`            | Full-text search over the catalog            |
| `get(code, options?)`          | `MxikDetails \| null`         | Full card of a code, `null` if not found     |
| `filter(filters, options?)`    | `Page<CatalogItem>`           | Search by `text`, `brand`, `code`, `barcode` |
| `dvCert(number, options?)`     | `Page<CatalogItem>`           | Codes linked to a certificate number         |
| `card(code, options?)`         | `MxikCard \| null`            | Card with barcode, tax benefit and packages  |
| `searchSubpositions(query)`    | `Page<CatalogItem>`           | Search by product type, without a brand      |
| `children(code?, options?)`    | `Page<CatalogNode>`           | Next level of the catalog tree               |
| `stats()`, `units()`, `taxBenefits()` | `CatalogStats`, `Unit[]`, `TaxBenefit[]` | Reference data                |
| `searchAll(query, options?)`   | `AsyncGenerator<SearchItem>`  | Every search result, pages fetched lazily    |
| `filterAll(filters, options?)` | `AsyncGenerator<CatalogItem>` | Every filter result, pages fetched lazily    |
| `cache.clear()`                | `Promise<void>`               | Drop cached results                          |

```ts
// Pagination and language, per request or as client defaults
const page = await mxik.search('кофе', { page: 2, size: 50, lang: 'uz' })
page.items
page.total
page.hasNext

// A single code
const details = await mxik.get('00406001001232001')

// By fields
await mxik.filter({ brand: 'Samsung' })
await mxik.filter({ barcode: '6934177746536' })

// All results
for await (const item of mxik.filterAll({ brand: 'Xiaomi' }))
  console.log(item.mxikCode)
```

Also exported: `isMxikCode(value)` to validate the 17-digit format, and every type (`SearchItem`, `CatalogItem`, `MxikDetails`, `Page`, `Filters` and others).

## Options

```ts
const mxik = createMxik({
  lang: 'ru', // 'ru' | 'uz'
  pageSize: 20,
  timeout: 10_000, // ms, 0 disables it
  cache: false, // true, or a cache implementation
  baseURL: 'https://tasnif.soliq.uz/api/cls-api',
  fetch: globalThis.fetch,
  headers: {},
})
```

All options are optional, the values above are the defaults.

## Cache

Off by default. The catalog changes rarely, so caching saves a lot of requests.

```ts
import { createMemoryCache, createMxik } from 'mxik'

createMxik({ cache: true }) // in memory, 1 hour TTL, 500 entries
createMxik({ cache: createMemoryCache({ ttl: 10 * 60 * 1000, max: 2000 }) })
createMxik({ cache: new Map() }) // any MxikCache: get, set, delete, clear
```

Successful results and "not found" are cached, errors are not. See [Cache](https://azabroflovski.github.io/mxik-js/guide/cache) for a Redis example.

## Errors

| What happened                               | What you get                     |
| ------------------------------------------- | -------------------------------- |
| HTTP error, non-JSON body, `success: false` | `MxikError` (`status`, `reason`) |
| Code not found in `get()`                   | `null`                           |
| Nothing matched                             | Empty page                       |
| Timeout or aborted `signal`                 | `TimeoutError` or `AbortError`   |
| Network failure                             | `TypeError` from `fetch`         |

```ts
import { MxikError } from 'mxik'

try {
  await mxik.search('кофе')
}
catch (error) {
  if (error instanceof MxikError)
    console.log(error.status, error.reason)
}
```

## Good to know

- It uses the public API behind tasnif.soliq.uz, which isn't documented and may change.
- The API may not respond to servers outside Uzbekistan. Check connectivity before deploying, or use a proxy via `baseURL`.

## Migrating from 1.1

`MxikClient`, `createMxikClient()` and `fetchBy*` still work but are deprecated and will be removed in 2.0. See the [migration guide](https://azabroflovski.github.io/mxik-js/guide/migration).

## License

[MIT](./LICENSE)
