import { createHttpClient } from '../shared/http-client'

export const $api = createHttpClient({
  baseURL: 'https://tasnif.soliq.uz/api/cls-api',
})
