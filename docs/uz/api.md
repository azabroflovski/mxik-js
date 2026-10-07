# API maʼlumotnomasi

## createMxik

```ts
function createMxik(options?: MxikOptions): Mxik
```

Mijoz yaratadi. Barcha opsiyalar [Mijoz sozlamalari](/uz/guide/options) boʻlimida tasvirlangan.

## search

<!-- eslint-skip -->

```ts
mxik.search(
  query: string,
  options?: PageOptions,
): Promise<Page<SearchItem>>
```

Nom, brend, atributlar yoki kod boʻyicha toʻliq matnli qidiruv. Qarang: [Matn boʻyicha](/uz/guide/searching#by-keyword).

## get

<!-- eslint-skip -->

```ts
mxik.get(
  code: string,
  options?: RequestOptions,
): Promise<MxikDetails | null>
```

Kodning toʻliq kartochkasi yoki kod mavjud boʻlmasa `null`. Qarang: [Alohida kod](/uz/guide/searching#a-single-code).

## filter

<!-- eslint-skip -->

```ts
mxik.filter(
  filters: Filters,
  options?: PageOptions,
): Promise<Page<CatalogItem>>
```

`text`, `brand`, `code` yoki `barcode` boʻyicha qidiruv. Qarang: [Maydonlar boʻyicha](/uz/guide/searching#by-fields).

## dvCert

<!-- eslint-skip -->

```ts
mxik.dvCert(
  certNumber: string,
  options?: PageOptions,
): Promise<Page<CatalogItem>>
```

Sertifikat raqamiga bogʻliq kodlar. Qarang: [Sertifikat raqami boʻyicha](/uz/guide/searching#by-certificate-number).

## card

<!-- eslint-skip -->

```ts
mxik.card(
  code: string,
  options?: RequestOptions,
): Promise<MxikCard | null>
```

Bitta tildagi nomlar, shtrix-kod, qisqa nom, imtiyoz va qadoqlar bilan kod kartochkasi yoki kod mavjud boʻlmasa `null`. Qarang: [Alohida kod](/uz/guide/searching#a-single-code).

## searchSubpositions

<!-- eslint-skip -->

```ts
mxik.searchSubpositions(
  query: string,
  options?: PageOptions,
): Promise<Page<CatalogItem>>
```

Mahsulot turi boʻyicha qidiruv, brendsiz subpozitsiya kodlarini qaytaradi. Qarang: [Mahsulot turi boʻyicha](/uz/guide/searching#by-product-type).

## children

<!-- eslint-skip -->

```ts
mxik.children(
  code?: string,
  options?: ChildrenOptions,
): Promise<Page<CatalogNode>>
```

Kodsiz chaqirilsa guruhlarni, kod bilan esa uning ostidagi keyingi daraja elementlarini qaytaradi. Ostki darajasi yoʻq kodlar uchun `TypeError` bilan rad etiladi. Qarang: [Daraxt](/uz/guide/catalog#tree).

## stats, units, taxBenefits

<!-- eslint-skip -->

```ts
mxik.stats(options?: RequestOptions): Promise<CatalogStats>
mxik.units(options?: RequestOptions): Promise<Unit[]>
mxik.taxBenefits(options?: RequestOptions): Promise<TaxBenefit[]>
```

Katalog hajmi, oʻlchov birliklari va imtiyozlar. Qarang: [Maʼlumotnomalar](/uz/guide/catalog#reference-data).

## searchAll, filterAll

<!-- eslint-skip -->

```ts
mxik.searchAll(
  query: string,
  options?: AllOptions,
): AsyncGenerator<SearchItem>

mxik.filterAll(
  filters: Filters,
  options?: AllOptions,
): AsyncGenerator<CatalogItem>

type AllOptions = Omit<PageOptions, 'page'>
```

Barcha sahifalarni aylanib chiqadi, keyingisini aylanish davomida soʻraydi. Qarang: [Barcha natijalar](/uz/guide/searching#all-results).

## cache.clear

<!-- eslint-skip -->

```ts
mxik.cache.clear(): Promise<void>
```

Keshdagi natijalarni oʻchiradi. Kesh oʻchirilgan boʻlsa, hech narsa qilmaydi. Qarang: [Kesh](/uz/guide/cache).

## createMemoryCache

```ts
function createMemoryCache(options?: MemoryCacheOptions): MemoryCache

interface MemoryCacheOptions {
  ttl?: number // ms, standart 1 soat
  max?: number // yozuvlar, standart 500
}

interface MemoryCache extends MxikCache {
  readonly size: number
}
```

Xotiradagi kesh: `max`dan oshganda eng uzoq vaqt ishlatilmagan yozuvni chiqarib tashlaydi. `cache: true` uni standart sozlamalar bilan yaratadi.

## MxikCache

```ts
interface MxikCache {
  get: (key: string) => unknown // yozuv boʻlmasa undefined
  set: (key: string, value: unknown) => unknown
  delete: (key: string) => unknown
  clear: () => unknown // mxik.cache.clear()dan chaqiriladi
}
```

`cache` opsiyasi nimani qabul qiladi. Metodlar promis qaytarishi mumkin. Qarang: [Oʻz keshingiz](/uz/guide/cache#your-own-cache).

## isMxikCode

```ts
function isMxikCode(value: unknown): value is string
```

`value` aynan 17 ta raqamdan iborat satr ekanligini tekshiradi. Kod mavjudligini tekshirmaydi.

## MxikError

```ts
class MxikError extends Error {
  status: number // HTTP status
  reason?: string // API xabari
}
```

API xato yoki JSON boʻlmagan javob qaytarganda chiqariladi. Qarang: [Xatolar](/uz/guide/errors).

## Tiplar {#types}

Toʻgʻridan-toʻgʻri manba koddan olingan, shuning uchun har doim chop etilgan paketga mos keladi. Ulardagi izohlar ingliz tilida.

<<< @/../lib/types.ts

## Eskirgan {#deprecated}

`MxikClient`, `createMxikClient()`, `fetchByKeyword()`, `fetchByParams()`, `fetchByBrand()`, `fetchByBarcode()`, `fetchByCode()` and `fetchByDvCert()` xom API javoblarini qaytaradi va 2.0 versiyada olib tashlanadi. Qarang: [1.1 versiyadan oʻtish](/uz/guide/migration).

<<< @/../lib/legacy/types.ts
