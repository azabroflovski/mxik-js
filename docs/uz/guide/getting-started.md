# Boshlash

MXIK — Oʻzbekistondagi mahsulotlar va xizmatlarning yagona elektron milliy katalogi. Uning 17 xonali kodlari hisobvaraq-fakturalar va boshqa elektron hisob hujjatlarida koʻrsatiladi, ularni esa [tasnif.soliq.uz](https://tasnif.soliq.uz) saytida qidirishadi.

`mxik` sayt foydalanadigan API bilan ishlaydi, shuning uchun kodlarni oʻz dasturingizdan qidirishingiz mumkin: nomi, shtrix-kodi, brendi yoki sertifikat raqami boʻyicha.

::: info Bu rasmiy SDK emas
Kutubxona Oʻzbekiston Soliq qoʻmitasi va tasnif.soliq.uz bilan bogʻliq emas. U saytning ochiq APIʼsidan foydalanadi. Bu APIʼning hujjatlari yoʻq va u ogohlantirishsiz oʻzgarishi mumkin. Agar javob birdan boshqacha koʻrinsa, [issue oching](https://github.com/azabroflovski/mxik-js/issues).
:::

::: warning Oʻzbekistondan tashqaridagi hosting
API Oʻzbekistondan tashqaridagi serverlarga javob bermasligi mumkin. Xorijda deploy qilishdan oldin serveringiz `tasnif.soliq.uz`ga ulana olishini tekshiring. Agar ulana olmasa, soʻrovlarni proksi orqali yuboring: buning uchun [`baseURL`](./options#proxy) opsiyasidan foydalaning.
:::

## Oʻrnatish {#install}

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

Denoʼda `npm:mxik` sifatida import qiling.

## Birinchi soʻrov {#first-request}

```ts
import { createMxik } from 'mxik'

const mxik = createMxik()

const { items, total } = await mxik.search('Maccoffee')
```

`items` — natijalarning birinchi sahifasi, standart boʻyicha 20 ta, `total` esa ularning umumiy soni. Har bir elementda kod, nom va uning katalog ierarxiyasidagi oʻrni bor:

```ts
items[0].mxikCode // '00901001001048023'
items[0].name // 'Молотый (порошкообразный) кофе: Maccoffee, в пакет 3в1 20г'
items[0].groupName // 'КОФЕ, ЧАЙ И СПЕЦИИ'
```

Kod maʼlum boʻlsa, uning toʻliq kartochkasini oling:

```ts
const details = await mxik.get('00901001001048023')

details?.subPositionNameRu // 'Молотый (порошкообразный) кофе'
details?.subPositionNameUz // 'Майдаланган (кукунсимон) кофе'
```

Kod mavjud boʻlmasa, `get()` `null` qaytaradi.

## Qayerda ishlaydi {#where-it-runs}

- Node.js 20 va undan yangi, Bun va Deno.
- Brauzerlar: API boshqa domenlardan soʻrovlarga ruxsat beradi.
- Edge muhitlari va `fetch` mavjud boʻlgan har qanday joy. [Oʻz `fetch`ʼingizni](./options#custom-fetch) ham berishingiz mumkin.

Paketda tip deklaratsiyalari bilan ESM va CommonJS yigʻmalari bor:

```ts
import { createMxik } from 'mxik'
// yoki
const { createMxik } = require('mxik')
```

## Keyingi qadamlar {#next-steps}

- [Qidiruv](./searching): barcha qidiruv usullari, sahifalar va tillar.
- [Mijoz sozlamalari](./options): taymautlar, proksi, oʻz `fetch`ʼingiz.
- [Kesh](./cache): bir xil soʻrovlarni takrorlamaslik.
- [Xatolar](./errors): nima notoʻgʻri ketishi mumkin va holatlarni qanday farqlash.
