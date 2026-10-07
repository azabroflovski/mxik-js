# Errors

| What happened                                      | What you get                              |
| -------------------------------------------------- | ----------------------------------------- |
| Code doesn't exist, in `get()`                     | `null`                                    |
| Nothing matched, in `search()`, `filter()`, `dvCert()` | Empty page                            |
| API returned an error or something that isn't JSON | `MxikError`                               |
| Request took longer than `timeout`                 | `DOMException` named `TimeoutError`       |
| Request cancelled with `signal`                    | `DOMException` named `AbortError`         |
| No network, DNS failure, connection refused        | `TypeError` from `fetch`                  |

"Not found" isn't an error, so you only need `try` for the rest.

## MxikError

```ts
import { MxikError } from 'mxik'

try {
  await mxik.search('кофе')
}
catch (error) {
  if (error instanceof MxikError) {
    error.status // HTTP status
    error.reason // message from the API, if it sent one
  }
}
```

The API often reports errors with HTTP status 200 and `success: false` in the body. `status` is then 200 and `reason` carries the actual message.

## Timeouts and cancelling

Requests time out after 10 seconds by default. Change it for the client:

```ts
const mxik = createMxik({ timeout: 3000 })
```

Or cancel a single request yourself, for example when the user types the next letter:

```ts
let controller: AbortController | undefined

async function onInput(query: string) {
  controller?.abort()
  controller = new AbortController()

  try {
    const { items } = await mxik.search(query, { signal: controller.signal })
    render(items)
  }
  catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError')
      return
    throw error
  }
}
```

Both timeouts and your own `signal` throw `DOMException`, the same as plain `fetch`.
