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
    id: number
    name: string
    nameUz: string
    nameRu: string
    nameEng?: string
    nameLatin?: string
    unit: string
    commonUnitsId: number
    difference?: string
    description?: string
}

export interface MXIKItemObj {
    mxikCode: string
    groupName: string
    className: string
    positionName: string
    subPositionName: string
    brandName: string | null
    attributeName: string | null
    unitCode: number
    unitName: string
    commonUnitCode: number
    commonUnitName: string
    internationalCode: number | null
    units: NXIKItemUnitObj[]
    myProduct: number
    packages?: string | null
}

export interface MXIKSearchSymbolResponseObj {
    success: boolean
    code: number
    reason: 'ok' | 'error'
    data: {
        content: MXIKItemObj[]
        pageable: MXIKPageableObj
        last: boolean
        totalPages: number
        totalElements: number
        sort: MXIKSortObj
        first: boolean
        numberOfElements: number
        size: number
        number: number
        empty: boolean
    }
    errors: string | null
}

export interface MXIKSearchParamsObj {
    keyword: string | number
    limit?: number
}

export interface MXIKSearchOptionsObj {
    limit?: number
}

export interface MXIKSearchResponseObj {
    items: MXIKItemObj[]
    pagination: {
        totalPages: number
        totalItems: number
        perPage: number
        isFirstPage: boolean
        isLastPage: boolean
    }
}

export type MXIKCode = string | number

export interface MXIKPackageItem {
    code: number
    parentCode: number
    mxikCode: string
    containerCode: number
    containerName: string
    containerNamePl: string | null
    containerNamePl2: string | null
    unitId: number
    unitName: string
    parentValue: number
    name: string
    type: string
    childNames: string
    childValues: string
    isUnitPackage: string
    createdAt: string
    createdBy: string
    children: string[]
    childrenValue: string[]
}

export interface MXIKDetail {
    mxikCode: string
    groupName: string
    groupCode: string
    className: string
    classCode: string
    positionName: string
    positionCode: string
    subPositionName: string
    subPositionCode: string
    brandName: string | null
    brandCode: string
    mxikName: string
    attributeName: string | null
    unitCode: string | null
    unitName: string | null
    commonUnitCode: string | null
    commonUnitName: string | null
    internationalCode: string | null
    label: number
    units: string | number
    myProduct: number
    packages: MXIKPackageItem[]
}