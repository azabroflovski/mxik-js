# Mijoz sozlamalari

`createMxik()` sozlamalarsiz ishlaydi. Standart qiymatlar:

| Opsiya     | Standart           | Tavsif                                              |
| ---------- | ------------------ | --------------------------------------------------- |
| `lang`     | `'ru'`             | Natijalardagi nomlar tili: `'ru'` yoki `'uz'`       |
| `pageSize` | `20`               | `search`, `filter` va `dvCert` uchun sahifa hajmi   |
| `timeout`  | `10000`            | Soʻrov taymauti millisekundlarda, `0` oʻchiradi            |
| `cache`    | `false`            | `true` yoki oʻz keshingiz, qarang: [Kesh](./cache)  |
| `baseURL`  | tasnif.soliq.uz    | API ildizi, qarang: [Proksi](#proxy)                |
| `fetch`    | `globalThis.fetch` | Qarang: [Oʻz fetch](#custom-fetch)                  |
| `headers`  |                    | Har bir soʻrovga qoʻshiladigan sarlavhalar          |

Toʻliq standart `baseURL`: `https://tasnif.soliq.uz/api/cls-api`.

```ts
const mxik = createMxik({
  lang: 'uz',
  pageSize: 50,
  timeout: 5000,
})
```

## Alohida soʻrov uchun {#per-request}

Har bir metodning oxirgi argumenti — opsiyalar. Ular shu chaqiruv uchun mijoz sozlamalarini almashtiradi:

| Opsiya   | Metodlar                       | Tavsif                              |
| -------- | ------------------------------ | ----------------------------------- |
| `lang`   | barchasi                       | Nomlar tili                         |
| `signal` | barchasi                       | Soʻrovni bekor qilish uchun `AbortSignal` |
| `page`   | `search`, `filter`, `dvCert`   | Sahifa raqami, birdan boshlanadi     |
| `size`   | sahifali va `*All` metodlar    | Sahifa hajmi                        |

```ts
await mxik.search('кофе', {
  page: 2,
  lang: 'uz',
  signal: AbortSignal.timeout(3000),
})
```

## Proksi {#proxy}

Agar serveringiz tasnif.soliq.uzga toʻgʻridan-toʻgʻri ulana olmasa, uning oldiga Oʻzbekistondagi proksini qoʻying va uni `baseURL`da koʻrsating. Yoʻllar va soʻrov parametrlari oʻzgarmaydi:

```ts
const mxik = createMxik({
  baseURL: 'https://mxik-proxy.example.uz/api/cls-api',
  headers: { authorization: `Bearer ${process.env.PROXY_TOKEN}` },
})
```

## Oʻz fetch {#custom-fetch}

Global `fetch` yoʻq muhitlar uchun, loglash uchun yoki testlarda APIʼni almashtirish uchun oʻz `fetch`ʼingizni bering:

```ts
const mxik = createMxik({
  fetch: async () => Response.json({
    success: true,
    data: [{ mxikCode: '00901001001048023' }],
    recordTotal: 1,
  }),
})

const { items } = await mxik.search('anything')
items[0].mxikCode // '00901001001048023'
```

## Destrukturizatsiya {#destructuring}

Mijoz `this`siz oddiy obyekt, shuning uchun metodlar alohida ham ishlaydi:

```ts
const { search, get } = createMxik()
```
