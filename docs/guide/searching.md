# Searching

| Method                      | Use it when you have                      |
| --------------------------- | ----------------------------------------- |
| `search(query)`             | Free text: a product name, a word, a code |
| `filter({ brand })`         | A brand name                              |
| `filter({ barcode })`       | A barcode from the package                |
| `searchSubpositions(query)` | A product type, without a brand           |
| `dvCert(number)`            | A certificate number                      |
| `card(code)`, `get(code)`   | An exact 17-digit code                    |

To browse the catalog level by level instead, see [Catalog](./catalog).

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

## By product type

```ts
const page = await mxik.searchSubpositions('кофе')
page.items[0].mxikCode // '00901001004000000'
page.items[0].mxikName // 'Сублимированный кофе'
```

Finds sub-positions: generic codes of a product type, without a brand. Use it when you need the code for "ground coffee" rather than a specific product. Items are [`CatalogItem`](/api#types).

## By certificate number

```ts
await mxik.dvCert(certNumber)
```

Returns codes linked to the certificate, as [`CatalogItem`](/api#types).

## A single code

There are two ways to fetch a code. Both return `null` if it doesn't exist.

`card()` returns the card the site shows: names in one language, the barcode, a short name, the tax benefit and packages with units.

```ts
const card = await mxik.card('00901001001048023')

card?.mxikName // 'Молотый (порошкообразный) кофе: Maccoffee, в пакет 3в1 20г'
card?.shortName // 'Молот. (порошко.) кофе Maccoffee в пак. 3в1 20г'
card?.internationalCode // '8887290101004'
card?.packages?.[0].name // 'шт. (пачка) 20 грамм'
```

`get()` returns names in Russian and Uzbek at once, but fewer fields:

```ts
const details = await mxik.get('00901001001048023')

details?.subPositionNameRu // 'Молотый (порошкообразный) кофе'
details?.subPositionNameUz // 'Майдаланган (кукунсимон) кофе'
```

See [`MxikCard`](/api#types) and [`MxikDetails`](/api#types) for all fields.

::: warning
The site no longer uses the endpoints behind `get()` and `dvCert()`. They work today, but may be switched off without notice. Prefer `card()` for new code.
:::

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
