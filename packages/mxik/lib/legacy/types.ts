import type { CatalogItem, MxikPackage, SearchItem } from '../types'

/** Raw API envelope. @deprecated Use the unwrapped results of `createMxik()`. */
export interface ResponseSchema<Data> {
  success: boolean
  code: number
  reason: string
  data: Data | null
  recordTotal?: number
  errors: any
}

/** Raw paginated API envelope. @deprecated Use `Page<T>` from `createMxik()`. */
export interface ResponseSchemaWithContent<Data> {
  success: boolean
  code: number
  reason: string
  data: {
    content: Data | null
    empty: boolean
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    size: number
    totalElements: number
    totalPages: number
    pageable: {
      offset: number
      pageNumber: number
      pageSize: number
      paged: boolean
      unpaged: boolean
      sort: ResponseSort
    }
    sort: ResponseSort
  }
  errors: any
}

/** @deprecated */
export interface ResponseSort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

/** @deprecated Use `SearchItem`. */
export type SearchResultItem = SearchItem

/** @deprecated Use `CatalogItem`. */
export type DvCertItem = CatalogItem

/** @deprecated Use `CatalogItem`. */
export interface ByParamsResultItem extends CatalogItem {
  [key: string]: any
}

/** @deprecated Use `MxikPackage`. */
export type PackageName = MxikPackage
