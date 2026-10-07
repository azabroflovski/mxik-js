import { describe, expect, test } from 'bun:test'
import { createMxik, isMxikCode, MxikError } from '../../lib'

interface Call { url: URL, init?: RequestInit }

function mockFetch(...bodies: Array<unknown | Response>) {
  const calls: Call[] = []
  const fetch = (async (input: string, init?: RequestInit) => {
    calls.push({ url: new URL(input), init })
    const body = bodies[Math.min(calls.length - 1, bodies.length - 1)]
    return body instanceof Response ? body : Response.json(body)
  }) as typeof globalThis.fetch
  return { fetch, calls }
}

function springPage<T>(content: T[], { number = 0, size = 20, total = content.length } = {}) {
  return {
    success: true,
    code: 200,
    reason: 'OK',
    data: { content, totalElements: total, number, size, last: (number + 1) * size >= total },
    errors: null,
  }
}

describe('search', () => {
  test('sends defaults and unwraps the result', async () => {
    const { fetch, calls } = mockFetch({ success: true, code: 200, reason: 'success', data: [{ mxikCode: '1' }], recordTotal: 45 })
    const page = await createMxik({ fetch }).search('кофе')

    expect(calls[0].url.pathname).toBe('/api/cls-api/elasticsearch/search')
    expect(Object.fromEntries(calls[0].url.searchParams)).toEqual({ search: 'кофе', page: '0', size: '20', lang: 'ru' })
    expect(page).toEqual({ items: [{ mxikCode: '1' }] as any, total: 45, page: 1, size: 20, hasNext: true })
  })

  test('page is 1-based, options override client defaults', async () => {
    const { fetch, calls } = mockFetch({ success: true, data: [], recordTotal: 45 })
    const page = await createMxik({ fetch, lang: 'uz', pageSize: 10 }).search('x', { page: 3, size: 15 })

    expect(calls[0].url.searchParams.get('page')).toBe('2')
    expect(calls[0].url.searchParams.get('size')).toBe('15')
    expect(calls[0].url.searchParams.get('lang')).toBe('uz')
    expect(page.hasNext).toBe(false)
  })

  test('throws MxikError on success: false', async () => {
    const { fetch } = mockFetch({ success: false, code: 500, reason: 'boom', data: null })
    const error = await createMxik({ fetch }).search('x').catch(e => e)

    expect(error).toBeInstanceOf(MxikError)
    expect(error.reason).toBe('boom')
  })
})

describe('get', () => {
  test('returns details', async () => {
    const { fetch, calls } = mockFetch({ success: true, data: { mxikCode: '00406001001232001' } })
    const details = await createMxik({ fetch }).get('00406001001232001')

    expect(calls[0].url.pathname).toBe('/api/cls-api/integration-mxik/get/history/00406001001232001')
    expect(details?.mxikCode).toBe('00406001001232001')
  })

  test('returns null when code is not found', async () => {
    const { fetch } = mockFetch({ success: false, code: 0, reason: 'Mxik code not found!', data: null })
    expect(await createMxik({ fetch }).get('99999999999999999')).toBeNull()
  })

  test('throws on other API errors', async () => {
    const { fetch } = mockFetch({ success: false, code: 0, reason: 'Internal error', data: null })
    await expect(createMxik({ fetch }).get('1')).rejects.toBeInstanceOf(MxikError)
  })
})

describe('filter', () => {
  test('maps filters to API params', async () => {
    const { fetch, calls } = mockFetch(springPage([]))
    await createMxik({ fetch }).filter({ text: 't', brand: 'b', code: 'c', barcode: 'g' })

    expect(calls[0].url.pathname).toBe('/api/cls-api/mxik/search/by-params')
    expect(Object.fromEntries(calls[0].url.searchParams)).toEqual({
      text: 't',
      brandName: 'b',
      mxikCode: 'c',
      gtin: 'g',
      page: '0',
      size: '20',
      lang: 'ru',
    })
  })

  test('omits unset filters', async () => {
    const { fetch, calls } = mockFetch(springPage([]))
    await createMxik({ fetch }).filter({ brand: 'Xiaomi' })

    expect([...calls[0].url.searchParams.keys()]).toEqual(['brandName', 'page', 'size', 'lang'])
  })

  test('unwraps the page', async () => {
    const { fetch } = mockFetch(springPage([{ mxikCode: '1' }], { number: 1, size: 1, total: 3 }))
    const page = await createMxik({ fetch }).filter({ brand: 'x' })

    expect(page).toEqual({ items: [{ mxikCode: '1' }] as any, total: 3, page: 2, size: 1, hasNext: true })
  })

  test('"not data found" for barcode is an empty page, not an error', async () => {
    const body = { ...springPage([]), success: false, code: -1, reason: 'not data found' }
    const { fetch } = mockFetch(body)
    const page = await createMxik({ fetch }).filter({ barcode: '0000' })

    expect(page.items).toEqual([])
    expect(page.total).toBe(0)
  })
})

