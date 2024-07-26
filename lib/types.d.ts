interface Client {
  search: (name: string) => Promise<ResponseSchema<SearchResultItem[]>>
  brand: (name: string) => Promise<ResponseSchemaWithContent<ByParamsResultItem[]>>
  code: (code: string | number) => Promise<ResponseSchema<MxikDetails>>
  barcode: (code: string) => Promise<ResponseSchemaWithContent<ByParamsResultItem[]>>
  dvCert: (certNumber: string | number) => Promise<ResponseSchemaWithContent<DvCertItem>>
  params: (attributes: Partial<Record<keyof ByParamsResultItem, any>>) => Promise<ResponseSchemaWithContent<ByParamsResultItem[]>>
}
