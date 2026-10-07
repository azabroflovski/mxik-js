# CLI

`mxik` paketiga buyruq satri utilitasi kiradi. Oʻrnatmasdan ishga tushirish:

```sh
npx mxik search кофе
```

Yoki `mxik` buyrugʻi paydo boʻlishi uchun global oʻrnating:

```sh
npm i -g mxik
```

## Buyruqlar {#commands}

| Buyruq                  | Nima qiladi                                           |
| ----------------------- | ----------------------------------------------------- |
| `search <query>`        | Nom, brend yoki kod boʻyicha toʻliq matnli qidiruv    |
| `filter`                | Maydonlar boʻyicha qidiruv: `--brand`, `--barcode`, `--text`, `--code` |
| `subpositions <query>`  | Mahsulot turi boʻyicha qidiruv, brendsiz kodlar       |
| `card <code>`           | Kod kartochkasi: shtrix-kod, imtiyoz, qadoqlar        |
| `get <code>`            | Rus va oʻzbek tillaridagi nomlar bilan kod            |
| `children [code]`       | Katalogning keyingi darajasi, kodsiz — guruhlar       |
| `stats`                 | Katalogdagi guruhlar, sinflar, …, kodlar soni         |
| `units`                 | Oʻlchov birliklari                                    |
| `tax-benefits`          | Soliq imtiyozlari                                     |

## Opsiyalar {#options}

| Opsiya            | Tavsif                               |
| ----------------- | ------------------------------------ |
| `--lang <ru\|uz>` | Nomlar tili, standart `ru`           |
| `--page <n>`      | Sahifa raqami, birdan boshlanadi     |
| `--size <n>`      | Sahifa hajmi, standart 20            |
| `--json`          | JSONni oʻzicha chiqarish             |
| `--help`, `-h`    | Yordamni koʻrsatish                  |
| `--version`, `-v` | Versiyani koʻrsatish                 |

## Misollar {#examples}

```sh
$ mxik search Maccoffee --size 2
00901001001048023  Молотый (порошкообразный) кофе: Maccoffee, в пакет 3в1 20г
00901001001048019  Молотый (порошкообразный) кофе: Maccoffee, pho 3in1 24г

Page 1 of 14, 28 total
```

```sh
$ mxik filter --barcode 6934177746536
08504003009011001  Зарядные устройства и блоки питания (всех видов и для всех устройств): XIAOMI, Mi Robot Vacuum-mop auto-empty station

Page 1 of 1, 1 total
```

```sh
$ mxik children 00901001
00901001001  Молотый (порошкообразный) кофе  305
00901001002  Зерновой (немолотый) кофе  90
00901001004  Сублимированный кофе  30

Page 1 of 1, 3 total
```

Natijalar stdoutʼga, sahifa haqidagi satr esa stderrʼga chiqadi, shuning uchun yoʻnaltirishda faqat natijalar qoladi:

```sh
mxik search кофе --size 100 | cut -d ' ' -f 1
mxik card 00901001001048023 --json | jq .internationalCode
```

## Chiqish kodlari {#exit-codes}

| Kod  | Maʼnosi                                       |
| ---- | --------------------------------------------- |
| `0`  | Muvaffaqiyat                                  |
| `1`  | Hech narsa topilmadi, kod yoʻq yoki API xatosi |
| `2`  | Notoʻgʻri chaqiruv: nomaʼlum buyruq yoki opsiya |
