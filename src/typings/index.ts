export interface MXIKSortObj {
    sorted: boolean
    unsorted: boolean
    empty: boolean
}

export interface MXIKPageableObj {
    sort: NXIKItemUnitObj
    pageSize: number
    pageNumber: number
    offset: number
    unpaged: boolean
    paged: boolean
}

export interface NXIKItemUnitObj {
    id: number,
    name: string,
    nameUz: string,
    nameRu: string,
    nameEng?: string,
    nameLatin?: string,
    unit: string,
    commonUnitsId: number,
    difference?: string,
    description?: string
}

export interface MXIKItemObj {
    mxikCode: string,
    groupName: string,
    className: string,
    positionName: string,
    subPositionName: string,
    brandName: string | null,
    attributeName: string | null,
    unitCode: number,
    unitName: string,
    commonUnitCode: number,
    commonUnitName: string,
    internationalCode: number | null,
    units: NXIKItemUnitObj[],
    myProduct: number,
    packages?: string | null
}

export interface MXIKResponseObj {
    success: boolean,
    code: number,
    reason: 'ok' | 'error',
    data: {
        content: MXIKItemObj[],
        pageable: MXIKPageableObj
        last: boolean,
        totalPages: number,
        totalElements: number,
        sort: MXIKSortObj
        first: boolean,
        numberOfElements: number,
        size: number,
        number: number,
        empty: boolean
    },
    errors: string | null
}
