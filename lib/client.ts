import type { MxikCache } from './cache'
import type { Envelope, HttpConfig, ListEnvelope, Query, SpringPage } from './http'
import type { CatalogItem, CatalogNode, CatalogStats, ChildrenOptions, Filters, MxikCard, MxikDetails, MxikOptions, Page, PageOptions, RequestOptions, SearchItem, TaxBenefit, Unit } from './types'
import { createMemoryCache } from './cache'
import { buildURL, DEFAULT_BASE_URL, DEFAULT_TIMEOUT, MxikError, request } from './http'

interface RawNode {
  code: string
  name: string | null
  count?: number
  mxikCount?: number
  internationalCode?: string | null
}

/** Children endpoint for each parent code length, `0` means the root (groups). */
const CATALOG_LEVELS: Record<number, { path: string, parent: string, text: string }> = {
  0: { path: '/group', parent: 'code', text: 'text' },
  3: { path: '/class/short-info', parent: 'groupCode', text: 'text' },
  5: { path: '/position/short-info', parent: 'classCode', text: 'text' },
  8: { path: '/subposition/short-info', parent: 'positionCode', text: 'text' },
  11: { path: '/brand/short-info', parent: 'subPositionCode', text: 'branchName' },
  14: { path: '/brand/short-info-attribute', parent: 'brandCode', text: 'name' },
}

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
  /** Codes linked to a certificate number (the API's `dv-cert-number` search). */
  dvCert: (certNumber: string, options?: PageOptions) => Promise<Page<CatalogItem>>
  /** Card of a code with names in one language, barcode, tax benefit and packages, or `null` if it doesn't exist. */
  card: (code: string, options?: RequestOptions) => Promise<MxikCard | null>
  /** Search by product type: returns sub-position codes without a brand. */
  searchSubpositions: (query: string, options?: PageOptions) => Promise<Page<CatalogItem>>
  /** Groups when called without a code, otherwise the next level of the catalog tree under `code`. */
  children: (code?: string, options?: ChildrenOptions) => Promise<Page<CatalogNode>>
  /** Iterates over all children of `code`, fetching pages lazily. */
  childrenAll: (code?: string, options?: Omit<ChildrenOptions, 'page'>) => AsyncGenerator<CatalogNode>
  /** Number of groups, classes, positions, sub-positions, brands and codes in the catalog. */
  stats: (options?: RequestOptions) => Promise<CatalogStats>
  /** Units of measurement. */
  units: (options?: RequestOptions) => Promise<Unit[]>
  /** Tax benefits referenced by `lgotaId`. */
  taxBenefits: (options?: RequestOptions) => Promise<TaxBenefit[]>
  cache: {
    /** Removes all cached results. Does nothing when caching is off. */
    clear: () => Promise<void>
  }
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
  const cache = resolveCache(options.cache)

  /**
   * Requests `path` and turns the body into a result, going through the cache if enabled.
   * `recover` may turn an HTTP error into a result, e.g. "not found" into `null`.
   */
  async function load<B, R>(
    path: string,
    query: Query,
    signal: AbortSignal | undefined,
    parse: (body: B) => R,
    recover?: (error: MxikError) => R | undefined,
  ): Promise<R> {
    const run = async (): Promise<R> => {
      try {
        return parse(await request<B>(http, path, query, signal))
      }
      catch (error) {
        const value = error instanceof MxikError ? recover?.(error) : undefined
        if (value === undefined)
          throw error
        return value
      }
    }
    if (!cache)
      return run()

    const key = buildURL(http.baseURL, path, query)
    const hit = await cache.get(key)
    if (hit !== undefined)
      return hit as R

    const value = await run()
    await cache.set(key, value)
    return value
  }

  function pageQuery(opts: PageOptions): Query {
    return {
      page: (opts.page ?? 1) - 1,
      size: opts.size ?? pageSize,
      lang: opts.lang ?? lang,
    }
  }

  function fetchPage(path: string, query: Query, opts: PageOptions): Promise<Page<CatalogItem>> {
    return load<Envelope<SpringPage<CatalogItem>>, Page<CatalogItem>>(path, { ...query, ...pageQuery(opts) }, opts.signal, (res) => {
      // "Nothing found" comes as `success: false` with an empty page, it's not an error
      if (!Array.isArray(res.data?.content))
        throw new MxikError(res.reason || 'Unexpected response', 200, res.reason)
      const { content, totalElements, number, size, last } = res.data
      return { items: content, total: totalElements, page: number + 1, size, hasNext: !last }
    })
  }

  function search(query: string, opts: PageOptions = {}): Promise<Page<SearchItem>> {
    const q = pageQuery(opts)
    return load<Envelope<SearchItem[]>, Page<SearchItem>>('/elasticsearch/search', { search: query, ...q }, opts.signal, (res) => {
      if (!res.success || !Array.isArray(res.data))
        throw new MxikError(res.reason || 'Unexpected response', 200, res.reason)
      const total = res.recordTotal ?? res.data.length
      const page = Number(q.page) + 1
      const size = Number(q.size)
      return { items: res.data, total, page, size, hasNext: page * size < total }
    })
  }

  function get(code: string, opts: RequestOptions = {}): Promise<MxikDetails | null> {
    return load<Envelope<MxikDetails>, MxikDetails | null>(`/integration-mxik/get/history/${encodeURIComponent(code)}`, {}, opts.signal, (res) => {
      if (res.success && res.data)
        return res.data
      if (/not found/i.test(res.reason))
        return null
      throw new MxikError(res.reason || 'Unexpected response', 200, res.reason)
    })
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

  function card(code: string, opts: RequestOptions = {}): Promise<MxikCard | null> {
    return load<MxikCard, MxikCard | null>(
      '/mxik/get/by-mxik',
      { mxikCode: code, lang: opts.lang ?? lang },
      opts.signal,
      body => body,
      // Unknown codes come as HTTP 403 "MXIK ma'lumotlari topilmadi"
      error => error.status === 403 && /topilmadi|not found/i.test(error.reason ?? '') ? null : undefined,
    )
  }

  function searchSubpositions(query: string, opts: PageOptions = {}): Promise<Page<CatalogItem>> {
    return fetchPage('/mxik/search-subposition', { search_text: query }, opts)
  }

  function children(code?: string, opts: ChildrenOptions = {}): Promise<Page<CatalogNode>> {
    const level = CATALOG_LEVELS[code?.length ?? 0]
    if (!level) {
      const lengths = Object.keys(CATALOG_LEVELS).filter(length => length !== '0').join(', ')
      return Promise.reject(new TypeError(`Expected a catalog code of ${lengths} digits, got "${code}"`))
    }

    const q = pageQuery(opts)
    const query = { ...q, [level.parent]: code, [level.text]: opts.text }
    return load<ListEnvelope<RawNode>, Page<CatalogNode>>(level.path, query, opts.signal, (res) => {
      if (!res.success || !Array.isArray(res.data))
        throw new MxikError(res.reason || 'Unexpected response', 200, res.reason ?? undefined)
      const total = res.recordTotal ?? res.data.length
      const page = Number(q.page) + 1
      const size = Number(q.size)
      const items = res.data.map(({ code, name, count, mxikCount, internationalCode }): CatalogNode => ({
        code,
        name,
        count: count ?? mxikCount ?? 0,
        ...(internationalCode !== undefined && { internationalCode }),
      }))
      return { items, total, page, size, hasNext: page * size < total }
    })
  }

  function stats(opts: RequestOptions = {}): Promise<CatalogStats> {
    return load<CatalogStats, CatalogStats>('/info/mxik/dashboard-short-info', {}, opts.signal, body => body)
  }

  function units(opts: RequestOptions = {}): Promise<Unit[]> {
    const query = { pageNo: 0, pageSize: 1000, lang: opts.lang ?? lang }
    return load<ListEnvelope<Unit>, Unit[]>('/integration-mxik/references/get/units/all', query, opts.signal, (res) => {
      if (!res.success || !Array.isArray(res.data))
        throw new MxikError(res.reason || 'Unexpected response', 200, res.reason ?? undefined)
      return res.data
    })
  }

  function taxBenefits(opts: RequestOptions = {}): Promise<TaxBenefit[]> {
    return load<TaxBenefit[], TaxBenefit[]>('/integration-mxik/references/lgota', {}, opts.signal, (body) => {
      if (!Array.isArray(body))
        throw new MxikError('Unexpected response', 200)
      return body
    })
  }

  return {
    search,
    searchAll: (query, opts) => paginate(page => search(query, { ...opts, page })),
    get,
    filter,
    filterAll: (filters, opts) => paginate(page => filter(filters, { ...opts, page })),
    dvCert,
    card,
    searchSubpositions,
    children,
    childrenAll: (code, opts) => paginate(page => children(code, { ...opts, page })),
    stats,
    units,
    taxBenefits,
    cache: {
      async clear() {
        await cache?.clear()
      },
    },
  }
}

function resolveCache(option: MxikOptions['cache']): MxikCache | undefined {
  if (option === true)
    return createMemoryCache()
  return option || undefined
}

async function* paginate<T>(fetchPage: (page: number) => Promise<Page<T>>): AsyncGenerator<T> {
  for (let page = 1; ; page++) {
    const result = await fetchPage(page)
    yield* result.items
    if (!result.hasNext || !result.items.length)
      return
  }
}
