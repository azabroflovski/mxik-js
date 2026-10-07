# Migrating from 1.1

Version 1.2 added a new API built around `createMxik()`. `MxikClient`, `createMxikClient()` and the `fetchBy*` functions still work exactly as before, but they're deprecated and will be removed in 2.0. Your editor marks them as deprecated and suggests the replacement.

## What changed

- **No envelopes.** Methods return the data or a `Page<T>`, not the raw `{ success, code, data }` response.
- **Errors throw.** API errors throw `MxikError` instead of resolving with `success: false`. A missing code is `null`.
- **Pages and language.** The old API always returned the first 20 results in Russian, now both are options.
- **Codes are strings.** Numbers lose leading zeros, so `get()` accepts only strings.

## Method mapping

| 1.1                                 | 1.2                                    |
| ----------------------------------- | -------------------------------------- |
| `new MxikClient()`                  | `createMxik()`                         |
| `createMxikClient()`                | `createMxik()`                         |
| `client.search(q)`                  | `mxik.search(q)`                       |
| `client.code(code)`                 | `mxik.get(code)`                       |
| `client.brand(name)`                | `mxik.filter({ brand: name })`         |
| `client.barcode(code)`              | `mxik.filter({ barcode: code })`       |
| `client.params({ brandName, gtin })` | `mxik.filter({ brand, barcode })`     |
| `client.dvCert(number)`             | `mxik.dvCert(number)`                  |
| `fetchByKeyword` … `fetchByDvCert`  | same methods on `createMxik()`         |

## Example

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

## Types

| 1.1                         | 1.2           |
| --------------------------- | ------------- |
| `SearchResultItem`          | `SearchItem`  |
| `ByParamsResultItem`        | `CatalogItem` |
| `DvCertItem`                | `CatalogItem` |
| `PackageName`               | `MxikPackage` |
| `ResponseSchemaWithContent` | `Page<T>`     |
| `ResponseSchema`            | —             |

Import types from the package: `import type { SearchItem } from 'mxik'`.
