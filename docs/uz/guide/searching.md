# Qidiruv

Kodlarni toʻrt usulda topish mumkin, yana bittasi bilan alohida kodni olish mumkin:

| Metod                 | Sizda nima bor                           |
| --------------------- | ---------------------------------------- |
| `search(query)`       | Matn: mahsulot nomi, soʻz, kod           |
| `filter({ brand })`   | Brend nomi                               |
| `filter({ barcode })` | Qadoqdagi shtrix-kod                     |
| `dvCert(number)`      | Sertifikat raqami                        |
| `get(code)`           | Aniq 17 xonali kod                       |

## Matn boʻyicha {#by-keyword}

```ts
const page = await mxik.search('Maccoffee')
```

Nomlar, brendlar, atributlar va kodlar boʻyicha qidiradi. Kirill ham, lotin ham ishlaydi: `'кофе'` va `'kofe'` oʻxshash natijalar beradi. Elementlar tipi — [`SearchItem`](/uz/api#types).

## Maydonlar boʻyicha {#by-fields}

`filter()` aniq maydonlar boʻyicha qidiradi. Elementlar tipi — [`CatalogItem`](/uz/api#types).

```ts
await mxik.filter({ brand: 'Samsung' })
await mxik.filter({ barcode: '6934177746536' })
await mxik.filter({ text: 'vacuum', brand: 'Xiaomi' })
```

| Filtr     | Nimani qidiradi                                  |
| --------- | ------------------------------------------------ |
| `text`    | Nom, brend, atributlar va koddagi soʻzlar        |
| `brand`   | Brend nomi, qisman va registrga qaramay          |
| `code`    | Aniq 17 xonali kod                               |
| `barcode` | Mahsulot shtrix-kodi (GTIN)                      |

::: info Eslatma
`barcode` ustuvor: u berilsa, API qolgan filtrlarni hisobga olmaydi.
:::

## Sertifikat raqami boʻyicha {#by-certificate-number}

```ts
await mxik.dvCert(certNumber)
```

Sertifikatga bogʻliq kodlarni [`CatalogItem`](/uz/api#types) koʻrinishida qaytaradi.

## Alohida kod {#a-single-code}

```ts
const details = await mxik.get('00901001001048023')

if (details) {
  details.subPositionNameRu // 'Молотый (порошкообразный) кофе'
  details.packageNames // qadoq birliklari, masalan 'шт. (пачка) 20 грамм'
}
```

Rus va oʻzbek tillaridagi nomlar bilan [`MxikDetails`](/uz/api#types) qaytaradi, kod mavjud boʻlmasa `null`.

Kodlar boshida nollar boʻladi, shuning uchun ularni satr sifatida saqlang. Soʻrovdan oldin formatni tekshirish uchun `isMxikCode()`dan foydalaning:

```ts
import { isMxikCode } from 'mxik'

isMxikCode('00901001001048023') // true
isMxikCode('901001001048023') // false
```

## Sahifalar {#pages}

`search()`, `filter()` va `dvCert()` bir vaqtda bitta sahifa qaytaradi:

```ts
const page = await mxik.search('кофе', { page: 2, size: 50 })
```

| Maydon    | Tavsif                                   |
| --------- | ---------------------------------------- |
| `items`   | Ushbu sahifadagi natijalar               |
| `total`   | Barcha sahifalardagi natijalar soni      |
| `page`    | Sahifa raqami, birdan boshlanadi          |
| `size`    | Sahifa hajmi                             |
| `hasNext` | Keyingi sahifa bor-yoʻqligi              |

Standart sahifa hajmi 20 ta. Uni alohida soʻrov uchun `size` orqali yoki butun mijoz uchun [`pageSize`](./options) orqali oʻzgartiring.

## Barcha natijalar {#all-results}

`searchAll()` va `filterAll()` barcha sahifalarni oʻzi aylanib chiqadi. Keyingi sahifa aylanish davomida soʻraladi, shuning uchun erta toʻxtasangiz, ortiqcha soʻrov ketmaydi:

```ts
for await (const item of mxik.filterAll({ brand: 'Xiaomi' })) {
  if (item.internationalCode === barcode)
    break
}
```

`size` qanchalik katta boʻlsa, soʻrovlar shuncha kam. API kamida 500 tani qabul qiladi:

```ts
mxik.searchAll('кофе', { size: 500 })
```

## Til {#language}

`search()`, `filter()` va `dvCert()` natijalaridagi nomlar standart boʻyicha rus tilida. Oʻzbek tiliga (kirill) alohida soʻrov uchun yoki butun mijoz uchun oʻtish mumkin:

```ts
await mxik.search('кофе', { lang: 'uz' })

const mxik = createMxik({ lang: 'uz' })
```

`get()` tilga bogʻliq emas: kartochkada barcha nomlar ikkala tilda bor, masalan `subPositionNameRu` va `subPositionNameUz`.

::: info Eslatma
API oʻzbek tilidagi nomlarni faqat kirill yozuvida qaytaradi.
:::
