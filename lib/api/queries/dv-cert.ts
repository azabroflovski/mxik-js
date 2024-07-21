import { $api } from '@lib/api'

/**
 * Fetches data by DV certificate number.
 *
 * @param {string | number} certNumber - The DV certificate number to search for.
 * @returns - A promise that resolves with the API response.
 */
export function fetchByDvCert(certNumber: string | number) {
  return $api<ResponseSchemaWithContent<DvCertItem>>('/mxik/search/dv-cert-number', {
    query: {
      dvCertNumber: certNumber,
      page: 0,
      size: 20,
      lang: 'ru',
    },
  })
}
