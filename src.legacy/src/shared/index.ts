import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

/**
 * Create axios instance
 * @param options {AxiosRequestConfig}
 * @returns {AxiosInstance}
 */
export function createHttpClient(options: AxiosRequestConfig): AxiosInstance {
    return axios.create(options)
}
