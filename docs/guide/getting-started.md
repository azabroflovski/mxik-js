# Getting Started

## Installation

::: code-group

```sh [npm]
npm i mxik
```

```sh [pnpm]
pnpm add mxik
```

```sh [bun]
bun add mxik
```

:::

Works in Node 20+, Bun, Deno, browsers and edge runtimes. Both ESM and CommonJS are supported:

```ts
import { createMxik } from 'mxik'
// or
const { createMxik } = require('mxik')
```

## Create a client

```ts
const mxik = createMxik()
```

All options are optional:

```ts
const mxik = createMxik({
  lang: 'uz', // 'ru' | 'uz', default 'ru'
  pageSize: 50, // default 20
  timeout: 5000, // ms, 0 disables it, default 10 000
  baseURL: 'https://my-proxy.local/cls-api', // default https://tasnif.soliq.uz/api/cls-api
  fetch: customFetch, // default globalThis.fetch
  headers: { 'x-my-header': '1' },
  cache: true, // see Cache below, default off
})
```

The client is a plain object, methods can be destructured:

```ts
const { search, get } = createMxik()
```

## Search

```ts
const page = await mxik.search('кофе')

page.items // SearchItem[]
page.total // total matches across all pages
page.page // current page, 1-based
page.size
page.hasNext
```

Every paginated method accepts `page`, `size`, `lang` and `signal`:

```ts
await mxik.search('кофе', { page: 2, size: 100, lang: 'uz' })
```

## Get a code

```ts
const details = await mxik.get('00406001001232001')

if (details) {
  details.subPositionNameRu // names in every language
  details.packageNames // available packages
}
```

Returns `null` when the code doesn't exist. Use `isMxikCode()` to validate the format before making a request:

```ts
import { isMxikCode } from 'mxik'

isMxikCode('00406001001232001') // true
```

::: tip
Keep codes as strings: they have leading zeros which numbers drop.
:::

## Filter

```ts
await mxik.filter({ brand: 'Samsung' })
await mxik.filter({ text: 'xiaomi', brand: 'xiaomi' })
await mxik.filter({ code: '08504003009011001' })
await mxik.filter({ barcode: '6934177746536' })
```

| Filter    | Description                                                 |
| --------- | ----------------------------------------------------------- |
| `text`    | Full-text match over code, name, brand and attributes       |
| `brand`   | Brand name, partial and case-insensitive                    |
| `code`    | Exact 17-digit MXIK code                                    |
| `barcode` | Product barcode (GTIN). When set, other filters are ignored |

## DV certificate

```ts
await mxik.dvCert('UZ.123456')
```

## All pages

`searchAll` and `filterAll` return async iterators that fetch pages lazily, so you can stop at any time:

```ts
for await (const item of mxik.filterAll({ brand: 'Xiaomi' }, { size: 100 })) {
  if (item.internationalCode === barcode)
    break
}
```

## Cache

Off by default. The catalog changes rarely, so caching is worth enabling for anything that repeats lookups:

```ts
const mxik = createMxik({ cache: true })
```

This uses an in-memory store with 1 hour TTL that keeps up to 500 results and evicts the least recently used. Tune it:

```ts
const mxik = createMxik({
  cache: {
    ttl: 10 * 60 * 1000, // 10 minutes
    max: 2000,
  },
})
```

What gets cached:

- Results of `search`, `get`, `filter` and `dvCert`, including pages fetched by `searchAll` / `filterAll`.
- "Not found" results: `null` from `get()` and empty pages.
- Not errors: a failed request is retried next time.

The key is the full request URL, so different queries, pages, sizes and languages are cached separately.

::: warning
Cached results are shared objects. Don't mutate them, or the next call will return your changes.
:::

### Clearing

Create the store yourself to keep a handle on it:

```ts
import { createMemoryCache, createMxik } from 'mxik'

const cache = createMemoryCache({ max: 1000 })
const mxik = createMxik({ cache: { store: cache } })

cache.clear()
```

### Custom store

Any object with `get`, `set` and `delete` works, a plain `Map` included. Methods may be async, so Redis or a KV store fit too:

```ts
const mxik = createMxik({
  cache: {
    ttl: 24 * 60 * 60 * 1000,
    store: {
      get: async key => JSON.parse(await redis.get(key) ?? 'null') ?? undefined,
      set: (key, entry) => redis.set(key, JSON.stringify(entry), 'PX', entry.expires - Date.now()),
      delete: key => redis.del(key),
    },
  },
})
```

The client stores `{ value, expires }` entries and checks `expires` itself, setting a TTL in the store is optional.

## Errors

| What happened                             | What you get                    |
| ----------------------------------------- | ------------------------------- |
| HTTP error, non-JSON body, `success: false` | `MxikError` (`status`, `reason`) |
| Code not found in `get()`                 | `null`                          |
| Nothing matched in `search()`, `filter()` | empty page                      |
| Network error                             | `TypeError` from `fetch`        |
| Timeout                                   | `DOMException` `TimeoutError`   |
| Aborted via `signal`                      | `DOMException` `AbortError`     |

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
