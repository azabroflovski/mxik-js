import { createHttpClient } from '@lib/shared/http-client'

export const $api = createHttpClient({
  baseURL: import.meta.env.VITE_API_URL as string,
})
