import { describe, expect, test } from 'bun:test'
import { createMxik } from '../../lib'
import { run } from '../../lib/cli/run'

function cli(...bodies: Array<unknown | Response>) {
  const urls: URL[] = []
  const out: string[] = []
  const err: string[] = []
  const fetch = (async (input: string) => {
    urls.push(new URL(input))
    const body = bodies[Math.min(urls.length - 1, bodies.length - 1)]
    return body instanceof Response ? body : Response.json(body)
  }) as typeof globalThis.fetch
  const io = {
    mxik: (lang: 'ru' | 'uz') => createMxik({ fetch, lang }),
    stdout: (line: string) => out.push(line),
    stderr: (line: string) => err.push(line),
    version: '1.2.3',
  }
  return { exec: (...argv: string[]) => run(argv, io), urls, out, err }
}

const searchPage = { success: true, data: [{ mxikCode: '00901001001048023', name: 'Молотый кофе' }], recordTotal: 45 }

describe('cli', () => {
  test('prints help and version', async () => {
    const { exec, out } = cli()
    expect(await exec('help')).toBe(0)
    expect(out[0]).toStartWith('Usage: mxik')
    expect(await exec('--version')).toBe(0)
    expect(out[1]).toBe('1.2.3')
  })

  test('exits with 2 without a command', async () => {
    expect(await cli().exec()).toBe(2)
  })

  test('search prints one line per item and a page footer', async () => {
    const { exec, out, err, urls } = cli(searchPage)

    expect(await exec('search', 'молотый', 'кофе', '--size', '20', '--lang', 'uz')).toBe(0)
    expect(urls[0].searchParams.get('search')).toBe('молотый кофе')
    expect(urls[0].searchParams.get('lang')).toBe('uz')
    expect(out).toEqual(['00901001001048023  Молотый кофе'])
    expect(err.join('')).toContain('Page 1 of 3, 45 total')
  })

  test('--json prints the result as is', async () => {
    const { exec, out } = cli(searchPage)
    await exec('search', 'кофе', '--json')

    expect(JSON.parse(out[0]).total).toBe(45)
  })

  test('filter maps flags to filters', async () => {
    const { exec, urls } = cli({ success: true, data: { content: [], totalElements: 0, number: 0, size: 20, last: true } })

    expect(await exec('filter', '--barcode', '6934177746536')).toBe(1)
    expect(urls[0].searchParams.get('gtin')).toBe('6934177746536')
  })

  test('filter without flags is a usage error', async () => {
    const { exec, urls } = cli()
    expect(await exec('filter')).toBe(2)
    expect(urls).toHaveLength(0)
  })

  test('card prints fields and packages', async () => {
    const { exec, out } = cli({ mxikCode: '00901001001048023', brandName: 'Maccoffee', lgotaId: null, packages: [{ name: 'шт. (пачка) 20 грамм' }] })

    expect(await exec('card', '00901001001048023')).toBe(0)
    expect(out).toContain(`${'brandName'.padEnd(20)} Maccoffee`)
    expect(out).toContain(`${'packages'.padEnd(20)} шт. (пачка) 20 грамм`)
    expect(out.some(line => line.startsWith('lgotaId'))).toBe(false)
  })

  test('card of an unknown code exits with 1', async () => {
    const { exec, err } = cli(new Response('MXIK ma\'lumotlari topilmadi', { status: 403 }))

    expect(await exec('card', '99999999999999999')).toBe(1)
    expect(err).toEqual(['Code 99999999999999999 not found'])
  })

  test('API errors exit with 1 and show the reason', async () => {
    const { exec, err } = cli({ success: false, code: 500, reason: 'boom', data: null })

    expect(await exec('search', 'кофе')).toBe(1)
    expect(err).toEqual(['API error: boom'])
  })

  test.each([
    [['search'], 'Missing <query>'],
    [['search', 'x', '--lang', 'en'], '--lang must be'],
    [['search', 'x', '--page', '0'], '--page must be a positive integer'],
    [['nope'], 'Unknown command "nope"'],
    [['search', '--nope'], 'Unknown option'],
  ])('%p is a usage error', async (argv, message) => {
    const { exec, err } = cli()

    expect(await exec(...argv)).toBe(2)
    expect(err.join('\n')).toContain(message)
  })
})
