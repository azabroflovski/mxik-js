import { $api } from '@lib/api'

/**
 * Fetches data by given parameters.
 *
 * @param {Partial<Record<keyof ByParamsResultItem, any>>} params - The parameters to search by.
 * @returns - A promise that resolves with the API response.
 */
export function fetchByParams(params: Partial<Record<keyof ByParamsResultItem, any>>) {
  return $api<ResponseSchemaWithContent<ByParamsResultItem[]>>('/mxik/search/by-params', {
    query: {
      ...params,
      size: 20,
      page: 0,
      lang: 'ru',
    },
  })
}
