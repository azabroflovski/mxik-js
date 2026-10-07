# Справочник API

## createMxik

```ts
function createMxik(options?: MxikOptions): Mxik
```

Создаёт клиент. Все опции описаны в разделе [Настройки клиента](/ru/guide/options).

## search

<!-- eslint-skip -->

```ts
mxik.search(
  query: string,
  options?: PageOptions,
): Promise<Page<SearchItem>>
```

Полнотекстовый поиск по названию, бренду, атрибутам или коду. См. [По тексту](/ru/guide/searching#by-keyword).

## get

<!-- eslint-skip -->

```ts
mxik.get(
  code: string,
  options?: RequestOptions,
): Promise<MxikDetails | null>
```

Полная карточка кода или `null`, если его не существует. См. [Отдельный код](/ru/guide/searching#a-single-code).

## filter

<!-- eslint-skip -->

```ts
mxik.filter(
  filters: Filters,
  options?: PageOptions,
): Promise<Page<CatalogItem>>
```

Поиск по `text`, `brand`, `code` или `barcode`. См. [По полям](/ru/guide/searching#by-fields).

## dvCert

<!-- eslint-skip -->

```ts
mxik.dvCert(
  certNumber: string,
  options?: PageOptions,
): Promise<Page<CatalogItem>>
```

Коды, связанные с номером сертификата. См. [По номеру сертификата](/ru/guide/searching#by-certificate-number).

## card

<!-- eslint-skip -->

```ts
mxik.card(
  code: string,
  options?: RequestOptions,
): Promise<MxikCard | null>
```

Карточка кода с названиями на одном языке, штрихкодом, кратким названием, льготой и упаковками или `null`, если кода не существует. См. [Отдельный код](/ru/guide/searching#a-single-code).

## searchSubpositions

<!-- eslint-skip -->

```ts
mxik.searchSubpositions(
  query: string,
  options?: PageOptions,
): Promise<Page<CatalogItem>>
```

Поиск по типу товара, возвращает коды субпозиций без бренда. См. [По типу товара](/ru/guide/searching#by-product-type).

## children

<!-- eslint-skip -->

```ts
mxik.children(
  code?: string,
  options?: ChildrenOptions,
): Promise<Page<CatalogNode>>
```

Без кода возвращает группы, с кодом — следующий уровень дерева под ним. Для кодов без потомков отклоняется с `TypeError`. См. [Дерево](/ru/guide/catalog#tree).

## stats, units, taxBenefits

<!-- eslint-skip -->

```ts
mxik.stats(options?: RequestOptions): Promise<CatalogStats>
mxik.units(options?: RequestOptions): Promise<Unit[]>
mxik.taxBenefits(options?: RequestOptions): Promise<TaxBenefit[]>
```

Размер каталога, единицы измерения и льготы. См. [Справочники](/ru/guide/catalog#reference-data).

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

Проходят по всем страницам, запрашивая следующую по ходу перебора. См. [Все результаты](/ru/guide/searching#all-results).

## cache.clear

<!-- eslint-skip -->

```ts
mxik.cache.clear(): Promise<void>
```

Удаляет результаты из кеша. Если кеш выключен, ничего не делает. См. [Кеш](/ru/guide/cache).

## createMemoryCache

```ts
function createMemoryCache(options?: MemoryCacheOptions): MemoryCache

interface MemoryCacheOptions {
  ttl?: number // мс, по умолчанию 1 час
  max?: number // записей, по умолчанию 500
}

interface MemoryCache extends MxikCache {
  readonly size: number
}
```

Кеш в памяти, который при превышении `max` вытесняет запись, дольше всего не использовавшуюся. `cache: true` создаёт его с настройками по умолчанию.

## MxikCache

```ts
interface MxikCache {
  get: (key: string) => unknown // undefined, если записи нет
  set: (key: string, value: unknown) => unknown
  delete: (key: string) => unknown
  clear: () => unknown // вызывается из mxik.cache.clear()
}
```

Что принимает опция `cache`. Методы могут возвращать промисы. См. [Свой кеш](/ru/guide/cache#your-own-cache).

## isMxikCode

```ts
function isMxikCode(value: unknown): value is string
```

Является ли `value` строкой ровно из 17 цифр. Существование кода не проверяет.

## MxikError

```ts
class MxikError extends Error {
  status: number // HTTP-статус
  reason?: string // сообщение от API
}
```

Выбрасывается, когда API возвращает ошибку или ответ не в JSON. См. [Ошибки](/ru/guide/errors).

## Типы {#types}

Подключены прямо из исходного кода, поэтому всегда совпадают с опубликованным пакетом. Комментарии в них на английском.

<<< @/../lib/types.ts

## Устаревшее {#deprecated}

`MxikClient`, `createMxikClient()`, `fetchByKeyword()`, `fetchByParams()`, `fetchByBrand()`, `fetchByBarcode()`, `fetchByCode()` and `fetchByDvCert()` возвращают сырые ответы API и будут удалены в 2.0. См. [Переход с 1.1](/ru/guide/migration).

<<< @/../lib/legacy/types.ts
