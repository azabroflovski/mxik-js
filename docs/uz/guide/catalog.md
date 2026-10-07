# Katalog

## Daraxt {#tree}

Kodlar daraxt hosil qiladi. Har bir daraja ota kodga raqamlar qoʻshadi:

| Daraja       | Raqamlar | Misol               | Nomi                            |
| ------------ | -------- | ------------------- | ------------------------------- |
| Guruh        | 3        | `009`               | КОФЕ, ЧАЙ И СПЕЦИИ              |
| Sinf         | 5        | `00901`             | Кофе                            |
| Pozitsiya    | 8        | `00901001`          | Кофе                            |
| Subpozitsiya | 11       | `00901001001`       | Молотый (порошкообразный) кофе  |
| Brend        | 14       | `00901001001048`    | Maccoffee                       |
| Kod          | 17       | `00901001001048023` | в пакет 3в1 20г                 |

`children()` kod ostidagi keyingi darajani, kodsiz chaqirilganda esa guruhlarni qaytaradi:

```ts
const groups = await mxik.children()
groups.items[8] // { code: '009', name: 'КОФЕ, ЧАЙ И СПЕЦИИ', count: 2312 }

const classes = await mxik.children('009')
classes.items[0] // { code: '00901', name: 'Кофе', count: 425 }
```

Har bir element — [`CatalogNode`](/uz/api#types): `code`, `name` va `count`, ichidagi kodlar soni. Oxirgi darajada, 17 xonali kodlarda, `internationalCode`da shtrix-kod ham bor. Subpozitsiyadagi “brendsiz” yozuvda `name: null`.

Natijalar [qidiruvdagi](./searching#pages) kabi sahifalab keladi. Darajani nom boʻyicha `text` orqali filtrlash mumkin:

```ts
await mxik.children('00901001001', { text: 'jardin', size: 50 })
```

17 xonali kodning ostki darajasi yoʻq, boshqa uzunlikdagi kodlar esa yaroqsiz: ikkala holatda ham `children()` `TypeError` bilan rad etiladi.

## Maʼlumotnomalar {#reference-data}

```ts
await mxik.stats()
// { groupCount: 117, classCount: 1300, ..., mxikCount: 442337 }

await mxik.units()
// [{ id: 111, name: 'карат' }, { id: 88, name: 'штук (пэт бутылка)' }, ...]

await mxik.taxBenefits()
// [{ id: 100407, nameRu: '...', docNum: 1600, ... }]
```

- `stats()`: katalogda nechta guruh, sinf, pozitsiya, subpozitsiya, brend va kod borligi.
- `units()`: mijoz tilidagi oʻlchov birliklari.
- `taxBenefits()`: soliq imtiyozlari va ularni belgilovchi hujjatlar, rus, oʻzbek (kirill) va oʻzbek (lotin) tillarida. Kartochka imtiyozga `lgotaId` orqali bogʻlanadi.
