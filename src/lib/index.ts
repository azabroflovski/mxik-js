import { MXIKSearchSymbol, MXIKSearchByParams, MXIKByCode, MXIKBySubpositions } from '../api'
import { MXIKCode, MXIKDetail, MXIKSearchOptionsObj, MXIKSearchResponseObj } from '../typings'
import { MXIKUnknownException } from '../exceptions'

/**
 * Search items by keyword
 * @param keyword {string}
 * @param limit {number}
 * @returns {Promise<MXIKSearchResponseObj>}
 */
export async function MXIKSearch(keyword: string, { limit }: MXIKSearchOptionsObj): Promise<MXIKSearchResponseObj> {
    try {
        const { data: response  } = await MXIKSearchSymbol({ keyword, limit })

        return {
            items: response.data.content,
            pagination: {
                totalPages: response.data.totalPages,
                totalItems: response.data.totalElements,
                perPage: response.data.size,
                isFirstPage: response.data.first,
                isLastPage: response.data.last,
            }
        }
    } catch (error) {
        throw new MXIKUnknownException('Something wrong')
    }
}

/**
 * Search items by mxik code
 * @param keyword {string}
 * @param limit {number}
 * @returns {Promise<MXIKSearchResponseObj>}
 */
 export async function MXIKSearchByCode(keyword: string, { limit }: MXIKSearchOptionsObj): Promise<MXIKSearchResponseObj> {
    try {
        const { data: response  } = await MXIKSearchByParams({ keyword, limit })

        return {
            items: response.data.content,
            pagination: {
                totalPages: response.data.totalPages,
                totalItems: response.data.totalElements,
                perPage: response.data.size,
                isFirstPage: response.data.first,
                isLastPage: response.data.last,
            }
        }
    } catch (error) {
        throw new MXIKUnknownException('Something wrong')
    }
}

/**
 * Get MXIK details by code
 * @param code {number}
 * @return {Promise<MXIKDetail>}
 */
export async function MXIKDetails(code: MXIKCode): Promise<MXIKDetail> {
     try {
        const { data: response  } = await MXIKByCode(code)
        
        return response

     } catch (error) {
         throw new MXIKUnknownException('Something wrong')
     }
}

/**
 * Search items by keyword in subpositions
 * @param keyword {string}
 * @param limit {number}
 * @returns {Promise<MXIKSearchResponseObj>}
 */
 export async function MXIKSearchBySubpositions(keyword: string, { limit }: MXIKSearchOptionsObj): Promise<MXIKSearchResponseObj> {
    try {
        const { data: response  } = await MXIKBySubpositions({ keyword, limit })

        return {
            items: response.data.content,
            pagination: {
                totalPages: response.data.totalPages,
                totalItems: response.data.totalElements,
                perPage: response.data.size,
                isFirstPage: response.data.first,
                isLastPage: response.data.last,
            }
        }
    } catch (error) {
        throw new MXIKUnknownException('Something wrong')
    }
}