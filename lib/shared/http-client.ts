export interface HttpClientOptions {
  baseURL: string
  headers?: Record<string, string>
  query?: Record<string, any>
}

export interface HttpClientRequestOptions {
  query?: Record<string, any>
}

export function createHttpClient(clientOptions: HttpClientOptions) {
  const { baseURL, headers } = clientOptions

  return function <Response>(path: string, requestOptions: HttpClientRequestOptions = {}) {
    const parsedQuery = new URLSearchParams(requestOptions.query).toString()
    const queryString = parsedQuery ? `?${parsedQuery}` : ''

    return fetch(`${baseURL}${path}${queryString}`, {
      headers,
      ...clientOptions,
    }).then((response) => {
      return response.json() as Promise<Response>
    })
  }
}
