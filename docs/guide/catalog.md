# Catalog

## Tree

Codes form a tree. Each level adds digits to the parent code:

| Level        | Digits | Example             | Name                            |
| ------------ | ------ | ------------------- | ------------------------------- |
| Group        | 3      | `009`               | КОФЕ, ЧАЙ И СПЕЦИИ              |
| Class        | 5      | `00901`             | Кофе                            |
| Position     | 8      | `00901001`          | Кофе                            |
| Sub-position | 11     | `00901001001`       | Молотый (порошкообразный) кофе  |
| Brand        | 14     | `00901001001048`    | Maccoffee                       |
| Code         | 17     | `00901001001048023` | в пакет 3в1 20г                 |

`children()` returns the next level under a code, or the groups when called without one:

```ts
const groups = await mxik.children()
groups.items[8] // { code: '009', name: 'КОФЕ, ЧАЙ И СПЕЦИИ', count: 2312 }

const classes = await mxik.children('009')
classes.items[0] // { code: '00901', name: 'Кофе', count: 425 }
```

Every item is a [`CatalogNode`](/api#types): `code`, `name` and `count`, the number of codes under it. On the last level, 17-digit codes, it also has the barcode in `internationalCode`. The "no brand" entry of a sub-position has `name: null`.

Results come in pages, like [search](./searching#pages). Filter a level by name with `text`:

```ts
await mxik.children('00901001001', { text: 'jardin', size: 50 })
```

A 17-digit code has no children, and other lengths aren't valid codes: in both cases `children()` rejects with a `TypeError`.

## Reference data

```ts
await mxik.stats()
// { groupCount: 117, classCount: 1300, ..., mxikCount: 442337 }

await mxik.units()
// [{ id: 111, name: 'карат' }, { id: 88, name: 'штук (пэт бутылка)' }, ...]

await mxik.taxBenefits()
// [{ id: 100407, nameRu: '...', docNum: 1600, ... }]
```

- `stats()`: how many groups, classes, positions, sub-positions, brands and codes the catalog has.
- `units()`: units of measurement, in the client language.
- `taxBenefits()`: tax taxBenefits with the documents that grant them, in Russian, Uzbek Cyrillic and Uzbek Latin. A card links to one through `lgotaId`.
