---
layout: home

hero:
  name: mxik
  text: tasnif.soliq.uz uchun JavaScript mijozi
  tagline: MXIK kodlarini qidirish uchun norasmiy mijoz.
  actions:
    - theme: brand
      text: Boshlash
      link: /uz/guide/getting-started
    - theme: alt
      text: API maʼlumotnomasi
      link: /uz/api
    - theme: alt
      text: GitHub
      link: https://github.com/azabroflovski/mxik-js

features:
  - title: Qidiruv
    details: Nomi, shtrix-kodi, brendi yoki sertifikat raqami boʻyicha. Bitta kod get() orqali.
  - title: Tiplangan natijalar
    details: Xom javoblar oʻrniga elementlar va sahifalar. Mavjud boʻlmagan kod uchun null, API xatolari uchun MxikError.
  - title: Bogʻliqliklarsiz
    details: Gzipʼda taxminan 4 kB. ESM va CJS, Node 20+, Bun, Deno, brauzerlar.
  - title: Kesh
    details: Ixtiyoriy. Xotiradagi LRU yoki Redis, KV yoxud Map asosidagi oʻzingizniki.
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
