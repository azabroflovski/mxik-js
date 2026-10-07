# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `childrenAll(code?)`: iterate over every child of a catalog node, fetching pages lazily.

## [1.4.0] - 2026-10-07

### Added

- `card(code)`: card of a code with barcode, short name, tax benefit and packages, from the endpoint the site uses now. Returns `null` for unknown codes.
- `searchSubpositions(query)`: search by product type, returns sub-position codes without a brand.
- `children(code?)`: browse the catalog tree from groups down to codes.
- `stats()`, `units()` and `taxBenefits()`: catalog size, units of measurement and tax benefits.
- Types `MxikCard`, `MxikCardPackage`, `CatalogNode`, `ChildrenOptions`, `CatalogStats`, `Unit`, `TaxBenefit`.
- Catalog page in the documentation.

### Changed

- `MxikError.reason` now contains the body of HTTP error responses.

## [1.3.0] - 2026-10-07

### Added

- Optional result caching, off by default: `createMxik({ cache: true })` or `createMxik({ cache: implementation })`. Successful results and "not found" are cached, errors are not.
- `createMemoryCache({ ttl, max })`: in-memory LRU cache with TTL, used by `cache: true`.
- `MxikCache` interface (`get`, `set`, `delete`, `clear`) for custom caches such as `Map`, Redis or KV.
- `mxik.cache.clear()` to drop cached results.

## [1.2.0] - 2026-10-07

A new client API built around `createMxik()`. The 1.1 API keeps working and is deprecated. See the [migration guide](https://azabroflovski.github.io/mxik-js/guide/migration).

### Added

- `createMxik(options)` client returning unwrapped results instead of raw API envelopes. Options: `lang`, `pageSize`, `timeout`, `baseURL`, `fetch`, `headers`.
- `search()`, `get()`, `filter()` and `dvCert()` methods. Paginated methods accept `page`, `size`, `lang` and `signal` and return `Page<T>` with `items`, `total`, `page`, `size` and `hasNext`.
- `searchAll()` and `filterAll()` async iterators that fetch pages lazily.
- `filter()` with typed `text`, `brand`, `code` and `barcode` filters.
- `MxikError` thrown on HTTP errors, non-JSON responses and `success: false` from the API.
- `get()` returns `null` for unknown codes. An unknown barcode returns an empty page.
- Request timeout, 10 seconds by default, and `AbortSignal` support.
- `isMxikCode()` helper to validate the 17-digit code format.
- CommonJS build alongside ESM.
- All types are exported: `SearchItem`, `CatalogItem`, `MxikDetails`, `MxikPackage`, `Page`, `Filters`, `MxikOptions` and others.
- Migration guide and API reference in the documentation.

### Changed

- Built with tsdown into a single ESM and CJS bundle with bundled type declarations.
- Node.js 20 or newer is required.
- Legacy API requests now time out after 10 seconds.

### Deprecated

- `MxikClient`, `createMxikClient()`, `fetchByKeyword()`, `fetchByParams()`, `fetchByBrand()`, `fetchByBarcode()`, `fetchByCode()` and `fetchByDvCert()`. Use `createMxik()` instead. They will be removed in 2.0.
- Types `ResponseSchema`, `ResponseSchemaWithContent`, `ResponseSort`, `SearchResultItem`, `ByParamsResultItem`, `DvCertItem` and `PackageName`.

### Fixed

- Importing the package in Node.js without a bundler failed with `ERR_MODULE_NOT_FOUND`.
- Type declarations were missing from the published package, so responses were typed as `any`.
- `require('mxik')` didn't work despite being documented.
- `vitepress` was installed as a runtime dependency.
- Test files were published to npm.
- `dvCert()` return type described a single item instead of an array.

## [1.1.7] - 2025-02-08

### Fixed

- Build failure caused by a leftover Vite environment type import.

## [1.1.6] - 2025-02-08

### Fixed

- Build output used path aliases that didn't resolve outside the project. Imports are now relative.

## [1.1.5] - 2025-02-08

### Fixed

- Published package was missing build output.

## [1.1.4] - 2025-01-26

### Added

- `createMxikClient()` helper.
- API reference page in the documentation.

### Changed

- Updated documentation and README.
- Upgraded VitePress.

## [1.1.3] - 2024-07-21

### Added

- Documentation site built with VitePress and deployed to GitHub Pages.

## [1.1.2] - 2024-07-21

### Fixed

- Type declaration files were missing from the package.

## [1.1.1] - 2024-07-21

### Fixed

- Incorrect `files` paths in `package.json`.

## [1.1.0] - 2024-07-21

### Changed

- Build with `tsc` instead of Vite.

## [1.0.0] - 2024-07-21

Complete rewrite of the library.

### Added

- `MxikClient` with `search()`, `code()`, `brand()`, `barcode()`, `dvCert()` and `params()` methods.
- `fetchByKeyword()`, `fetchByCode()`, `fetchByBrand()`, `fetchByBarcode()`, `fetchByDvCert()` and `fetchByParams()` functions.
- Type definitions for API responses.

### Changed

- Migrated to Bun for development and testing.

### Removed

- The 0.x `MXIKSearch` API.

## [0.4.6] - 2023-03-20

### Changed

- Upgraded Vite to 4.2 and TypeScript to 5.0.

## [0.4.4] - 2022-09-22

### Added

- Search by sub-positions ([#3](https://github.com/azabroflovski/mxik-js/pull/3)).

## [0.3.4] - 2022-06-24

### Added

- Fetching MXIK code details.

### Fixed

- Wrong `MXIKSearchSymbol` parameter name.
- Environment variables weren't exposed because of a missing prefix.

## [0.2.2] - 2022-05-25

### Added

- Search by MXIK code ([#1](https://github.com/azabroflovski/mxik-js/pull/1), by [@aslbekkucharov](https://github.com/aslbekkucharov)).

## 0.0.1 - 2022-05-11

### Added

- Initial release with the `MXIKSearch` interface and `MXIKUnknownException`.

[Unreleased]: https://github.com/azabroflovski/mxik-js/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/azabroflovski/mxik-js/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/azabroflovski/mxik-js/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/azabroflovski/mxik-js/compare/v1.1.7...v1.2.0
[1.1.7]: https://github.com/azabroflovski/mxik-js/compare/v1.1.6...v1.1.7
[1.1.6]: https://github.com/azabroflovski/mxik-js/compare/v1.1.5...v1.1.6
[1.1.5]: https://github.com/azabroflovski/mxik-js/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/azabroflovski/mxik-js/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/azabroflovski/mxik-js/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/azabroflovski/mxik-js/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/azabroflovski/mxik-js/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/azabroflovski/mxik-js/compare/5e6e24f...v1.1.0
[1.0.0]: https://github.com/azabroflovski/mxik-js/compare/v0.4.6...5e6e24f
[0.4.6]: https://github.com/azabroflovski/mxik-js/compare/v0.4.4...v0.4.6
[0.4.4]: https://github.com/azabroflovski/mxik-js/compare/v0.3.4...v0.4.4
[0.3.4]: https://github.com/azabroflovski/mxik-js/compare/v0.2.2...v0.3.4
[0.2.2]: https://github.com/azabroflovski/mxik-js/compare/v0.1.2...v0.2.2
