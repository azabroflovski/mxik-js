# CLI

The `mxik` package includes a command-line tool. Run it without installing:

```sh
npx mxik search кофе
```

Or install globally to get the `mxik` command:

```sh
npm i -g mxik
```

## Commands

| Command                 | What it does                                          |
| ----------------------- | ----------------------------------------------------- |
| `search <query>`        | Full-text search by name, brand or code               |
| `filter`                | Search by fields: `--brand`, `--barcode`, `--text`, `--code` |
| `subpositions <query>`  | Search by product type, codes without a brand         |
| `card <code>`           | Card of a code: barcode, tax benefit, packages        |
| `get <code>`            | Code with names in Russian and Uzbek                  |
| `children [code]`       | Next level of the catalog tree, groups without a code |
| `stats`                 | Number of groups, classes, …, codes in the catalog    |
| `units`                 | Units of measurement                                  |
| `tax-benefits`          | Tax benefits                                          |

## Options

| Option            | Description                          |
| ----------------- | ------------------------------------ |
| `--lang <ru\|uz>` | Language of names, `ru` by default   |
| `--page <n>`      | Page number, starting from 1         |
| `--size <n>`      | Page size, 20 by default             |
| `--json`          | Print raw JSON                       |
| `--help`, `-h`    | Show help                            |
| `--version`, `-v` | Show the version                     |

## Examples

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

Results go to stdout and the page footer to stderr, so piping keeps only the results:

```sh
mxik search кофе --size 100 | cut -d ' ' -f 1
mxik card 00901001001048023 --json | jq .internationalCode
```

## Exit codes

| Code | Meaning                                       |
| ---- | --------------------------------------------- |
| `0`  | Success                                       |
| `1`  | Nothing found, unknown code or API error      |
| `2`  | Wrong usage: unknown command or option        |
