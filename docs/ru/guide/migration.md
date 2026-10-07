# Переход с 1.1

В версии 1.2 появился новый API на основе `createMxik()`. `MxikClient`, `createMxikClient()` и функции `fetchBy*` работают как раньше, но помечены устаревшими и будут удалены в 2.0. Редактор подсветит их и подскажет замену.

## Что изменилось {#what-changed}

- **Без обёрток.** Методы возвращают данные или `Page<T>`, а не сырой ответ `{ success, code, data }`.
- **Ошибки выбрасываются.** Ошибки API выбрасывают `MxikError`, а не возвращаются с `success: false`. Несуществующий код — это `null`.
- **Страницы и язык.** Старый API всегда возвращал первые 20 результатов на русском, теперь и то и другое настраивается.
- **Коды — строки.** У чисел теряются ведущие нули, поэтому `get()` принимает только строки.

## Соответствие методов {#method-mapping}

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
| `fetchByKeyword` … `fetchByDvCert`   | те же методы у `createMxik()`          |

## Пример {#example}

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

## Типы {#types}

| 1.1                         | 1.2           |
| --------------------------- | ------------- |
| `SearchResultItem`          | `SearchItem`  |
| `ByParamsResultItem`        | `CatalogItem` |
| `DvCertItem`                | `CatalogItem` |
| `PackageName`               | `MxikPackage` |
| `ResponseSchemaWithContent` | `Page<T>`     |
| `ResponseSchema`            | —             |

Типы импортируются из пакета: `import type { SearchItem } from 'mxik'`.
