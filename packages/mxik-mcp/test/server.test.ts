import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { describe, expect, test } from 'bun:test'
import { createMxik } from 'mxik'
import { createServer } from '../src/server'

async function connect(...bodies: Array<unknown | Response>) {
  const urls: URL[] = []
  const fetch = (async (input: string) => {
    urls.push(new URL(input))
    const body = bodies[Math.min(urls.length - 1, bodies.length - 1)]
    return body instanceof Response ? body : Response.json(body)
  }) as typeof globalThis.fetch

  const server = createServer(createMxik({ fetch }))
  const client = new Client({ name: 'test', version: '0.0.0' })
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)])

  const call = async (name: string, args: Record<string, unknown> = {}) => {
    const result = await client.callTool({ name, arguments: args }) as { isError?: boolean, content: Array<{ text: string }> }
    const raw = result.content[0].text
    let json: any
    try {
      json = JSON.parse(raw)
    }
    catch {}
    return { isError: Boolean(result.isError), raw, json }
  }
  return { client, call, urls }
}

describe('mcp server', () => {
  test('lists tools', async () => {
    const { client } = await connect()
    const { tools } = await client.listTools()

    expect(tools.map(t => t.name).sort()).toEqual([
      'browse_catalog',
      'filter_mxik_codes',
      'get_mxik_card',
      'get_tax_benefit',
      'search_mxik_codes',
      'search_product_types',
    ])
  })

  test('search_mxik_codes returns compact items', async () => {
    const { call, urls } = await connect({
      success: true,
      recordTotal: 28,
      data: [{ mxikCode: '00901001001048023', name: 'Молотый кофе', brandName: 'Maccoffee', internationalCode: null, unitsName: 'шт.', groupName: 'КОФЕ' }],
    })
    const { json } = await call('search_mxik_codes', { query: 'Maccoffee', size: 1, lang: 'uz' })

    expect(urls[0].searchParams.get('lang')).toBe('uz')
    expect(json).toEqual({
      total: 28,
      page: 1,
      hasNext: true,
      items: [{ code: '00901001001048023', name: 'Молотый кофе', brand: 'Maccoffee', units: 'шт.' }],
    })
  })

  test('filter_mxik_codes needs at least one field', async () => {
    const { call, urls } = await connect()
    const result = await call('filter_mxik_codes', {})

    expect(result.isError).toBe(true)
    expect(urls).toHaveLength(0)
  })

  test('filter_mxik_codes by barcode', async () => {
    const { call, urls } = await connect({ success: true, data: { content: [{ mxikCode: '08504003009011001', mxikName: 'Зарядное устройство', brandName: 'XIAOMI', internationalCode: '6934177746536' }], totalElements: 1, number: 0, size: 20, last: true } })
    const { json } = await call('filter_mxik_codes', { barcode: '6934177746536' })

    expect(urls[0].searchParams.get('gtin')).toBe('6934177746536')
    expect(json.items[0]).toEqual({ code: '08504003009011001', name: 'Зарядное устройство', brand: 'XIAOMI', barcode: '6934177746536' })
  })

  test('get_mxik_card drops empty fields and flattens packages', async () => {
    const { call } = await connect({ mxikCode: '00901001001048023', mxikName: 'Молотый кофе', lgotaId: null, label: 0, units: null, packages: [{ name: 'шт. (пачка) 20 грамм' }] })
    const { json } = await call('get_mxik_card', { code: '00901001001048023' })

    expect(json).toEqual({ mxikCode: '00901001001048023', mxikName: 'Молотый кофе', packages: ['шт. (пачка) 20 грамм'] })
  })

  test('get_mxik_card for an unknown code', async () => {
    const { call } = await connect(new Response('MXIK ma\'lumotlari topilmadi', { status: 403 }))
    const result = await call('get_mxik_card', { code: '99999999999999999' })

    expect(result.isError).toBe(false)
    expect(result.raw).toBe('Code 99999999999999999 does not exist.')
  })

  test('get_mxik_card validates the code', async () => {
    const { call, urls } = await connect()
    const result = await call('get_mxik_card', { code: '123' })

    expect(result.isError).toBe(true)
    expect(urls).toHaveLength(0)
  })

  test('browse_catalog without a code lists groups', async () => {
    const { call, urls } = await connect({ success: true, recordTotal: 117, data: [{ code: '009', name: 'КОФЕ', mxikCount: 2312 }] })
    const { json } = await call('browse_catalog', { size: 1 })

    expect(urls[0].pathname).toBe('/api/cls-api/group')
    expect(json.items).toEqual([{ code: '009', name: 'КОФЕ', count: 2312 }])
  })

  test('get_tax_benefit finds one benefit by id', async () => {
    const { call } = await connect([{ id: 1, nameRu: 'a' }, { id: 102870, nameRu: 'лекарства' }])

    expect((await call('get_tax_benefit', { id: 102870 })).json).toEqual({ id: 102870, nameRu: 'лекарства' })
    expect((await call('get_tax_benefit', { id: 5 })).raw).toBe('Tax benefit 5 does not exist.')
  })

  test('API errors become tool errors', async () => {
    const { call } = await connect({ success: false, code: 500, reason: 'boom', data: null })
    const result = await call('search_mxik_codes', { query: 'x' })

    expect(result.isError).toBe(true)
    expect(result.raw).toBe('tasnif.soliq.uz API error: boom')
  })
})
