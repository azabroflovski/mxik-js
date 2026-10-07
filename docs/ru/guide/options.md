# Настройки клиента

`createMxik()` работает без настроек. Значения по умолчанию:

| Опция      | По умолчанию       | Описание                                            |
| ---------- | ------------------ | --------------------------------------------------- |
| `lang`     | `'ru'`             | Язык названий в результатах: `'ru'` или `'uz'`      |
| `pageSize` | `20`               | Размер страницы для `search`, `filter` и `dvCert`   |
| `timeout`  | `10000`            | Таймаут запроса в мс, `0` отключает его             |
| `cache`    | `false`            | `true` или свой кеш, см. [Кеш](./cache)             |
| `baseURL`  | tasnif.soliq.uz    | Корень API, см. [Прокси](#proxy)                    |
| `fetch`    | `globalThis.fetch` | См. [Свой fetch](#custom-fetch)                     |
| `headers`  |                    | Заголовки для каждого запроса                       |

Полный `baseURL` по умолчанию: `https://tasnif.soliq.uz/api/cls-api`.

```ts
const mxik = createMxik({
  lang: 'uz',
  pageSize: 50,
  timeout: 5000,
})
```

## Для отдельного запроса {#per-request}

Последний аргумент любого метода — опции. Они переопределяют настройки клиента для этого вызова:

| Опция    | Методы                         | Описание                            |
| -------- | ------------------------------ | ----------------------------------- |
| `lang`   | все                            | Язык названий                       |
| `signal` | все                            | `AbortSignal` для отмены запроса    |
| `page`   | `search`, `filter`, `dvCert`   | Номер страницы, начиная с 1         |
| `size`   | постраничные и `*All`          | Размер страницы                     |

```ts
await mxik.search('кофе', {
  page: 2,
  lang: 'uz',
  signal: AbortSignal.timeout(3000),
})
```

## Прокси {#proxy}

Если сервер не может напрямую обратиться к tasnif.soliq.uz, поставьте перед ним прокси в Узбекистане и укажите его в `baseURL`. Пути и параметры запроса остаются прежними:

```ts
const mxik = createMxik({
  baseURL: 'https://mxik-proxy.example.uz/api/cls-api',
  headers: { authorization: `Bearer ${process.env.PROXY_TOKEN}` },
})
```

## Свой fetch {#custom-fetch}

Передайте свой `fetch` для окружений без глобального `fetch`, для логирования или чтобы подменить API в тестах:

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

## Деструктуризация {#destructuring}

Клиент — обычный объект без `this`, поэтому методы работают и по отдельности:

```ts
const { search, get } = createMxik()
```
