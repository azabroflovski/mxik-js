import type { MxikCache } from './cache'

/**
 * Response language. The API supports only Russian and Uzbek (cyrillic),
 * any other value silently falls back to `uz`.
 */
export type Lang = 'ru' | 'uz'

export interface MxikOptions {
  /** Default response language. @default 'ru' */
  lang?: Lang
  /** Default page size for paginated methods. @default 20 */
  pageSize?: number
  /** Request timeout in ms, `0` disables it. @default 10_000 */
  timeout?: number
  /** @default 'https://tasnif.soliq.uz/api/cls-api' */
  baseURL?: string
  /** Custom fetch implementation (tests, proxies, edge runtimes). */
  fetch?: typeof globalThis.fetch
  /** Extra headers sent with every request. */
  headers?: Record<string, string>
  /**
   * Caches successful results, errors are never cached. Off by default.
   * `true` uses `createMemoryCache()`: in memory, 1 hour TTL, 500 entries.
   */
  cache?: boolean | MxikCache
}

export interface RequestOptions {
  lang?: Lang
  signal?: AbortSignal
}

export interface PageOptions extends RequestOptions {
  /** 1-based page number. @default 1 */
  page?: number
  size?: number
}

export interface Page<T> {
  items: T[]
  /** Total number of matching records across all pages. */
  total: number
  /** 1-based page number. */
  page: number
  size: number
  hasNext: boolean
}

export interface Filters {
  /** Full-text match over code, name, brand and attributes. */
  text?: string
  /** Brand name, partial and case-insensitive. */
  brand?: string
  /** Exact 17-digit MXIK code. */
  code?: string
  /** Product barcode (GTIN). When set, the API ignores all other filters. */
  barcode?: string
}

/** Item returned by `search()`. */
export interface SearchItem {
  mxikCode: string
  name: string
  fullName: string
  description: string | null
  /** Barcode (GTIN). */
  internationalCode: string | null
  label: string
  groupCode: string
  groupName: string
  classCode: string
  className: string
  positionCode: string
  positionName: string
  subPositionCode: string
  subPositionName: string
  brandCode: string
  brandName: string | null
  attributeName: string | null
  usePackage: string
  categoryUnitId: string | null
  categoryUnitName: string | null
  unitsName: string | null
  surveyCategoryId: string | null
  nonChangeable: string
  lgotaId: string | null
  lgotaName: string | null
  recommendedCategoryUnitName: string | null
  recommendedUnitsName: string | null
  packageName: string | null
  useCard: string
  property: string | null
  categoryCode: string
  categoryName: string
  mnnName: string | null
}

/** Item returned by `filter()` and `dvCert()`. */
export interface CatalogItem {
  mxikCode: string
  mxikName: string
  groupCode: string
  groupName: string
  classCode: string
  className: string
  positionCode: string
  positionName: string
  subPositionCode: string
  subPositionName: string
  brandCode: string
  brandName: string
  attributeName: string
  /** Barcode (GTIN). */
  internationalCode: string | null
  unitCode: string | null
  unitName: string | null
  commonUnitCode: string | null
  commonUnitName: string | null
  label: number
  myProduct: number
  units: unknown
  packages: unknown
}

export interface MxikPackage {
  code: number
  mxikCode: string
  packageType: string
  nameRu: string
  nameUz: string
  nameLat: string
}

/** Full card of a single MXIK code, names in every language. */
export interface MxikDetails {
  id: string
  pkey: string | null
  parentPkey: string | null
  mxikCode: string
  groupNameRu: string
  groupNameUz: string
  groupNameLat: string | null
  classNameRu: string
  classNameUz: string
  classNameLat: string | null
  positionNameRu: string
  positionNameUz: string
  positionNameLat: string | null
  subPositionNameRu: string
  subPositionNameUz: string
  subPositionNameLat: string | null
  brandName: string
  attributeNameRu: string
  attributeNameUz: string
  attributeNameLat: string | null
  description: string | null
  isActive: string
  /** `dd.MM.yyyy HH:mm:ss` */
  createdAt: string
  /** `dd.MM.yyyy HH:mm:ss` */
  updatedAt: string
  updatedBy: string | null
  status: number
  packageNames: MxikPackage[]
}
