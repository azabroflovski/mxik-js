# Kesh

Katalog kamdan-kam oʻzgaradi, bir xil soʻrovlar esa takrorlanadi: bitta shtrix-kod ikki marta skanerlanadi, bitta kod har bir hisobvaraqda tekshiriladi. Kesh bunday takroriy soʻrovlarni tejaydi. Standart boʻyicha u oʻchirilgan.

```ts
const mxik = createMxik({ cache: true })
```

`cache: true` xotirada bir soat davomida 500 tagacha natijani saqlaydi va eng uzoq vaqt ishlatilmaganlarini chiqarib tashlaydi. Cheklovlarni oʻzgartirish uchun xotiradagi keshni oʻzingiz yarating:

```ts
import { createMemoryCache, createMxik } from 'mxik'

const mxik = createMxik({
  cache: createMemoryCache({
    ttl: 10 * 60 * 1000, // 10 daqiqa
    max: 2000,
  }),
})
```

## Nima keshlanadi {#what-s-cached}

- `search`, `get`, `filter` va `dvCert` natijalari, shu jumladan `searchAll` va `filterAll` soʻraydigan sahifalar.
- “Topilmadi”: `get()`dan `null` va boʻsh sahifalar.
- Xatolar keshlanmaydi. Muvaffaqiyatsiz soʻrov keyingi safar yana APIʼga yuboriladi.

Har bir soʻrov URL manzili alohida yozuv, shuning uchun turli soʻrovlar, sahifalar, sahifa hajmlari va tillar aralashmaydi.

::: warning Diqqat
Keshdagi natijalar nusxa sifatida emas, oʻzicha qaytariladi. Olingan obyektni oʻzgartirsangiz, keyingi chaqiruv oʻzgartirilgan variantni qaytaradi.
:::

## Tozalash {#clearing}

```ts
await mxik.cache.clear()
```

Kesh oʻchirilgan boʻlsa, hech narsa qilmaydi.

## Oʻz keshingiz {#your-own-cache}

`cache` shu toʻrtta metodga ega har qanday obyektni qabul qiladi. Ular promis qaytarishi mumkin:

```ts
interface MxikCache {
  get: (key: string) => unknown
  set: (key: string, value: unknown) => unknown
  delete: (key: string) => unknown
  clear: () => unknown
}
```

- Yozuv boʻlmasa, `get` `undefined` qaytaradi. `null` haqiqiy qiymat: mavjud boʻlmagan kod.
- Yozuvlarning amal qilish muddati — implementatsiya ishi. Mijoz yozuvlar yoshini kuzatmaydi.
- `clear` `mxik.cache.clear()`dan chaqiriladi. Agar ombor boshqa maʼlumotlar bilan umumiy boʻlsa, faqat mijoz yozuvlarini oʻchiring.

Oddiy `Map` shundayligicha mos keladi, faqat amal qilish muddatisiz:

```ts
const mxik = createMxik({ cache: new Map() })
```

### Redis {#redis}

Har bir yozuvning oʻz kaliti bor, shuning uchun muddatini Redisʼning oʻzi boshqaradi, kalitlar toʻplami esa `clear`ga faqat shu yozuvlarni oʻchirish imkonini beradi:

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

Misolda [ioredis](https://github.com/redis/ioredis) API ishlatilgan.
