# Кеш

Каталог меняется редко, а одни и те же запросы повторяются: один штрихкод сканируют дважды, один код проверяют в каждом счёте. Кеш избавляет от таких повторов. По умолчанию он выключен.

```ts
const mxik = createMxik({ cache: true })
```

`cache: true` хранит до 500 результатов в памяти в течение часа и вытесняет те, что дольше всего не использовались. Чтобы изменить лимиты, создайте кеш в памяти сами:

```ts
import { createMemoryCache, createMxik } from 'mxik'

const mxik = createMxik({
  cache: createMemoryCache({
    ttl: 10 * 60 * 1000, // 10 минут
    max: 2000,
  }),
})
```

## Что кешируется {#what-s-cached}

- Результаты `search`, `get`, `filter` и `dvCert`, включая страницы, которые запрашивают `searchAll` и `filterAll`.
- «Не найдено»: `null` из `get()` и пустые страницы.
- Ошибки не кешируются. Неудачный запрос в следующий раз снова пойдёт в API.

Каждый URL запроса — отдельная запись, поэтому разные запросы, страницы, размеры страниц и языки не смешиваются.

::: warning Внимание
Результаты из кеша возвращаются как есть, а не копией. Если изменить полученный объект, следующий вызов вернёт уже изменённую версию.
:::

## Очистка {#clearing}

```ts
await mxik.cache.clear()
```

Если кеш выключен, ничего не делает.

## Свой кеш {#your-own-cache}

`cache` принимает любой объект с этими четырьмя методами. Они могут возвращать промисы:

```ts
interface MxikCache {
  get: (key: string) => unknown
  set: (key: string, value: unknown) => unknown
  delete: (key: string) => unknown
  clear: () => unknown
}
```

- `get` возвращает `undefined`, если записи нет. `null` — настоящее значение: код, которого не существует.
- Срок жизни записей — на стороне реализации. Клиент не следит за их возрастом.
- `clear` вызывается из `mxik.cache.clear()`. Если хранилище общее с другими данными, удаляйте только записи клиента.

Обычный `Map` подходит как есть, только без срока жизни:

```ts
const mxik = createMxik({ cache: new Map() })
```

### Redis {#redis}

У каждой записи свой ключ, поэтому сроком жизни управляет сам Redis, а множество ключей позволяет `clear` удалить только эти записи:

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

В примере используется API [ioredis](https://github.com/redis/ioredis).
