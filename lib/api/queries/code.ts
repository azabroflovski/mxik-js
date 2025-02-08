import { $api } from '../'

/**
 * Fetches data by mxik code.
 *
 * @param {number | string} code - The mxik code to search for.
 * @returns - A promise that resolves with the API response.
 */
export function fetchByCode(code: number | string) {
  return $api<ResponseSchema<MxikDetails>>(`/integration-mxik/get/history/${code}`)
}
