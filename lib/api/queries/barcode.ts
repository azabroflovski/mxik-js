import { fetchByParams } from '@lib/api/queries/params'

/**
 * Fetches data by barcode.
 *
 * @param {string} code - The barcode to search for.
 * @returns - A promise that resolves with the API response.
 */
export function fetchByBarcode(code: string) {
  return fetchByParams({
    gtin: code,
  })
}
