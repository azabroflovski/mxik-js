---
layout: home

hero:
  name: mxik
  text: JavaScript-клиент для tasnif.soliq.uz
  tagline: Неофициальный клиент для поиска кодов ИКПУ (MXIK).
  actions:
    - theme: brand
      text: Начать
      link: /ru/guide/getting-started
    - theme: alt
      text: Справочник API
      link: /ru/api
    - theme: alt
      text: GitHub
      link: https://github.com/azabroflovski/mxik-js

features:
  - title: Поиск
    details: По названию, штрихкоду, бренду или номеру сертификата. Отдельный код через get().
  - title: Типизированные результаты
    details: Элементы и страницы вместо сырых ответов. null для несуществующего кода, MxikError для ошибок API.
  - title: Без зависимостей
    details: Около 4 kB в gzip. ESM и CJS, Node 20+, Bun, Deno, браузеры.
  - title: Кеш
    details: По желанию. LRU в памяти или свой на Redis, KV или Map.
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
