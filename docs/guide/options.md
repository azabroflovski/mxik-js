# Client options

`createMxik()` works without options. These are the defaults:

| Option     | Default            | Description                                         |
| ---------- | ------------------ | --------------------------------------------------- |
| `lang`     | `'ru'`             | Language of names in results: `'ru'` or `'uz'`      |
| `pageSize` | `20`               | Page size for `search`, `filter` and `dvCert`       |
| `timeout`  | `10000`            | Request timeout in ms, `0` disables it              |
| `cache`    | `false`            | `true` or your own cache, see [Cache](./cache)      |
| `baseURL`  | tasnif.soliq.uz    | API root, see [Proxy](#proxy)                       |
| `fetch`    | `globalThis.fetch` | See [Custom fetch](#custom-fetch)                   |
| `headers`  |                    | Headers added to every request                      |

The full default `baseURL` is `https://tasnif.soliq.uz/api/cls-api`.

```ts
const mxik = createMxik({
  lang: 'uz',
  pageSize: 50,
  timeout: 5000,
})
```

## Per request

Every method takes options as its last argument. They override the client defaults for that call:

| Option   | Methods                        | Description                         |
| -------- | ------------------------------ | ----------------------------------- |
| `lang`   | all                            | Language of names                   |
| `signal` | all                            | `AbortSignal` to cancel the request |
| `page`   | `search`, `filter`, `dvCert`   | Page number, starting from 1        |
| `size`   | paginated and `*All` methods   | Page size                           |

```ts
await mxik.search('кофе', {
  page: 2,
  lang: 'uz',
  signal: AbortSignal.timeout(3000),
})
```

## Proxy

If your server can't reach tasnif.soliq.uz directly, put a proxy in Uzbekistan in front of it and point `baseURL` at it. Paths and query strings stay the same:

```ts
const mxik = createMxik({
  baseURL: 'https://mxik-proxy.example.uz/api/cls-api',
  headers: { authorization: `Bearer ${process.env.PROXY_TOKEN}` },
})
```

## Custom fetch

Pass your own `fetch` for runtimes without a global one, for logging, or to mock the API in tests:

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

## Destructuring

The client is a plain object without `this`, so methods work on their own:

```ts
const { search, get } = createMxik()
```
