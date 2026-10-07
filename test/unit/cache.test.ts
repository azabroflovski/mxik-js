import type { CacheEntry } from '../../lib'
import { afterEach, describe, expect, setSystemTime, test } from 'bun:test'
import { createMemoryCache, createMxik } from '../../lib'

function mockFetch(...bodies: unknown[]) {
  const urls: string[] = []
  const fetch = (async (input: string) => {
    urls.push(input)
    return Response.json(bodies[Math.min(urls.length - 1, bodies.length - 1)])
  }) as typeof globalThis.fetch
  return { fetch, urls }
}

const found = { success: true, code: 200, reason: 'success', data: [{ mxikCode: '1' }], recordTotal: 1 }

describe('client cache', () => {
  afterEach(() => setSystemTime())

  test('is off by default', async () => {
    const { fetch, urls } = mockFetch(found)
    const mxik = createMxik({ fetch })
    await mxik.search('x')
    await mxik.search('x')

    expect(urls).toHaveLength(2)
  })

  test('cache: true reuses results of identical requests', async () => {
    const { fetch, urls } = mockFetch(found)
    const mxik = createMxik({ fetch, cache: true })
    const first = await mxik.search('x')
    const second = await mxik.search('x')

    expect(urls).toHaveLength(1)
    expect(second).toEqual(first)
  })

  test('different query, page or lang are cached separately', async () => {
    const { fetch, urls } = mockFetch(found)
    const mxik = createMxik({ fetch, cache: true })
    await mxik.search('x')
    await mxik.search('y')
    await mxik.search('x', { page: 2 })
    await mxik.search('x', { lang: 'uz' })

    expect(urls).toHaveLength(4)
  })

  test('caches "not found" result of get()', async () => {
    const { fetch, urls } = mockFetch({ success: false, code: 0, reason: 'Mxik code not found!', data: null })
    const mxik = createMxik({ fetch, cache: true })

    expect(await mxik.get('1')).toBeNull()
    expect(await mxik.get('1')).toBeNull()
    expect(urls).toHaveLength(1)
  })

  test('doesn\'t cache errors', async () => {
    const { fetch, urls } = mockFetch({ success: false, code: 500, reason: 'boom', data: null }, found)
    const mxik = createMxik({ fetch, cache: true })

    await expect(mxik.search('x')).rejects.toThrow('boom')
    expect((await mxik.search('x')).items).toHaveLength(1)
    expect(urls).toHaveLength(2)
  })

  test('expires after ttl', async () => {
    const { fetch, urls } = mockFetch(found)
    const mxik = createMxik({ fetch, cache: { ttl: 1000 } })

    setSystemTime(new Date('2026-01-01T00:00:00Z'))
    await mxik.search('x')
    setSystemTime(new Date('2026-01-01T00:00:00.999Z'))
    await mxik.search('x')
    expect(urls).toHaveLength(1)

    setSystemTime(new Date('2026-01-01T00:00:01Z'))
    await mxik.search('x')
    expect(urls).toHaveLength(2)
  })

  test('works with a Map', async () => {
    const { fetch, urls } = mockFetch(found)
    const store = new Map<string, CacheEntry>()
    const mxik = createMxik({ fetch, cache: { store } })
    await mxik.search('x')
    await mxik.search('x')

    expect(urls).toHaveLength(1)
    expect([...store.keys()]).toEqual(['https://tasnif.soliq.uz/api/cls-api/elasticsearch/search?search=x&page=0&size=20&lang=ru'])
  })

  test('works with an async store', async () => {
    const { fetch, urls } = mockFetch(found)
    const map = new Map<string, string>()
    const store = {
      get: async (key: string) => map.has(key) ? JSON.parse(map.get(key)!) as CacheEntry : undefined,
      set: async (key: string, entry: CacheEntry) => map.set(key, JSON.stringify(entry)),
      delete: async (key: string) => map.delete(key),
      clear: async () => map.clear(),
    }
    const mxik = createMxik({ fetch, cache: { store } })
    await mxik.search('x')
    const cached = await mxik.search('x')

    expect(urls).toHaveLength(1)
    expect(cached.items).toEqual(found.data as any)

    await mxik.cache.clear()
    expect(map.size).toBe(0)
  })

  test('deletes expired entries from the store', async () => {
    const { fetch } = mockFetch({ success: false, code: 500, reason: 'boom', data: null })
    const store = new Map<string, CacheEntry>([['https://tasnif.soliq.uz/api/cls-api/integration-mxik/get/history/1', { value: null, expires: 0 }]])
    const mxik = createMxik({ fetch, cache: { store } })

    await expect(mxik.get('1')).rejects.toThrow('boom')
    expect(store.size).toBe(0)
  })

  test('mxik.cache.clear() drops cached results', async () => {
    const { fetch, urls } = mockFetch(found)
    const mxik = createMxik({ fetch, cache: true })
    await mxik.search('x')
    await mxik.cache.clear()
    await mxik.search('x')

    expect(urls).toHaveLength(2)
  })

  test('mxik.cache.clear() is a no-op when caching is off', async () => {
    const { fetch } = mockFetch(found)
    expect(await createMxik({ fetch }).cache.clear()).toBeUndefined()
  })
})

describe('createMemoryCache', () => {
  const entry = (value: unknown): CacheEntry => ({ value, expires: Infinity })

  test('evicts the least recently used entry', () => {
    const cache = createMemoryCache({ max: 2 })
    cache.set('a', entry(1))
    cache.set('b', entry(2))
    cache.get('a')
    cache.set('c', entry(3))

    expect(cache.size).toBe(2)
    expect(cache.get('a')?.value).toBe(1)
    expect(cache.get('b')).toBeUndefined()
    expect(cache.get('c')?.value).toBe(3)
  })

  test('overwriting a key doesn\'t grow the cache', () => {
    const cache = createMemoryCache({ max: 2 })
    cache.set('a', entry(1))
    cache.set('a', entry(2))

    expect(cache.size).toBe(1)
    expect(cache.get('a')?.value).toBe(2)
  })

  test('clear and delete', () => {
    const cache = createMemoryCache()
    cache.set('a', entry(1))
    cache.set('b', entry(2))
    cache.delete('a')
    expect(cache.size).toBe(1)
    cache.clear()
    expect(cache.size).toBe(0)
  })

  test('can be cleared through the client store', async () => {
    const { fetch, urls } = mockFetch(found)
    const cache = createMemoryCache()
    const mxik = createMxik({ fetch, cache: { store: cache } })
    await mxik.search('x')
    cache.clear()
    await mxik.search('x')

    expect(urls).toHaveLength(2)
  })
})
