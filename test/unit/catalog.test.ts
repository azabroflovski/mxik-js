import { describe, expect, test } from 'bun:test'
import { createMxik, MxikError } from '../../lib'

interface Call { url: URL }

function mockFetch(...bodies: Array<unknown | Response>) {
  const calls: Call[] = []
  const fetch = (async (input: string) => {
    calls.push({ url: new URL(input) })
    const body = bodies[Math.min(calls.length - 1, bodies.length - 1)]
    return body instanceof Response ? body : Response.json(body)
  }) as typeof globalThis.fetch
  return { fetch, calls }
}

function list<T>(data: T[], recordTotal = data.length) {
  return { success: true, code: 200, reason: 'success', data, recordTotal }
}

const query = (call: Call) => Object.fromEntries(call.url.searchParams)

describe('card', () => {
  const card = { mxikCode: '00901001001048023', mxikName: 'Молотый кофе', packages: [] }

  test('requests by-mxik with the client language', async () => {
    const { fetch, calls } = mockFetch(card)
    const result = await createMxik({ fetch, lang: 'uz' }).card('00901001001048023')

    expect(calls[0].url.pathname).toBe('/api/cls-api/mxik/get/by-mxik')
    expect(query(calls[0])).toEqual({ mxikCode: '00901001001048023', lang: 'uz' })
    expect(result).toEqual(card as any)
  })

  test('returns null for an unknown code', async () => {
    const { fetch } = mockFetch(new Response('MXIK ma\'lumotlari topilmadi', { status: 403 }))
    expect(await createMxik({ fetch }).card('99999999999999999')).toBeNull()
  })

  test('throws on other 403 responses', async () => {
    const { fetch } = mockFetch(new Response('Access denied', { status: 403 }))
    const error = await createMxik({ fetch }).card('1').catch(e => e)

    expect(error).toBeInstanceOf(MxikError)
    expect(error.status).toBe(403)
    expect(error.reason).toBe('Access denied')
  })

  test('caches "not found"', async () => {
    const { fetch, calls } = mockFetch(new Response('MXIK ma\'lumotlari topilmadi', { status: 403 }))
    const mxik = createMxik({ fetch, cache: true })
    await mxik.card('1')
    expect(await mxik.card('1')).toBeNull()
    expect(calls).toHaveLength(1)
  })
})

describe('searchSubpositions', () => {
  test('hits search-subposition with search_text', async () => {
    const page = { success: true, data: { content: [{ mxikCode: '00901001001000000' }], totalElements: 1, number: 0, size: 20, last: true } }
    const { fetch, calls } = mockFetch(page)
    const result = await createMxik({ fetch }).searchSubpositions('кофе')

    expect(calls[0].url.pathname).toBe('/api/cls-api/mxik/search-subposition')
    expect(query(calls[0])).toEqual({ search_text: 'кофе', page: '0', size: '20', lang: 'ru' })
    expect(result.items).toHaveLength(1)
  })
})

describe('children', () => {
  test.each([
    [undefined, '/group', {}],
    ['009', '/class/short-info', { groupCode: '009' }],
    ['00901', '/position/short-info', { classCode: '00901' }],
    ['00901001', '/subposition/short-info', { positionCode: '00901001' }],
    ['00901001001', '/brand/short-info', { subPositionCode: '00901001001' }],
    ['00901001001048', '/brand/short-info-attribute', { brandCode: '00901001001048' }],
  ])('%p → %s', async (code, path, params) => {
    const { fetch, calls } = mockFetch(list([]))
    await createMxik({ fetch }).children(code)

    expect(calls[0].url.pathname).toBe(`/api/cls-api${path}`)
    expect(query(calls[0])).toEqual({ ...params, page: '0', size: '20', lang: 'ru' })
  })

  test('passes the text filter under each endpoint\'s own name', async () => {
    const { fetch, calls } = mockFetch(list([]))
    const mxik = createMxik({ fetch })
    await mxik.children('009', { text: 'x' })
    await mxik.children('00901001001', { text: 'x' })
    await mxik.children('00901001001048', { text: 'x' })

    expect(calls.map(c => [c.url.searchParams.get('text'), c.url.searchParams.get('branchName'), c.url.searchParams.get('name')]))
      .toEqual([['x', null, null], [null, 'x', null], [null, null, 'x']])
  })

  test('normalizes groups to code, name and count', async () => {
    const { fetch } = mockFetch(list([{ code: '009', name: 'КОФЕ', nameUz: 'КОФЕ', mxikCount: 2312, logoSvg: '<svg/>' }], 117))
    const page = await createMxik({ fetch, pageSize: 1 }).children()

    expect(page).toEqual({ items: [{ code: '009', name: 'КОФЕ', count: 2312 }], total: 117, page: 1, size: 1, hasNext: true })
  })

  test('keeps barcodes on 17-digit codes', async () => {
    const { fetch } = mockFetch(list([{ code: '00901001001048001', name: 'Café pho', internationalCode: '8886300070095', count: 1 }]))
    const page = await createMxik({ fetch }).children('00901001001048')

    expect(page.items[0]).toEqual({ code: '00901001001048001', name: 'Café pho', count: 1, internationalCode: '8886300070095' })
  })

  test('childrenAll walks all pages', async () => {
    const { fetch, calls } = mockFetch(
      list([{ code: '00901', name: 'Кофе', count: 425 }, { code: '00902', name: 'Чай', count: 1805 }], 3),
      list([{ code: '00903', name: 'Мате', count: 1 }], 3),
    )
    const codes: string[] = []
    for await (const node of createMxik({ fetch, pageSize: 2 }).childrenAll('009'))
      codes.push(node.code)

    expect(codes).toEqual(['00901', '00902', '00903'])
    expect(calls.map(c => c.url.searchParams.get('page'))).toEqual(['0', '1'])
  })

  test('rejects codes without children', async () => {
    const { fetch, calls } = mockFetch(list([]))
    await expect(createMxik({ fetch }).children('00901001001048023')).rejects.toBeInstanceOf(TypeError)
    expect(calls).toHaveLength(0)
  })
})

describe('references', () => {
  test('stats', async () => {
    const stats = { groupCount: 117, classCount: 1300, positionCount: 2905, subPositionCount: 10316, brandCount: 57625, mxikCount: 442337 }
    const { fetch, calls } = mockFetch(stats)

    expect(await createMxik({ fetch }).stats()).toEqual(stats)
    expect(calls[0].url.pathname).toBe('/api/cls-api/info/mxik/dashboard-short-info')
  })

  test('units requests everything in one page', async () => {
    const { fetch, calls } = mockFetch(list([{ id: 111, name: 'карат' }], 1))

    expect(await createMxik({ fetch }).units({ lang: 'uz' })).toEqual([{ id: 111, name: 'карат' }])
    expect(query(calls[0])).toEqual({ pageNo: '0', pageSize: '1000', lang: 'uz' })
  })

  test('taxBenefits', async () => {
    const { fetch, calls } = mockFetch([{ id: 100407, nameLatn: 'PQ-1600' }])

    expect(await createMxik({ fetch }).taxBenefits()).toEqual([{ id: 100407, nameLatn: 'PQ-1600' }] as any)
    expect(calls[0].url.pathname).toBe('/api/cls-api/integration-mxik/references/lgota')
  })
})
