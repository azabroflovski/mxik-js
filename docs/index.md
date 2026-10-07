---
layout: home

hero:
  name: mxik
  text: MXIK codes from JavaScript
  tagline: A typed client for tasnif.soliq.uz, the national catalogue of goods and services of Uzbekistan.
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
  - title: Search four ways
    details: By keyword, barcode, brand or certificate number. Or fetch a single code with its names in Russian and Uzbek and its package units.
  - title: Plain data
    details: You get items and pages, not raw API envelopes. A missing code is null, an API error is an MxikError.
  - title: Small
    details: No dependencies, about 3 kB gzipped. ESM and CommonJS, Node 20+, Bun, Deno and browsers.
  - title: Optional cache
    details: The catalogue rarely changes. Turn on the in-memory cache with one option, or plug in Redis.
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