describe('dvCert', () => {
  test('hits dv-cert endpoint', async () => {
    const { fetch, calls } = mockFetch(springPage([]))
    await createMxik({ fetch }).dvCert('UZ.123')

    expect(calls[0].url.pathname).toBe('/api/cls-api/mxik/search/dv-cert-number')
    expect(calls[0].url.searchParams.get('dvCertNumber')).toBe('UZ.123')
  })
})

describe('pagination', () => {
  test('filterAll walks all pages', async () => {
    const { fetch, calls } = mockFetch(
      springPage([{ mxikCode: '1' }, { mxikCode: '2' }], { number: 0, size: 2, total: 3 }),
      springPage([{ mxikCode: '3' }], { number: 1, size: 2, total: 3 }),
    )
    const codes: string[] = []
    for await (const item of createMxik({ fetch, pageSize: 2 }).filterAll({ brand: 'x' }))
      codes.push(item.mxikCode)

    expect(codes).toEqual(['1', '2', '3'])
    expect(calls.map(c => c.url.searchParams.get('page'))).toEqual(['0', '1'])
  })

  test('searchAll stops early on break', async () => {
    const { fetch, calls } = mockFetch({ success: true, data: [{ mxikCode: '1' }, { mxikCode: '2' }], recordTotal: 100 })
    // eslint-disable-next-line no-unreachable-loop
    for await (const _ of createMxik({ fetch, pageSize: 2 }).searchAll('x'))
      break

    expect(calls).toHaveLength(1)
  })
})

describe('http', () => {
  test('throws MxikError on HTTP errors', async () => {
    const { fetch } = mockFetch(new Response('nope', { status: 401, statusText: 'Unauthorized' }))
    const error = await createMxik({ fetch }).search('x').catch(e => e)

    expect(error).toBeInstanceOf(MxikError)
    expect(error.status).toBe(401)
  })

  test('throws MxikError on non-JSON body', async () => {
    const { fetch } = mockFetch(new Response('<html>', { status: 200 }))
    const error = await createMxik({ fetch }).search('x').catch(e => e)

    expect(error).toBeInstanceOf(MxikError)
    expect(error.cause).toBeInstanceOf(SyntaxError)
  })

  test('uses baseURL and headers', async () => {
    const { fetch, calls } = mockFetch(springPage([]))
    await createMxik({ fetch, baseURL: 'https://proxy.local/api', headers: { 'x-key': '1' } }).filter({})

    expect(calls[0].url.origin + calls[0].url.pathname).toBe('https://proxy.local/api/mxik/search/by-params')
    expect((calls[0].init?.headers as Record<string, string>)['x-key']).toBe('1')
  })

  test('passes abort signal through', async () => {
    const fetch = ((_: string, init?: RequestInit) => new Promise((_, reject) => {
      init?.signal?.addEventListener('abort', () => reject(init.signal!.reason))
    })) as typeof globalThis.fetch
    const controller = new AbortController()
    const promise = createMxik({ fetch }).search('x', { signal: controller.signal })
    controller.abort()

    await expect(promise).rejects.toHaveProperty('name', 'AbortError')
  })

  test('times out', async () => {
    const fetch = ((_: string, init?: RequestInit) => new Promise((_, reject) => {
      init?.signal?.addEventListener('abort', () => reject(init.signal!.reason))
    })) as typeof globalThis.fetch

    await expect(createMxik({ fetch, timeout: 10 }).search('x')).rejects.toHaveProperty('name', 'TimeoutError')
  })
})

describe('isMxikCode', () => {
  test.each([
    ['00406001001232001', true],
    ['0040600100123200', false],
    ['004060010012320011', false],
    ['0040600100123200a', false],
    [406001001232001, false],
  ])('%p → %p', (value, expected) => {
    expect(isMxikCode(value)).toBe(expected)
  })
})
