# Qidiruv

| Metod                       | Sizda nima bor                            |
| --------------------------- | ----------------------------------------- |
| `search(query)`             | Matn: mahsulot nomi, soʻz, kod            |
| `filter({ brand })`         | Brend nomi                                |
| `filter({ barcode })`       | Qadoqdagi shtrix-kod                      |
| `searchSubpositions(query)` | Mahsulot turi, brendsiz                   |
| `dvCert(number)`            | Sertifikat raqami                         |
| `card(code)`, `get(code)`   | Aniq 17 xonali kod                        |

Katalogni darajama-daraja koʻrish uchun [Katalog](./catalog) boʻlimiga qarang.

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

## Mahsulot turi boʻyicha {#by-product-type}

```ts
const page = await mxik.searchSubpositions('кофе')
page.items[0].mxikCode // '00901001004000000'
page.items[0].mxikName // 'Сублимированный кофе'
```

Subpozitsiyalarni topadi: mahsulot turining brendsiz umumiy kodlarini. Muayyan mahsulot emas, “maydalangan kofe” kodi kerak boʻlganda qulay. Elementlar tipi — [`CatalogItem`](/uz/api#types).

## Sertifikat raqami boʻyicha {#by-certificate-number}

```ts
await mxik.dvCert(certNumber)
```

Sertifikatga bogʻliq kodlarni [`CatalogItem`](/uz/api#types) koʻrinishida qaytaradi.

## Alohida kod {#a-single-code}

Kodni ikki usulda olish mumkin. Kod mavjud boʻlmasa, ikkalasi ham `null` qaytaradi.

`card()` saytda koʻrsatiladigan kartochkani qaytaradi: bitta tildagi nomlar, shtrix-kod, qisqa nom, imtiyoz va oʻlchov birliklari bilan qadoqlar.

```ts
const card = await mxik.card('00901001001048023')

card?.mxikName // 'Молотый (порошкообразный) кофе: Maccoffee, в пакет 3в1 20г'
card?.shortName // 'Молот. (порошко.) кофе Maccoffee в пак. 3в1 20г'
card?.internationalCode // '8887290101004'
card?.packages?.[0].name // 'шт. (пачка) 20 грамм'
```

`get()` nomlarni bir vaqtda rus va oʻzbek tillarida qaytaradi, lekin maydonlari kamroq:

```ts
const details = await mxik.get('00901001001048023')

details?.subPositionNameRu // 'Молотый (порошкообразный) кофе'
details?.subPositionNameUz // 'Майдаланган (кукунсимон) кофе'
```

Barcha maydonlar [`MxikCard`](/uz/api#types) va [`MxikDetails`](/uz/api#types) tiplarida.

::: warning Diqqat
Sayt endi `get()` va `dvCert()` ishlaydigan endpointlardan foydalanmaydi. Hozircha ular javob beradi, lekin ogohlantirishsiz oʻchirilishi mumkin. Yangi kodda `card()`dan foydalangan maʼqul.
:::

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
