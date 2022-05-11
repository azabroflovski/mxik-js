import { createHttpClient } from '../shared'

export const http = createHttpClient({
    baseURL: process.ENV.API_URL // see .env
})
