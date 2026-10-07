# Searching

There are four ways to find codes and one to fetch a single code:

| Method                      | Use it when you have                     |
| --------------------------- | ---------------------------------------- |
| `search(query)`             | Free text: a product name, a word, a code |
| `filter({ brand })`         | A brand name                             |
| `filter({ barcode })`       | A barcode from the package               |
| `dvCert(number)`            | A certificate number                     |
| `get(code)`                 | An exact 17-digit code                   |

## By keyword

```ts
const page = await mxik.search('Maccoffee')
```

Searches names, brands, attributes and codes. Cyrillic and Latin spelling both work: `'кофе'` and `'kofe'` find similar results. Items are [`SearchItem`](/api#types).

## By fields

`filter()` searches by specific fields. Items are [`CatalogItem`](/api#types).

```ts
await mxik.filter({ brand: 'Samsung' })
await mxik.filter({ barcode: '6934177746536' })
await mxik.filter({ text: 'vacuum', brand: 'Xiaomi' })
```

| Filter    | Matches                                          |
| --------- | ------------------------------------------------ |
| `text`    | Words in the name, brand, attributes and code    |
| `brand`   | Brand name, partial and case-insensitive         |
| `code`    | An exact 17-digit code                           |
| `barcode` | Product barcode (GTIN)                           |

::: info
`barcode` takes priority: when it's set, the API ignores the other filters.
:::

## By certificate number

```ts
await mxik.dvCert(certNumber)
```

Returns codes linked to the certificate, as [`CatalogItem`](/api#types).

## A single code

```ts
const details = await mxik.get('00901001001048023')

if (details) {
  details.subPositionNameRu // 'Молотый (порошкообразный) кофе'
  details.packageNames // package units, e.g. 'шт. (пачка) 20 грамм'
}
```

Returns [`MxikDetails`](/api#types) with names in Russian and Uzbek, or `null` if the code doesn't exist.

Codes have leading zeros, so keep them as strings. To check the format before making a request, use `isMxikCode()`:

```ts
import { isMxikCode } from 'mxik'

isMxikCode('00901001001048023') // true
isMxikCode('901001001048023') // false
```

## Pages

`search()`, `filter()` and `dvCert()` return one page at a time:

```ts
const page = await mxik.search('кофе', { page: 2, size: 50 })
```

| Field     | Description                              |
| --------- | ---------------------------------------- |
| `items`   | Results on this page                     |
| `total`   | Results across all pages                 |
| `page`    | Page number, starting from 1             |
| `size`    | Page size                                |
| `hasNext` | Whether there's a next page              |

The default page size is 20, change it per request with `size` or for the whole client with [`pageSize`](./options).

## All results

`searchAll()` and `filterAll()` go through every page for you. Pages are requested one by one as you iterate, so stopping early saves requests:

```ts
for await (const item of mxik.filterAll({ brand: 'Xiaomi' })) {
  if (item.internationalCode === barcode)
    break
}
```

A larger `size` means fewer requests. The API accepts at least 500:

```ts
mxik.searchAll('кофе', { size: 500 })
```

## Language

Names in `search()`, `filter()` and `dvCert()` results come in Russian by default. Switch to Uzbek (Cyrillic) per request or for the whole client:

```ts
await mxik.search('кофе', { lang: 'uz' })

const mxik = createMxik({ lang: 'uz' })
```

`get()` doesn't depend on the language: the card has every name in both, like `subPositionNameRu` and `subPositionNameUz`.
