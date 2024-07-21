/**
 * Represents a general API response schema.
 *
 * @template Data - The type of the data returned in the response.
 */
interface ResponseSchema<Data> {
  /**
   * Indicates whether the request was successful.
   * @type {boolean}
   */
  success: boolean

  /**
   * The HTTP status code of the response.
   * @type {number}
   */
  code: number

  /**
   * A reason or message describing the response status.
   * @type {string}
   */
  reason: string

  /**
   * The data returned in the response.
   * @type {Data | null}
   */
  data: Data | null

  /**
   * The total number of records.
   * @type {number}
   */
  recordTotal: number

  /**
   * Any errors that occurred during the request.
   * @type {any}
   */
  errors: any
}

/**
 * Represents a detailed API response schema with pagination and sorting information.
 *
 * @template Data - The type of the data returned in the response.
 */
interface ResponseSchemaWithContent<Data> {
  /**
   * Indicates whether the request was successful.
   * @type {boolean}
   */
  success: boolean

  /**
   * The HTTP status code of the response.
   * @type {number}
   */
  code: number

  /**
   * A reason or message describing the response status.
   * @type {string}
   */
  reason: string

  /**
   * The data returned in the response, including pagination and sorting metadata.
   * @type {{
   *   content: Data | null,
   *   empty: boolean,
   *   first: boolean,
   *   last: boolean,
   *   number: number,
   *   numberOfElements: number,
   *   size: number,
   *   totalElements: number,
   *   totalPages: number,
   *   pageable: {
   *     offset: number,
   *     pageNumber: number,
   *     pageSize: number,
   *     paged: boolean,
   *     unpaged: boolean,
   *     sort: ResponseSort
   *   },
   *   sort: ResponseSort
   * }}
   */
  data: {
    content: Data | null
    empty: boolean
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    size: number
    totalElements: number
    totalPages: number
    pageable: {
      offset: number
      pageNumber: number
      pageSize: number
      paged: boolean
      unpaged: boolean
      sort: ResponseSort
    }
    sort: ResponseSort
  }

  /**
   * Any errors that occurred during the request.
   * @type {any}
   */
  errors: any
}

/**
 * Represents sorting information in a paginated response.
 */
interface ResponseSort {
  /**
   * Indicates whether sorting is empty.
   * @type {boolean}
   */
  empty: boolean

  /**
   * Indicates whether the sorting is sorted.
   * @type {boolean}
   */
  sorted: boolean

  /**
   * Indicates whether the sorting is unsorted.
   * @type {boolean}
   */
  unsorted: boolean
}

/**
 * Represents an item returned from a search query.
 */
interface SearchResultItem {
  /**
   * The MXIK code of the item.
   * @type {string}
   */
  mxikCode: string

  /**
   * The name of the item.
   * @type {string}
   */
  name: string

  /**
   * A description of the item.
   * @type {string}
   */
  description: string

  /**
   * The international code of the item.
   * @type {string | null}
   */
  internationalCode: string | null

  /**
   * The label of the item.
   * @type {string}
   */
  label: string

  /**
   * The full name of the item.
   * @type {string}
   */
  fullName: string

  /**
   * The group code of the item.
   * @type {string}
   */
  groupCode: string

  /**
   * The group name of the item.
   * @type {string}
   */
  groupName: string

  /**
   * The class code of the item.
   * @type {string}
   */
  classCode: string

  /**
   * The class name of the item.
   * @type {string}
   */
  className: string

  /**
   * The position code of the item.
   * @type {string}
   */
  positionCode: string

  /**
   * The position name of the item.
   * @type {string}
   */
  positionName: string

  /**
   * The sub-position code of the item.
   * @type {string}
   */
  subPositionCode: string

  /**
   * The sub-position name of the item.
   * @type {string}
   */
  subPositionName: string

  /**
   * The brand code of the item.
   * @type {string}
   */
  brandCode: string

  /**
   * The brand name of the item.
   * @type {string | null}
   */
  brandName: string | null

  /**
   * The attribute name of the item.
   * @type {string | null}
   */
  attributeName: string | null

  /**
   * The package usage information.
   * @type {string}
   */
  usePackage: string

  /**
   * The category unit ID.
   * @type {string | null}
   */
  categoryUnitId: string | null

