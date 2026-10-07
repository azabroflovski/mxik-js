import type { Envelope, HttpConfig, Query, SpringPage } from './http'
import type { CatalogItem, Filters, MxikDetails, MxikOptions, Page, PageOptions, RequestOptions, SearchItem } from './types'
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT, MxikError, request } from './http'

export interface Mxik {
  /** Full-text search over the catalog. */
  search: (query: string, options?: PageOptions) => Promise<Page<SearchItem>>
  /** Iterates over all search results, fetching pages lazily. */
  searchAll: (query: string, options?: Omit<PageOptions, 'page'>) => AsyncGenerator<SearchItem>
  /** Full card of a single code, or `null` if it doesn't exist. */
  get: (code: string, options?: RequestOptions) => Promise<MxikDetails | null>
  /** Search by fields: text, brand, code or barcode. */
  filter: (filters: Filters, options?: PageOptions) => Promise<Page<CatalogItem>>
  /** Iterates over all filter results, fetching pages lazily. */
  filterAll: (filters: Filters, options?: Omit<PageOptions, 'page'>) => AsyncGenerator<CatalogItem>
  /** Codes linked to a DV (conformity) certificate number. */
  dvCert: (certNumber: string, options?: PageOptions) => Promise<Page<CatalogItem>>
}

/**
 * Creates an MXIK client.
 *
 * @example
 * const mxik = createMxik({ lang: 'uz' })
 * const { items } = await mxik.search('кофе')
 */
export function createMxik(options: MxikOptions = {}): Mxik {
  const { lang = 'ru', pageSize = 20 } = options
  const http: HttpConfig = {
    baseURL: options.baseURL ?? DEFAULT_BASE_URL,
    timeout: options.timeout ?? DEFAULT_TIMEOUT,
    fetch: options.fetch ?? globalThis.fetch,
    headers: options.headers,
  }

  function pageQuery(opts: PageOptions): Query {
    return {
      page: (opts.page ?? 1) - 1,
      size: opts.size ?? pageSize,
      lang: opts.lang ?? lang,
    }
  }

  async function fetchPage(path: string, query: Query, opts: PageOptions): Promise<Page<CatalogItem>> {
    const res = await request<Envelope<SpringPage<CatalogItem>>>(http, path, { ...query, ...pageQuery(opts) }, opts.signal)
    // "Nothing found" comes as `success: false` with an empty page, it's not an error
    if (!Array.isArray(res.data?.content))
      throw new MxikError(res.reason || 'Unexpected response', 200, res.reason)
    const { content, totalElements, number, size, last } = res.data
    return { items: content, total: totalElements, page: number + 1, size, hasNext: !last }
  }

  async function search(query: string, opts: PageOptions = {}): Promise<Page<SearchItem>> {
    const q = pageQuery(opts)
    const res = await request<Envelope<SearchItem[]>>(http, '/elasticsearch/search', { search: query, ...q }, opts.signal)
    if (!res.success || !Array.isArray(res.data))
      throw new MxikError(res.reason || 'Unexpected response', 200, res.reason)
    const total = res.recordTotal ?? res.data.length
    const page = Number(q.page) + 1
    const size = Number(q.size)
    return { items: res.data, total, page, size, hasNext: page * size < total }
  }

  async function get(code: string, opts: RequestOptions = {}): Promise<MxikDetails | null> {
    const res = await request<Envelope<MxikDetails>>(http, `/integration-mxik/get/history/${encodeURIComponent(code)}`, {}, opts.signal)
    if (res.success && res.data)
      return res.data
    if (/not found/i.test(res.reason))
      return null
    throw new MxikError(res.reason || 'Unexpected response', 200, res.reason)
  }

  function filter(filters: Filters, opts: PageOptions = {}): Promise<Page<CatalogItem>> {
    return fetchPage('/mxik/search/by-params', {
      text: filters.text,
      brandName: filters.brand,
      mxikCode: filters.code,
      gtin: filters.barcode,
    }, opts)
  }

  function dvCert(certNumber: string, opts: PageOptions = {}): Promise<Page<CatalogItem>> {
    return fetchPage('/mxik/search/dv-cert-number', { dvCertNumber: certNumber }, opts)
  }

  return {
    search,
    searchAll: (query, opts) => paginate(page => search(query, { ...opts, page })),
    get,
    filter,
    filterAll: (filters, opts) => paginate(page => filter(filters, { ...opts, page })),
    dvCert,
  }
}

async function* paginate<T>(fetchPage: (page: number) => Promise<Page<T>>): AsyncGenerator<T> {
  for (let page = 1; ; page++) {
    const result = await fetchPage(page)
    yield* result.items
    if (!result.hasNext || !result.items.length)
      return
  }
}
