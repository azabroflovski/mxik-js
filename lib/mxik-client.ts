import {
  fetchByBarcode,
  fetchByBrand,
  fetchByCode,
  fetchByDvCert,
  fetchByKeyword,
  fetchByParams,
} from '@lib/api'

/**
 * A client for interacting with the MXIK API.
 */
export class MxikClient {
  /**
   * Searches by keyword.
   * @param {string} name - The keyword to search for.
   * @returns - A promise that resolves with the API response.
   */
  public search(name: string) {
    return fetchByKeyword(name)
  }

  /**
   * Searches by brand name.
   * @param {string} name - The brand name to search for.
   * @returns - A promise that resolves with the API response.
   */
  public brand(name: string) {
    return fetchByBrand(name)
  }

  /**
   * Searches by barcode.
   * @param {string} code - The barcode to search for.
   * @returns - A promise that resolves with the API response.
   */
  public barcode(code: string) {
    return fetchByBarcode(code)
  }

  /**
   * Searches by code.
   * @param {string | number} value - The code to search for.
   * @returns - A promise that resolves with the API response.
   */
  public code(value: string | number) {
    return fetchByCode(value)
  }

  /**
   * Searches by DV certificate number.
   * @param {string | number} certNumber - The DV certificate number to search for.
   * @returns - A promise that resolves with the API response.
   */
  public dvCert(certNumber: string | number) {
    return fetchByDvCert(certNumber)
  }

  /**
   * Searches by parameters.
   * @param {Partial<Record<keyof ByParamsResultItem, any>>} attributes - The attributes to search for.
   * @returns - A promise that resolves with the API response.
   */
  public params(attributes: Partial<Record<keyof ByParamsResultItem, any>>) {
    return fetchByParams(attributes)
  }
}
