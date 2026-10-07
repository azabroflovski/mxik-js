# Cache

The catalogue changes rarely, and the same lookups tend to repeat: the same barcode scanned twice, the same code checked on every invoice. The cache saves those requests. It's off by default.

```ts
const mxik = createMxik({ cache: true })
```

`cache: true` keeps up to 500 results in memory for an hour, evicting the least recently used. To change the limits, create the memory cache yourself:

```ts
import { createMemoryCache, createMxik } from 'mxik'

const mxik = createMxik({
  cache: createMemoryCache({
    ttl: 10 * 60 * 1000, // 10 minutes
    max: 2000,
  }),
})
```

## What's cached

- Results of `search`, `get`, `filter` and `dvCert`, including pages fetched by `searchAll` and `filterAll`.
- "Not found": `null` from `get()` and empty pages.
- Not errors. A failed request goes to the API again next time.

Each request URL is a separate entry, so different queries, pages, page sizes and languages don't mix.

::: warning
Results come from the cache as is, not as copies. If you change a returned object, the next call returns your changed version.
:::

## Clearing

```ts
await mxik.cache.clear()
```

When the cache is off, this does nothing.

## Your own cache

`cache` accepts any object with these four methods. They may return promises:

```ts
interface MxikCache {
  get: (key: string) => unknown
  set: (key: string, value: unknown) => unknown
  delete: (key: string) => unknown
  clear: () => unknown
}
```

- `get` returns `undefined` when there's no entry. `null` is a real value: a code that doesn't exist.
- Expiration is up to you. The client doesn't track how old entries are.
- `clear` is what `mxik.cache.clear()` calls. If the storage is shared with other data, remove only the client's entries.

A `Map` fits as is, without expiration:

```ts
const mxik = createMxik({ cache: new Map() })
```

### Redis

Each entry gets its own key so Redis expires it, and a set of keys lets `clear` remove only these entries:

```ts
import type { MxikCache } from 'mxik'

function createRedisCache(redis: Redis, ttl = 24 * 60 * 60 * 1000): MxikCache {
  const prefix = 'mxik:'
  const index = `${prefix}keys`

  return {
    async get(key) {
      const raw = await redis.get(prefix + key)
      return raw === null ? undefined : JSON.parse(raw)
    },
    async set(key, value) {
      await redis.set(prefix + key, JSON.stringify(value), 'PX', ttl)
      await redis.sadd(index, prefix + key)
    },
    async delete(key) {
      await redis.del(prefix + key)
      await redis.srem(index, prefix + key)
    },
    async clear() {
      const keys = await redis.smembers(index)
      await redis.del(index, ...keys)
    },
  }
}

const mxik = createMxik({ cache: createRedisCache(redis) })
```

The example uses the [ioredis](https://github.com/redis/ioredis) API.
