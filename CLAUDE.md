# mxik

Zero-dependency TypeScript client for the tasnif.soliq.uz API (Uzbekistan product classifier, MXIK/IKPU codes). Published to npm as `mxik`, docs at https://azabroflovski.github.io/mxik-js/.

This project is developed with Claude Code.

## Commands

Run from the repo root, they go through every workspace package:

```sh
bun run lint        # eslint (@antfu/eslint-config) over the whole repo, --fix to autoformat
bun run typecheck   # tsc, no emit
bun run test        # unit tests on mocked fetch, fast
bun run test:live   # smoke tests against the real API, run locally only
bun run build       # tsdown, runs publint (and attw for mxik)
bun run docs:dev    # VitePress
```

Before committing: lint, typecheck, test, build must all pass. CI (`.github/workflows/ci.yml`) runs the same on every push and PR.

## Layout

Bun workspaces monorepo. The root package is private (lint, docs).

- `packages/mxik/`: the library and the `mxik` CLI, zero runtime dependencies. Paths below are relative to it.
- `packages/mxik-mcp/`: MCP server (`@modelcontextprotocol/sdk`, `zod`), depends on `mxik` by semver range (not `workspace:`), because the maintainer publishes with `npm publish`. Its `tsconfig` maps `mxik` to `../mxik/lib/index.ts` for typecheck and tests. Has its own README and CHANGELOG.
- `lib/index.ts`: public exports, keep in sync with docs
- `lib/client.ts`: `createMxik()`, all request methods go through `load()` (request, parse envelope, cache)
- `lib/http.ts`: `request()`, `buildURL()`, `MxikError`, API envelope types
- `lib/cache.ts`: `MxikCache` interface, `createMemoryCache()`
- `lib/types.ts`: public types (options, `Page`, `Filters`, items)
- `lib/utils.ts`: `isMxikCode()`
- `lib/cli/run.ts`: CLI logic, `run(argv, io)` with injected client and output for tests; `lib/cli/index.ts` is the bin. Built as a separate node-only entry `dist/cli.mjs`.
- `lib/legacy/`: deprecated 1.1 API (`MxikClient`, `createMxikClient`, `fetchBy*`) and its types
- `test/unit/`: bun:test, inject `fetch` via `createMxik({ fetch })`; `test/live/`: real API
- `docs/`: VitePress in three locales: English at the root, Russian in `docs/ru/`, Uzbek (Latin) in `docs/uz/`, same page structure in each. `guide/` has getting-started, searching, options, cache, errors, migration; `api.md` pulls types straight from `lib/types.ts` and `lib/legacy/types.ts`. Code examples use real API values (e.g. `00901001001048023`, Maccoffee), verify new ones against the live API

## tasnif.soliq.uz API quirks

Verified against the live API, the code depends on them:

- Base URL `https://tasnif.soliq.uz/api/cls-api`, no auth. Unknown paths return 401.
- Errors come as HTTP 200 with `success: false`. Not-found looks different per endpoint:
  - `/integration-mxik/get/history/{code}`: `{ success: false, reason: "Mxik code not found!", data: null }` → `get()` returns `null`
  - `/mxik/search/by-params?gtin=`: `{ success: false, code: -1, reason: "not data found", data: { content: [] } }` → empty page
- `/elasticsearch/search`: `data` is an array, total in `recordTotal`.
- `/mxik/search/by-params` and `/mxik/search/dv-cert-number`: Spring page in `data` (`content`, `totalElements`, `number`, `last`).
- `by-params` honours only `text`, `brandName`, `mxikCode`, `gtin`. Any other param (including `dvCertNumber`, `groupCode`) is silently ignored and the whole catalog (~442k) is returned. `gtin` overrides all other filters and returns a slightly different item shape.
- `lang` supports only `ru` and `uz` (cyrillic), anything else falls back to `uz`.
- `page` is 0-based in the API, the client exposes 1-based pages.
- `size` up to at least 500 works.
- The API doesn't respond to GitHub-hosted runners (requests hang), so live tests are not in CI.
- As of 2026-10, the site's own frontend no longer calls `get/history` (`get()`) or `dv-cert-number` (`dvCert()`); they still work but may disappear. The site's card endpoint is `/mxik/get/by-mxik` (`card()`): no envelope, one language, unknown code = HTTP 403 "MXIK ma'lumotlari topilmadi".
- Catalog tree endpoints (`children()`): `/group`, `/class/short-info?groupCode`, `/position/short-info?classCode`, `/subposition/short-info?positionCode`, `/brand/short-info?subPositionCode` (text filter param `branchName`), `/brand/short-info-attribute?brandCode` (text filter `name`). They return `{ success, data: [], recordTotal }`, page is 0-based.
- To find new endpoints, read the site bundle (`https://tasnif.soliq.uz/assets/index-*.js` and its lazy chunks) and grep for request paths; probe only read-only GETs.

