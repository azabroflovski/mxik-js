import { afterEach, describe, expect, spyOn, test } from 'bun:test'
import { createMxikClient, fetchByCode, MxikClient } from '../../lib'

const raw = { success: false, code: 0, reason: 'Mxik code not found!', data: null, errors: null }

describe('legacy API', () => {
  const fetchSpy = spyOn(globalThis, 'fetch')
  afterEach(() => fetchSpy.mockReset())

  test('returns raw envelope without throwing on success: false', async () => {
    fetchSpy.mockResolvedValue(Response.json(raw))
    expect(await fetchByCode(1)).toEqual(raw)
  })

  test('MxikClient methods hit the same endpoints with the same params', async () => {
    fetchSpy.mockImplementation((async () => Response.json(raw)) as unknown as typeof fetch)
    const client = createMxikClient()
    expect(client).toBeInstanceOf(MxikClient)

    await client.search('kofe')
    await client.brand('Xiaomi')
    await client.barcode('0000')
    await client.code('00406001001232001')
    await client.dvCert('123')
    await client.params({ brandName: 'Xiaomi' })

    const urls = fetchSpy.mock.calls.map(([input]) => {
      const url = new URL(String(input))
      return `${url.pathname}?${url.searchParams}`
    })
    expect(urls).toEqual([
      '/api/cls-api/elasticsearch/search?search=kofe&page=0&size=20&lang=ru',
      '/api/cls-api/mxik/search/by-params?brandName=Xiaomi&page=0&size=20&lang=ru',
      '/api/cls-api/mxik/search/by-params?gtin=0000&page=0&size=20&lang=ru',
      '/api/cls-api/integration-mxik/get/history/00406001001232001?',
      '/api/cls-api/mxik/search/dv-cert-number?dvCertNumber=123&page=0&size=20&lang=ru',
      '/api/cls-api/mxik/search/by-params?brandName=Xiaomi&page=0&size=20&lang=ru',
    ])
  })
})
