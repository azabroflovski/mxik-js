import { createHttpClient } from '../shared'
import { AxiosResponse } from 'axios'

import {
    MXIKSearchParamsObj,
    MXIKSearchSymbolResponseObj
} from '../typings'

export const http = createHttpClient({
    baseURL: import.meta.env.MXIK_API_URL
})

/**
 * Search items via keyword
 * @param keyword {string}
 * @param size {number}
 * @returns {AxiosResponse}
 */
export function MXIKSearchSymbol({ keyword = '', limit = 20 }: MXIKSearchParamsObj): Promise<AxiosResponse<MXIKSearchSymbolResponseObj>> {
    return http.get('cls-api/mxik/search-symbol', {
        params: {
            search_text: keyword,
            size: limit,
        }
    })
}

/**
 * Search items by mxik code
 * @param {Object} params
 * @param {number} params.keyword
 * @param {number} params.limit
 * @returns {AxiosResponse}
 */
 export function MXIKSearchByParams({ keyword, limit = 20 }: MXIKSearchParamsObj): Promise<AxiosResponse<MXIKSearchSymbolResponseObj>> {
    return http.get('cls-api/mxik/search/by-params', {
        params: {
            mxikCode: keyword,
            size: limit,
        }
    })
}
