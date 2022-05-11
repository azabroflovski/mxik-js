import { MXIKSearchSymbol } from '../api'
import { MXIKSearchOptionsObj, MXIKSearchResponseObj } from '../typings'

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
        throw error
    }
}
