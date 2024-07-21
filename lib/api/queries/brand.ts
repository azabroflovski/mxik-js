import { fetchByParams } from '@lib/api/queries/params'

/**
 * Fetches data by brand name.
 *
 * @param {string} brandName - The brand name to search for.
 * @returns - A promise that resolves with the API response.
 */
export function fetchByBrand(brandName: string) {
  return fetchByParams({
    brandName,
  })
}
