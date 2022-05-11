import { createHttpClient } from '../shared'
import { AxiosResponse } from 'axios'

import {
    MXIKSearchParamsObj,
    MXIKSearchSymbolResponseObj
} from '../typings'

export const http = createHttpClient({
    baseURL: 'https://tasnif.soliq.uz/api' // see .env
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
