# 1.1 versiyadan oʻtish

1.2 versiyada `createMxik()` asosidagi yangi API paydo boʻldi. `MxikClient`, `createMxikClient()` va `fetchBy*` funksiyalari avvalgidek ishlaydi, lekin eskirgan deb belgilangan va 2.0 versiyada olib tashlanadi. Muharrir ularni belgilab, oʻrniga nima ishlatishni koʻrsatadi.

## Nima oʻzgardi {#what-changed}

- **Oʻramlarsiz.** Metodlar xom `{ success, code, data }` javobni emas, maʼlumotning oʻzini yoki `Page<T>` qaytaradi.
- **Xatolar chiqariladi.** API xatolari `success: false` bilan qaytmaydi, `MxikError` chiqaradi. Mavjud boʻlmagan kod — `null`.
- **Sahifalar va til.** Eski API har doim rus tilidagi birinchi 20 ta natijani qaytarardi, endi ikkalasi ham sozlanadi.
- **Kodlar — satrlar.** Sonlarda boshidagi nollar yoʻqoladi, shuning uchun `get()` faqat satr qabul qiladi.

## Metodlar mosligi {#method-mapping}

| 1.1                                  | 1.2                                    |
| ------------------------------------ | -------------------------------------- |
| `new MxikClient()`                   | `createMxik()`                         |
| `createMxikClient()`                 | `createMxik()`                         |
| `client.search(q)`                   | `mxik.search(q)`                       |
| `client.code(code)`                  | `mxik.get(code)`                       |
| `client.brand(name)`                 | `mxik.filter({ brand: name })`         |
| `client.barcode(code)`               | `mxik.filter({ barcode: code })`       |
| `client.params({ brandName, gtin })` | `mxik.filter({ brand, barcode })`      |
| `client.dvCert(number)`              | `mxik.dvCert(number)`                  |
| `fetchByKeyword` … `fetchByDvCert`   | `createMxik()`dagi xuddi shu metodlar  |

## Misol {#example}

```ts
// 1.1
const client = new MxikClient()
const res = await client.code('00406001001232001')
if (res.success && res.data)
  console.log(res.data.mxikCode)

const list = await client.brand('Samsung')
console.log(list.data.content)

// 1.2
const mxik = createMxik()
const details = await mxik.get('00406001001232001')
if (details)
  console.log(details.mxikCode)

const page = await mxik.filter({ brand: 'Samsung' })
console.log(page.items)
```

## Tiplar {#types}

| 1.1                         | 1.2           |
| --------------------------- | ------------- |
| `SearchResultItem`          | `SearchItem`  |
| `ByParamsResultItem`        | `CatalogItem` |
| `DvCertItem`                | `CatalogItem` |
| `PackageName`               | `MxikPackage` |
| `ResponseSchemaWithContent` | `Page<T>`     |
| `ResponseSchema`            | —             |

Tiplarni paketdan import qiling: `import type { SearchItem } from 'mxik'`.
