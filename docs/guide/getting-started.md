# Getting started

MXIK (ИКПУ) is the national catalogue of goods and services of Uzbekistan. Its 17-digit codes go on invoices and other electronic accounting documents, and [tasnif.soliq.uz](https://tasnif.soliq.uz) is where you look them up.

`mxik` calls the same API the site uses, so you can find codes from your own code: by keyword, barcode, brand or certificate number.

## Install

::: code-group

```sh [npm]
npm i mxik
```

```sh [pnpm]
pnpm add mxik
```

```sh [yarn]
yarn add mxik
```

```sh [bun]
bun add mxik
```

:::

In Deno, import it as `npm:mxik`.

## First request

```ts
import { createMxik } from 'mxik'

const mxik = createMxik()

const { items, total } = await mxik.search('Maccoffee')
```

`items` is the first page of results, 20 by default, and `total` is how many there are overall. Each item has the code, its name and the catalogue hierarchy around it:

```ts
items[0].mxikCode // '00901001001048023'
items[0].name // 'Молотый (порошкообразный) кофе: Maccoffee, в пакет 3в1 20г'
items[0].groupName // 'КОФЕ, ЧАЙ И СПЕЦИИ'
```

When you already have a code, fetch its full card:

```ts
const details = await mxik.get('00901001001048023')

details?.subPositionNameRu // 'Молотый (порошкообразный) кофе'
details?.subPositionNameUz // 'Майдаланган (кукунсимон) кофе'
```

`get()` returns `null` when the code doesn't exist.

## Where it runs

- Node.js 20 or newer, Bun and Deno.
- Browsers: the API allows cross-origin requests.
- Edge runtimes and anything else with `fetch`. You can also [pass your own](./options#custom-fetch).

The package ships ESM and CommonJS builds with type declarations:

```ts
import { createMxik } from 'mxik'
// or
const { createMxik } = require('mxik')
```

## Before you ship

::: warning Not an official SDK
The library uses the public API behind tasnif.soliq.uz. It isn't documented and may change without notice. If a response suddenly looks different, [open an issue](https://github.com/azabroflovski/mxik-js/issues).
:::

::: warning Hosting outside Uzbekistan
Requests from GitHub-hosted CI runners (USA) hang until they time out. Before deploying to a server outside Uzbekistan, check that it can reach `tasnif.soliq.uz`. If it can't, route requests through a proxy with the [`baseURL`](./options#proxy) option.
:::

## Next steps

- [Searching](./searching): all lookup methods, pagination and languages.
- [Client options](./options): timeouts, proxies, custom `fetch`.
- [Cache](./cache): skip repeated requests.
- [Errors](./errors): what can go wrong and how to tell the cases apart.