## Design decisions

- Functional style: `createMxik()` returns a plain object of closures, no classes. The only class is `MxikError` (for `instanceof`). No class hierarchies, no patterns for their own sake.
- Factories are named `create*` (not `define*`). Avoid the word "store" for caches.
- Methods return unwrapped data (`Page<T>`, `MxikDetails | null`), throw `MxikError` on API errors. Network errors, `TimeoutError`, `AbortError` pass through untouched.
- Codes are strings only (leading zeros).
- Cache is off by default. `cache: true | MxikCache`; the implementation owns expiration (`createMemoryCache({ ttl, max })`). Only successful results and "not found" are cached, never errors. No in-flight request dedupe (would break `AbortSignal` semantics).
- No runtime validation libraries (valibot, zod): decided against.
- Legacy 1.1 API stays working (same requests, raw envelopes, never throws on `success: false`) and is `@deprecated` until 2.0.
- TypeScript 6, not 7: typescript-eslint doesn't support TS 7 yet. `isolatedDeclarations` is on, so exported functions need explicit return types.

## Conventions

- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `ci:`, `chore(release): vX.Y.Z`). No `Co-Authored-By` trailers and no "Generated with Claude Code" lines in commits or PRs.
- Merge PRs with rebase to keep history linear.
- CHANGELOG follows Keep a Changelog, written by hand from the user's perspective, no emoji. New changes go under `[Unreleased]`.
- No emoji in README or docs text. Plain, specific wording: no marketing phrases ("out of the box", "simple", "powerful", "seamless"), sentence-case headings.
- Docs, README and CHANGELOG are updated in the same PR as the code.
- Any change to an English docs page is mirrored in `docs/ru/` and `docs/uz/`. Translated headings keep the English anchor (`## Прокси {#proxy}`) so links work across locales. Uzbek uses `ʻ` (oʻ, gʻ) and `ʼ` (maʼlumot), suffixes attach without a space (`baseURL`da). Code stays identical, only comments are translated. Docs and site PRs are merged only after the user reviews them.

## Release

1. Move `[Unreleased]` in `CHANGELOG.md` to `## [X.Y.Z] - YYYY-MM-DD`, update compare links at the bottom.
2. Bump `version` in `package.json`, commit `chore(release): vX.Y.Z`.
3. Merge the PR, tag `vX.Y.Z` on master, push the tag.
4. `gh release create vX.Y.Z --verify-tag` with the CHANGELOG section as notes.
5. `npm publish` is done by the maintainer, not by Claude, from `packages/mxik` (and `packages/mxik-mcp`, after `mxik`). `prepack` copies README/LICENSE from the root, `prepublishOnly` runs typecheck, tests and build.
6. `mxik-mcp` is versioned separately: its own CHANGELOG, tags `mxik-mcp@X.Y.Z`. Bump its `mxik` range when it starts using new library features.
7. `mxik-mcp` is listed in the official MCP Registry as `io.github.azabroflovski/mxik`. On every release bump `version` in both `package.json` and `server.json` (a test checks they match). After `npm publish`, the maintainer runs `mcp-publisher publish` in `packages/mxik-mcp` (needs `mcp-publisher login github` once).

## Ideas not done yet

- Per-request cache bypass, invalidating cache for a specific call.
- Removing the legacy API in 2.0.
- Moving `get()` onto `/mxik/get/by-mxik` (two requests, ru and uz) if `get/history` disappears; not before, since `id`, `createdAt`, `isActive` would be lost.
