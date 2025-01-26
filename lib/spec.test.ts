import { describe, expect, test } from 'bun:test'
import { MxikClient } from '@lib/index'

describe('Creating client instance', () => {
  test('new MxikClient()', () => {
    expect(new MxikClient()).toBeInstanceOf(MxikClient)
  })
})

describe('Check method', () => {
  const mxik = new MxikClient()
  const mxikCode = '00406001001232001'
  const brandName = 'samsung'
  const barcode = '0000'
  const searchQuery = 'Кофе'

  test(`mxik.code('${mxikCode}')`, async () => {
    const response = await mxik.code(mxikCode)

    expect(response).toHaveProperty('code')
    expect(response).toHaveProperty('success')
    expect(response).toHaveProperty('data')
    expect(response.data?.mxikCode).toBe(mxikCode)
  })

  test(`mxik.search('${searchQuery}')`, async () => {
    const response = await mxik.search(searchQuery)

    expect(response).toHaveProperty('code')
    expect(response).toHaveProperty('success')
    expect(response).toHaveProperty('data')
  })

  test(`mxik.brand('${brandName}')`, async () => {
    const response = await mxik.brand(brandName)

    expect(response).toHaveProperty('code')
    expect(response).toHaveProperty('success')
    expect(response).toHaveProperty('data')
    expect(response.data.content?.at(0)).toHaveProperty('brandName')
  })

  test(`mxik.barcode('${barcode}')`, async () => {
    const response = await mxik.barcode(barcode)

    expect(response).toHaveProperty('code')
    expect(response).toHaveProperty('success')
    expect(response).toHaveProperty('data')
  })

  test(`mxik.dvCert('${searchQuery}')`, async () => {
    const response = await mxik.dvCert(searchQuery)

    expect(response).toHaveProperty('code')
    expect(response).toHaveProperty('success')
    expect(response).toHaveProperty('data')
  })

  test(`mxik.params('{ brandName: ${brandName} }')`, async () => {
    const response = await mxik.params({
      brandName,
    })

    expect(response).toHaveProperty('code')
    expect(response).toHaveProperty('success')
    expect(response).toHaveProperty('data')
  })
})
