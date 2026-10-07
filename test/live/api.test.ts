// Smoke tests against the real tasnif.soliq.uz API.
// They catch upstream changes, so they're not part of `bun run test`: run `bun run test:live`.
import { describe, expect, test } from 'bun:test'
import { createMxik, isMxikCode } from '../../lib'

const mxik = createMxik({ timeout: 20_000 })
const CODE = '00406001001232001'
const BARCODE = '6934177746536'

describe('live API', () => {
  test('search', async () => {
    const page = await mxik.search('кофе', { size: 5 })

    expect(page.items.length).toBe(5)
    expect(page.total).toBeGreaterThan(5)
    expect(page.hasNext).toBe(true)
    expect(isMxikCode(page.items[0].mxikCode)).toBe(true)
  })

  test('search in uz returns different names', async () => {
    const [ru, uz] = await Promise.all([
      mxik.search('кофе', { size: 1 }),
      mxik.search('кофе', { size: 1, lang: 'uz' }),
    ])
    expect(ru.items[0].mxikCode).toBe(uz.items[0].mxikCode)
    expect(ru.items[0].name).not.toBe(uz.items[0].name)
  })

  test('get', async () => {
    const details = await mxik.get(CODE)

    expect(details?.mxikCode).toBe(CODE)
    expect(details?.packageNames.length).toBeGreaterThan(0)
  })

  test('get unknown code', async () => {
    expect(await mxik.get('99999999999999999')).toBeNull()
  })

  test('filter by brand', async () => {
    const page = await mxik.filter({ brand: 'Xiaomi' }, { size: 3 })

    expect(page.items.length).toBe(3)
    expect(page.items.every(i => /xiaomi/i.test(i.brandName))).toBe(true)
  })

  test('filter by barcode', async () => {
    const page = await mxik.filter({ barcode: BARCODE })
    expect(page.items[0].internationalCode).toBe(BARCODE)
  })

  test('filter by unknown barcode', async () => {
    const page = await mxik.filter({ barcode: '0000' })
    expect(page.items).toEqual([])
  })

  test('filterAll paginates', async () => {
    const codes = new Set<string>()
    for await (const item of mxik.filterAll({ brand: 'Xiaomi' }, { size: 2 })) {
      codes.add(item.mxikCode)
      if (codes.size === 5)
        break
    }
    expect(codes.size).toBe(5)
  })

  test('dvCert', async () => {
    const page = await mxik.dvCert('1', { size: 1 })
    expect(Array.isArray(page.items)).toBe(true)
  })
})