  /**
   * The category unit name.
   * @type {string | null}
   */
  categoryUnitName: string | null

  /**
   * The units name.
   * @type {string}
   */
  unitsName: string

  /**
   * The survey category ID.
   * @type {string}
   */
  surveyCategoryId: string

  /**
   * Indicates whether the item is non-changeable.
   * @type {string}
   */
  nonChangeable: string

  /**
   * The LGOTA ID.
   * @type {string}
   */
  lgotaId: string

  /**
   * The LGOTA name.
   * @type {string}
   */
  lgotaName: string

  /**
   * The recommended category unit name.
   * @type {string | null}
   */
  recommendedCategoryUnitName: string | null

  /**
   * The recommended units name.
   * @type {string | null}
   */
  recommendedUnitsName: string | null

  /**
   * The package name.
   * @type {string | null}
   */
  packageName: string | null

  /**
   * The use card information.
   * @type {string}
   */
  useCard: string

  /**
   * The property of the item.
   * @type {string | null}
   */
  property: string | null

  /**
   * The category code of the item.
   * @type {string}
   */
  categoryCode: string

  /**
   * The category name of the item.
   * @type {string}
   */
  categoryName: string

  /**
   * The MNN name.
   * @type {string | null}
   */
  mnnName: string | null
}

/**
 * Represents an item related to a DV certificate.
 */
interface DvCertItem {
  /**
   * The MXIK code of the item.
   * @type {string}
   */
  mxikCode: string

  /**
   * The group name of the item.
   * @type {string}
   */
  groupName: string

  /**
   * The group code of the item.
   * @type {string}
   */
  groupCode: string

  /**
   * The class name of the item.
   * @type {string}
   */
  className: string

  /**
   * The class code of the item.
   * @type {string}
   */
  classCode: string

  /**
   * The position name of the item.
   * @type {string}
   */
  positionName: string

  /**
   * The position code of the item.
   * @type {string}
   */
  positionCode: string

  /**
   * The sub-position name of the item.
   * @type {string}
   */
  subPositionName: string

  /**
   * The sub-position code of the item.
   * @type {string}
   */
  subPositionCode: string

  /**
   * The brand name of the item.
   * @type {string}
   */
  brandName: string

  /**
   * The brand code of the item.
   * @type {string}
   */
  brandCode: string

  /**
   * The attribute name of the item.
   * @type {string}
   */
  attributeName: string

  /**
   * The MXIK name of the item.
   * @type {string}
   */
  mxikName: string

  /**
   * The international code of the item.
   * @type {string | null}
   */
  internationalCode: string | null

  /**
   * The label of the item.
   * @type {number}
   */
  label: number
}

/**
 * Represents an item returned when searching by various parameters.
 */
interface ByParamsResultItem {
  /**
   * Text description or value.
   * @type {string | null}
   */
  text: string | null

  /**
   * The language of the item.
   * @type {string}
   */
  lang: string

  /**
   * The page number of the result.
   * @type {number}
   */
  page: number

  /**
   * The size of the result set.
   * @type {number}
   */
  size: number

  /**
   * The MXIK code of the item.
   * @type {string}
   */
  mxikCode: string

  /**
   * The group name of the item.
   * @type {string}
   */
  groupName: string

  /**
   * The group code of the item.
   * @type {string}
   */
  groupCode: string

  /**
   * The class name of the item.
   * @type {string}
   */
  className: string

  /**
   * The class code of the item.
   * @type {string}
   */
  classCode: string

  /**
   * The position name of the item.
   * @type {string}
   */
  positionName: string

  /**
   * The position code of the item.
   * @type {string}
   */
  positionCode: string

  /**
   * The sub-position name of the item.
   * @type {string}
   */
  subPositionName: string

  /**
   * The sub-position code of the item.
   * @type {string}
   */
  subPositionCode: string

  /**
   * The brand name of the item.
   * @type {string}
   */
  brandName: string

  /**
   * The brand code of the item.
   * @type {string}
   */
  brandCode: string

  /**
   * The MXIK name of the item.
   * @type {string}
   */
  mxikName: string

  /**
   * The attribute name of the item.
   * @type {string}
   */
  attributeName: string

  /**
   * The unit code of the item.
   * @type {string | null}
   */
  unitCode: string | null

  /**
   * The unit name of the item.
   * @type {string | null}
   */
  unitName: string | null

