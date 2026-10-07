# mxik

Typed JS/TS client for [tasnif.soliq.uz](https://tasnif.soliq.uz): search MXIK (IKPU) codes by keyword, barcode, brand or certificate.

- Zero dependencies, ~3 kB gzipped
- ESM + CommonJS, works in Node 20+, Bun, Deno, browsers and edge runtimes
- Unwrapped results, pagination, language, timeouts, `AbortSignal` and optional caching

📖 [Documentation](https://azabroflovski.github.io/mxik-js/)

## Install

```sh
npm i mxik # pnpm add mxik | bun add mxik
```

## Usage

```ts
import { createMxik } from 'mxik'

const mxik = createMxik({ lang: 'ru' })

// Full-text search
const { items, total, hasNext } = await mxik.search('кофе', { page: 1, size: 50 })

// Full card of a code, `null` if it doesn't exist
const details = await mxik.get('00406001001232001')

// Search by fields
await mxik.filter({ brand: 'Samsung' })
await mxik.filter({ barcode: '4600000000000' })

// By DV certificate number
await mxik.dvCert('UZ.123456')

// Iterate over every result, pages are fetched lazily
for await (const item of mxik.searchAll('кофе'))
  console.log(item.mxikCode, item.name)
```

### Cache

Off by default. The catalog changes rarely, so caching saves a lot of requests:

```ts
import { createMemoryCache, createMxik } from 'mxik'

const mxik = createMxik({ cache: true }) // in-memory, 1 hour TTL, 500 entries
const mxik = createMxik({ cache: createMemoryCache({ ttl: 10 * 60 * 1000, max: 2000 }) })
const mxik = createMxik({ cache: myRedisCache }) // any MxikCache implementation

await mxik.cache.clear()
```

### Errors

API errors throw `MxikError` with `status` and `reason`. Network errors, timeouts and aborts are passed through as is.

```ts
import { MxikError } from 'mxik'

try {
  await mxik.search('кофе', { signal: AbortSignal.timeout(3000) })
}
catch (error) {
  if (error instanceof MxikError)
    console.log(error.status, error.reason)
}
```

### Migrating from 1.1

`MxikClient`, `createMxikClient` and `fetchBy*` still work but are deprecated. See the [migration guide](https://azabroflovski.github.io/mxik-js/guide/migration).

## License

[MIT](./LICENSE)
