# Ошибки

| Что случилось                                         | Что вы получите                           |
| ----------------------------------------------------- | ----------------------------------------- |
| Кода не существует, в `get()`                         | `null`                                    |
| Ничего не нашлось, в `search()`, `filter()`, `dvCert()` | Пустая страница                         |
| API вернул ошибку или ответ не в JSON                 | `MxikError`                               |
| Запрос длился дольше `timeout`                        | `DOMException` с именем `TimeoutError`    |
| Запрос отменён через `signal`                         | `DOMException` с именем `AbortError`      |
| Нет сети, ошибка DNS, соединение отклонено            | `TypeError` из `fetch`                    |

«Не найдено» — не ошибка, так что `try` нужен только для остальных случаев.

## MxikError {#mxikerror}

```ts
import { MxikError } from 'mxik'

try {
  await mxik.search('кофе')
}
catch (error) {
  if (error instanceof MxikError) {
    error.status // HTTP-статус
    error.reason // сообщение от API, если оно есть
  }
}
```

API часто сообщает об ошибке со статусом HTTP 200 и `success: false` в теле ответа. Тогда `status` равен 200, а настоящее сообщение лежит в `reason`.

## Таймауты и отмена {#timeouts-and-cancelling}

По умолчанию запрос прерывается через 10 секунд. Это можно изменить для клиента:

```ts
const mxik = createMxik({ timeout: 3000 })
```

Или отменить отдельный запрос самому, например когда пользователь вводит следующую букву:

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

И таймаут, и ваш `signal` выбрасывают `DOMException`, как и обычный `fetch`.