  /**
   * The common unit code.
   * @type {string | null}
   */
  commonUnitCode: string | null

  /**
   * The common unit name.
   * @type {string | null}
   */
  commonUnitName: string | null

  /**
   * The international code of the item.
   * @type {string}
   */
  internationalCode: string

  /**
   * The label of the item.
   * @type {number}
   */
  label: number

  /**
   * The units of the item.
   * @type {string | null}
   */
  units: string | null

  /**
   * Indicates whether the item is a personal product.
   * @type {number}
   */
  myProduct: number

  /**
   * The packages associated with the item.
   * @type {string | null}
   */
  packages: string | null

  /**
   * Indicates whether the item is available for download.
   * @type {boolean}
   */
  download: boolean

  /**
   * Additional dynamic properties.
   * @type {Record<string, any>}
   */
  [key: string]: any
}

/**
 * Represents the information about a package.
 */
interface PackageName {
  /**
   * The code of the package.
   * @type {number}
   */
  code: number

  /**
   * The MXIK code associated with the package.
   * @type {string}
   */
  mxikCode: string

  /**
   * The name of the package in Uzbek.
   * @type {string}
   */
  nameUz: string

  /**
   * The type of the package.
   * @type {string}
   */
  packageType: string

  /**
   * The name of the package in Russian.
   * @type {string}
   */
  nameRu: string

  /**
   * The name of the package in Latin.
   * @type {string}
   */
  nameLat: string
}

/**
 * Represents detailed information about an MXIK item.
 */
interface MxikDetails {
  /**
   * The unique identifier of the MXIK item.
   * @type {string}
   */
  id: string

  /**
   * The primary key of the MXIK item.
   * @type {string | null}
   */
  pkey: string | null

  /**
   * The parent primary key of the MXIK item.
   * @type {string | null}
   */
  parentPkey: string | null

  /**
   * The MXIK code of the item.
   * @type {string}
   */
  mxikCode: string

  /**
   * The group name of the item in Uzbek.
   * @type {string}
   */
  groupNameUz: string

  /**
   * The group name of the item in Russian.
   * @type {string}
   */
  groupNameRu: string

  /**
   * The group name of the item in Latin.
   * @type {string | null}
   */
  groupNameLat: string | null

  /**
   * The class name of the item in Uzbek.
   * @type {string}
   */
  classNameUz: string

  /**
   * The class name of the item in Russian.
   * @type {string}
   */
  classNameRu: string

  /**
   * The class name of the item in Latin.
   * @type {string | null}
   */
  classNameLat: string | null

  /**
   * The position name of the item in Uzbek.
   * @type {string}
   */
  positionNameUz: string

  /**
   * The position name of the item in Russian.
   * @type {string}
   */
  positionNameRu: string

  /**
   * The position name of the item in Latin.
   * @type {string | null}
   */
  positionNameLat: string | null

  /**
   * The sub-position name of the item in Uzbek.
   * @type {string}
   */
  subPositionNameUz: string

  /**
   * The sub-position name of the item in Russian.
   * @type {string}
   */
  subPositionNameRu: string

  /**
   * The sub-position name of the item in Latin.
   * @type {string | null}
   */
  subPositionNameLat: string | null

  /**
   * The brand name of the item.
   * @type {string}
   */
  brandName: string

  /**
   * The attribute name of the item in Uzbek.
   * @type {string}
   */
  attributeNameUz: string

  /**
   * The attribute name of the item in Russian.
   * @type {string}
   */
  attributeNameRu: string

  /**
   * The attribute name of the item in Latin.
   * @type {string | null}
   */
  attributeNameLat: string | null

  /**
   * A description of the item.
   * @type {string | null}
   */
  description: string | null

  /**
   * Indicates whether the item is active.
   * @type {string}
   */
  isActive: string

  /**
   * The creation timestamp of the item.
   * @type {string}
   */
  createdAt: string

  /**
   * The user who last updated the item.
   * @type {string | null}
   */
  updatedBy: string | null

  /**
   * The last update timestamp of the item.
   * @type {string}
   */
  updatedAt: string

  /**
   * The status of the item.
   * @type {number}
   */
  status: number

  /**
   * The list of package names associated with the item.
   * @type {PackageName[]}
   */
  packageNames: PackageName[]
}
