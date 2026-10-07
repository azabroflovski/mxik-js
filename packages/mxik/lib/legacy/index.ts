import type { HttpConfig, Query } from '../http'
import type { MxikDetails } from '../types'
import type { ByParamsResultItem, DvCertItem, ResponseSchema, ResponseSchemaWithContent, SearchResultItem } from './types'
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT, request } from '../http'

// Legacy API: returns raw envelopes, never inspects `success`, always ru / 20 items / first page.

const http: HttpConfig = {
  baseURL: DEFAULT_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  get fetch() {
    return globalThis.fetch
  },
}

const firstPage = { page: 0, size: 20, lang: 'ru' }

/** @deprecated Use `createMxik().search()`. */
export function fetchByKeyword(keyword: string): Promise<ResponseSchema<SearchResultItem[]>> {
  return request(http, '/elasticsearch/search', { search: keyword, ...firstPage })
}

/** @deprecated Use `createMxik().filter()`. */
export function fetchByParams(params: Partial<Record<keyof ByParamsResultItem, any>>): Promise<ResponseSchemaWithContent<ByParamsResultItem[]>> {
  return request(http, '/mxik/search/by-params', { ...params as Query, ...firstPage })
}

/** @deprecated Use `createMxik().filter({ brand })`. */
export function fetchByBrand(brandName: string): Promise<ResponseSchemaWithContent<ByParamsResultItem[]>> {
  return fetchByParams({ brandName })
}

/** @deprecated Use `createMxik().filter({ barcode })`. */
export function fetchByBarcode(code: string): Promise<ResponseSchemaWithContent<ByParamsResultItem[]>> {
  return fetchByParams({ gtin: code })
}

/** @deprecated Use `createMxik().get()`. */
export function fetchByCode(code: number | string): Promise<ResponseSchema<MxikDetails>> {
  return request(http, `/integration-mxik/get/history/${code}`)
}

/** @deprecated Use `createMxik().dvCert()`. */
export function fetchByDvCert(certNumber: string | number): Promise<ResponseSchemaWithContent<DvCertItem[]>> {
  return request(http, '/mxik/search/dv-cert-number', { dvCertNumber: certNumber, ...firstPage })
}

/** @deprecated Use `createMxik()`, it returns unwrapped results and supports paging, language and timeouts. */
export class MxikClient {
  /** @deprecated Use `createMxik().search()`. */
  public search(name: string): Promise<ResponseSchema<SearchResultItem[]>> {
    return fetchByKeyword(name)
  }

  /** @deprecated Use `createMxik().filter({ brand })`. */
  public brand(name: string): Promise<ResponseSchemaWithContent<ByParamsResultItem[]>> {
    return fetchByBrand(name)
  }

  /** @deprecated Use `createMxik().filter({ barcode })`. */
  public barcode(code: string): Promise<ResponseSchemaWithContent<ByParamsResultItem[]>> {
    return fetchByBarcode(code)
  }

  /** @deprecated Use `createMxik().get()`. */
  public code(value: string | number): Promise<ResponseSchema<MxikDetails>> {
    return fetchByCode(value)
  }

  /** @deprecated Use `createMxik().dvCert()`. */
  public dvCert(certNumber: string | number): Promise<ResponseSchemaWithContent<DvCertItem[]>> {
    return fetchByDvCert(certNumber)
  }

  /** @deprecated Use `createMxik().filter()`. */
  public params(attributes: Partial<Record<keyof ByParamsResultItem, any>>): Promise<ResponseSchemaWithContent<ByParamsResultItem[]>> {
    return fetchByParams(attributes)
  }
}

/** @deprecated Use `createMxik()`. */
export function createMxikClient(): MxikClient {
  return new MxikClient()
}
