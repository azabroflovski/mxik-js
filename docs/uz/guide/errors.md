# Xatolar

| Nima boʻldi                                            | Nima olasiz                              |
| ------------------------------------------------------ | ---------------------------------------- |
| Kod mavjud emas, `get()`da                             | `null`                                   |
| Hech narsa topilmadi, `search()`, `filter()`, `dvCert()`da | Boʻsh sahifa                         |
| API xato yoki JSON boʻlmagan javob qaytardi            | `MxikError`                              |
| Soʻrov `timeout`dan uzoq davom etdi                    | `TimeoutError` nomli `DOMException`      |
| Soʻrov `signal` orqali bekor qilindi                   | `AbortError` nomli `DOMException`        |
| Tarmoq yoʻq, DNS xatosi, ulanish rad etildi            | `fetch`dan `TypeError`                   |

“Topilmadi” xato emas, shuning uchun `try` faqat qolgan holatlar uchun kerak.

## MxikError {#mxikerror}

```ts
import { MxikError } from 'mxik'

try {
  await mxik.search('кофе')
}
catch (error) {
  if (error instanceof MxikError) {
    error.status // HTTP status
    error.reason // API xabari, agar yuborgan boʻlsa
  }
}
```

API koʻpincha xato haqida HTTP 200 statusi va javob tanasida `success: false` bilan xabar beradi. Bunda `status` 200ga teng, haqiqiy xabar esa `reason`da boʻladi.

## Taymautlar va bekor qilish {#timeouts-and-cancelling}

Standart boʻyicha soʻrov 10 soniyadan keyin toʻxtatiladi. Buni mijoz uchun oʻzgartirish mumkin:

```ts
const mxik = createMxik({ timeout: 3000 })
```

Yoki alohida soʻrovni oʻzingiz bekor qiling, masalan foydalanuvchi keyingi harfni kiritganda:

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

Taymaut ham, sizning `signal`ʼingiz ham oddiy `fetch` kabi `DOMException` chiqaradi.
