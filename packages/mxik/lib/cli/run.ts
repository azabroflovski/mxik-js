import type { Mxik } from '../client'
import type { Lang, Page } from '../types'
import { parseArgs } from 'node:util'
import { MxikError } from '../http'

export interface CliIO {
  mxik: (lang: Lang) => Mxik
  stdout: (line: string) => void
  stderr: (line: string) => void
  version: string
}

const HELP = `Usage: mxik <command> [options]

Commands:
  search <query>        Full-text search by name, brand or code
  filter                Search by fields: --brand, --barcode, --text, --code
  subpositions <query>  Search by product type, codes without a brand
  card <code>           Card of a code: barcode, tax benefit, packages
  get <code>            Code with names in Russian and Uzbek
  children [code]       Next level of the catalog tree, groups without a code
  stats                 Number of groups, classes, ..., codes in the catalog
  units                 Units of measurement
  tax-benefits          Tax benefits

Options:
  --lang <ru|uz>        Language of names (default: ru)
  --page <n>            Page number, starting from 1
  --size <n>            Page size (default: 20)
  --json                Print raw JSON
  -h, --help            Show this help
  -v, --version         Show the version

Examples:
  mxik search кофе
  mxik filter --barcode 6934177746536
  mxik card 00901001001048023 --lang uz
  mxik children 009`

/** Runs the CLI and returns the exit code. */
export async function run(argv: string[], io: CliIO): Promise<number> {
  let parsed
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        lang: { type: 'string' },
        page: { type: 'string' },
        size: { type: 'string' },
        json: { type: 'boolean' },
        brand: { type: 'string' },
        barcode: { type: 'string' },
        text: { type: 'string' },
        code: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
        version: { type: 'boolean', short: 'v' },
      },
    })
  }
  catch (error) {
    io.stderr((error as Error).message)
    return 2
  }

  const { values, positionals: [command, ...args] } = parsed
  if (values.version) {
    io.stdout(io.version)
    return 0
  }
  if (values.help || !command || command === 'help') {
    io.stdout(HELP)
    return command || values.help ? 0 : 2
  }

  const lang = values.lang ?? 'ru'
  if (lang !== 'ru' && lang !== 'uz') {
    io.stderr(`--lang must be "ru" or "uz", got "${lang}"`)
    return 2
  }
  const page = values.page ? Number(values.page) : undefined
  const size = values.size ? Number(values.size) : undefined
  for (const [name, value] of [['page', page], ['size', size]] as const) {
    if (value !== undefined && (!Number.isInteger(value) || value < 1)) {
      io.stderr(`--${name} must be a positive integer`)
      return 2
    }
  }

  const mxik = io.mxik(lang)
  const pageOptions = { page, size }
  const json = (value: unknown): number => {
    io.stdout(JSON.stringify(value, null, 2))
    return 0
  }
  const printPage = <T>(result: Page<T>, line: (item: T) => string): number => {
    if (values.json)
      return json(result)
    if (!result.items.length) {
      io.stderr('Nothing found')
      return 1
    }
    for (const item of result.items)
      io.stdout(line(item))
    const pages = Math.max(1, Math.ceil(result.total / result.size))
    io.stderr(`\nPage ${result.page} of ${pages}, ${result.total} total`)
    return 0
  }
  const requireArg = (name: string): string | undefined => {
    const value = args.join(' ').trim()
    if (!value)
      io.stderr(`Missing <${name}>. Run "mxik help" for usage.`)
    return value || undefined
  }

  try {
    switch (command) {
      case 'search': {
        const query = requireArg('query')
        if (!query)
          return 2
        return printPage(await mxik.search(query, pageOptions), i => `${i.mxikCode}  ${i.name}`)
      }
      case 'filter': {
        const filters = { brand: values.brand, barcode: values.barcode, text: values.text, code: values.code }
        if (!Object.values(filters).some(Boolean)) {
          io.stderr('filter needs at least one of --brand, --barcode, --text, --code')
          return 2
        }
        return printPage(await mxik.filter(filters, pageOptions), i => `${i.mxikCode}  ${i.mxikName}`)
      }
      case 'subpositions': {
        const query = requireArg('query')
        if (!query)
          return 2
        return printPage(await mxik.searchSubpositions(query, pageOptions), i => `${i.mxikCode}  ${i.mxikName}`)
      }
      case 'card':
      case 'get': {
        const code = requireArg('code')
        if (!code)
          return 2
        const result = command === 'card' ? await mxik.card(code) : await mxik.get(code)
        if (!result) {
          io.stderr(`Code ${code} not found`)
          return 1
        }
        if (values.json)
          return json(result)
        for (const [key, value] of Object.entries(result)) {
          if (value !== null && value !== '' && typeof value !== 'object')
            io.stdout(`${key.padEnd(20)} ${value}`)
          else if (Array.isArray(value) && value.length)
            io.stdout(`${key.padEnd(20)} ${value.map(item => item.name ?? item.nameRu).join('; ')}`)
        }
        return 0
      }
      case 'children':
        return printPage(
          await mxik.children(args[0], pageOptions),
          i => `${i.code}  ${i.name ?? '(no brand)'}  ${i.count}${i.internationalCode ? `  ${i.internationalCode}` : ''}`,
        )
      case 'stats': {
        const stats = await mxik.stats()
        if (values.json)
          return json(stats)
        for (const [key, value] of Object.entries(stats))
          io.stdout(`${key.replace(/Count$/, '').padEnd(12)} ${value}`)
        return 0
      }
      case 'units': {
        const units = await mxik.units()
        if (values.json)
          return json(units)
        for (const unit of units)
          io.stdout(`${String(unit.id).padStart(4)}  ${unit.name}`)
        return 0
      }
      case 'tax-benefits': {
        const benefits = await mxik.taxBenefits()
        if (values.json)
          return json(benefits)
        for (const benefit of benefits)
          io.stdout(`${benefit.id}  ${lang === 'uz' ? benefit.nameUz : benefit.nameRu}`)
        return 0
      }
      default:
        io.stderr(`Unknown command "${command}". Run "mxik help" for usage.`)
        return 2
    }
  }
  catch (error) {
    if (error instanceof MxikError)
      io.stderr(`API error: ${error.reason ?? error.message}`)
    else if (error instanceof TypeError)
      io.stderr(error.message)
    else
      io.stderr(`Request failed: ${(error as Error).message}`)
    return 1
  }
}
