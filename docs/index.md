---
layout: home

hero:
  name: mxik
  text: JavaScript client for tasnif.soliq.uz
  tagline: Unofficial client for searching MXIK (ИКПУ) codes.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: API reference
      link: /api
    - theme: alt
      text: GitHub
      link: https://github.com/azabroflovski/mxik-js

features:
  - title: Search
    details: By keyword, barcode, brand or certificate number. A single code with get().
  - title: Typed results
    details: Items and pages instead of raw responses. null for unknown codes, MxikError for API errors.
  - title: Zero dependencies
    details: About 4 kB gzipped. ESM and CJS, Node 20+, Bun, Deno, browsers.
  - title: Cache
    details: Optional. In-memory LRU, or your own on Redis, KV or a Map.
---

<div class="home-example">

```sh
npm i mxik
```

```ts
import { createMxik } from 'mxik'

const mxik = createMxik()

const { items } = await mxik.search('Maccoffee')
items[0].mxikCode // '00901001001048023'
items[0].name // 'Молотый (порошкообразный) кофе: Maccoffee, в пакет 3в1 20г'

const details = await mxik.get('00901001001048023')
details?.subPositionNameUz // 'Майдаланган (кукунсимон) кофе'
```

</div>

<style>
.home-example {
  max-width: 720px;
  margin: 48px auto 0;
}
</style>
