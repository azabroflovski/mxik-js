import { $api } from '@/lib/api'

/**
 * Fetches data by keyword.
 *
 * @param {string} keyword - The keyword to search for.
 * @returns - A promise that resolves with the API response.
 */
export function fetchByKeyword(keyword: string) {
  return $api<ResponseSchema<SearchResultItem[]>>(`/elasticsearch/search`, {
    query: {
      search: keyword,
      size: 20,
      page: 0,
      lang: 'ru',
    },
  })
}
