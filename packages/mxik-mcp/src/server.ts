import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { CatalogItem, Mxik, MxikCard, Page, SearchItem } from 'mxik'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { MxikError } from 'mxik'
import { z } from 'zod'
import pkg from '../package.json' with { type: 'json' }

const lang = z.enum(['ru', 'uz']).optional().describe('Language of names: "ru" (default) or "uz" (Uzbek Cyrillic)')
const page = z.number().int().min(1).optional().describe('Page number, starting from 1')
const size = z.number().int().min(1).max(100).optional().describe('Results per page, 20 by default')
const code17 = z.string().regex(/^\d{17}$/, 'MXIK code is exactly 17 digits').describe('17-digit MXIK (IKPU) code, keep leading zeros')

function text(value: unknown): CallToolResult {
  return { content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) }] }
}

function withoutEmpty<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== null && v !== undefined && v !== '')) as Partial<T>
}

function pageResult<T, R>(result: Page<T>, map: (item: T) => R): CallToolResult {
  return text({ total: result.total, page: result.page, hasNext: result.hasNext, items: result.items.map(map) })
}

function searchItem(i: SearchItem): object {
  return withoutEmpty({
    code: i.mxikCode,
    name: i.name,
    brand: i.brandName,
    barcode: i.internationalCode,
    units: i.unitsName,
  })
}

function catalogItem(i: CatalogItem): object {
  return withoutEmpty({
    code: i.mxikCode,
    name: i.mxikName,
    brand: i.brandName,
    barcode: i.internationalCode,
  })
}

function card(c: MxikCard): object {
  return withoutEmpty({
    ...c,
    label: undefined,
    useCard: undefined,
    myProduct: undefined,
    units: undefined,
    packages: c.packages?.map(p => p.name),
  })
}

async function guard(run: () => Promise<CallToolResult>): Promise<CallToolResult> {
  try {
    return await run()
  }
  catch (error) {
    const message = error instanceof MxikError
      ? `tasnif.soliq.uz API error: ${error.reason ?? error.message}`
      : `Request failed: ${(error as Error).message}`
    return { isError: true, content: [{ type: 'text', text: message }] }
  }
}

/** MCP server exposing the tasnif.soliq.uz catalog through `mxik`. */
export function createServer(mxik: Mxik): McpServer {
  const server = new McpServer(
    { name: 'mxik', version: pkg.version },
    {
      instructions: 'Tools for MXIK (IKPU, ИКПУ) codes: the national catalogue of goods and services of Uzbekistan, from tasnif.soliq.uz. '
        + 'Codes are 17 digits, keep them as strings. To find a code for a product, start with search_mxik_codes or, '
        + 'if there is a barcode, filter_mxik_codes. Confirm the choice with get_mxik_card. Unofficial client.',
    },
  )

  server.registerTool('search_mxik_codes', {
    title: 'Search MXIK codes',
    description: 'Full-text search over the catalog by product name, brand, attributes or code. Cyrillic and Latin both work.',
    inputSchema: { query: z.string().min(1).describe('Product name, brand or part of a code, e.g. "кофе Maccoffee"'), page, size, lang },
  }, ({ query, ...options }) => guard(async () => pageResult(await mxik.search(query, options), searchItem)))

  server.registerTool('filter_mxik_codes', {
    title: 'Find MXIK codes by field',
    description: 'Find codes by barcode (GTIN), brand, words or exact code. A barcode takes priority over other fields.',
    inputSchema: {
      barcode: z.string().optional().describe('Product barcode (GTIN/EAN) from the package'),
      brand: z.string().optional().describe('Brand name, partial match'),
      text: z.string().optional().describe('Words in the name, brand or attributes'),
      code: code17.optional(),
      page,
      size,
      lang,
    },
  }, ({ barcode, brand, text: words, code, ...options }) => guard(async () => {
    if (!barcode && !brand && !words && !code)
      return { isError: true, content: [{ type: 'text', text: 'Pass at least one of barcode, brand, text or code.' }] }
    return pageResult(await mxik.filter({ barcode, brand, text: words, code }, options), catalogItem)
  }))

  server.registerTool('search_product_types', {
    title: 'Search product types',
    description: 'Find generic codes for a type of product, without a brand (sub-positions), e.g. "ground coffee".',
    inputSchema: { query: z.string().min(1).describe('Product type, e.g. "молотый кофе"'), page, size, lang },
  }, ({ query, ...options }) => guard(async () => pageResult(await mxik.searchSubpositions(query, options), catalogItem)))

  server.registerTool('get_mxik_card', {
    title: 'Get MXIK code card',
    description: 'Full card of a code: names on every level of the catalog, barcode, short name, tax benefit (lgotaId) and package units.',
    inputSchema: { code: code17, lang },
  }, ({ code, lang }) => guard(async () => {
    const result = await mxik.card(code, { lang })
    return result ? text(card(result)) : text(`Code ${code} does not exist.`)
  }))

  server.registerTool('browse_catalog', {
    title: 'Browse the MXIK catalog',
    description: 'List the next level of the catalog tree: groups (no code), then classes (3-digit group), positions (5), '
      + 'sub-positions (8), brands (11) and codes (14-digit brand). Each entry has a code, a name and the number of codes under it.',
    inputSchema: {
      code: z.string().regex(/^(\d{3}|\d{5}|\d{8}|\d{11}|\d{14})$/, 'Code of 3, 5, 8, 11 or 14 digits').optional().describe('Parent code; omit to list groups'),
      text: z.string().optional().describe('Filter entries by name'),
      page,
      size,
      lang,
    },
  }, ({ code, ...options }) => guard(async () => pageResult(await mxik.children(code, options), withoutEmpty)))

  server.registerTool('get_tax_benefit', {
    title: 'Get tax benefit',
    description: 'Tax benefit (льгота, imtiyoz) by id, e.g. the lgotaId from get_mxik_card, with the legal document that grants it.',
    inputSchema: { id: z.number().int().describe('Tax benefit id') },
  }, ({ id }) => guard(async () => {
    const benefit = (await mxik.taxBenefits()).find(b => b.id === id)
    return benefit ? text(benefit) : text(`Tax benefit ${id} does not exist.`)
  }))

  return server
}
