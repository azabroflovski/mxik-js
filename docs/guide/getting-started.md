# Getting Started

## Installation

You can install the package via:

::: code-group

```sh [npm]
npm i mxik
```

```sh [pnpm]
pnpm i mxik
```

```sh [bun]
bun add mxik
```
:::

## Importing the Package
After installing the package, you can import it into your project. Below is an example of how to import the package:

#### ES6
```ts 
import { MxikClient } from 'mxik'
```

#### CommonJS
```ts
const MxikClient = require('mxik')
```

## Usage
Here are some examples of how to use the package:

```ts 
import { MxikClient } from 'mxik'

const mxik = new MxikClient()

// find by any keyword
await mxik.search('Futbolka')
```

## Methods

```ts
const mxik = new MxikClient()

// by mxik code
await mxik.code('00406001001232001')

// by barcode
await mxik.barcode('00000')

// search by keyword
await mxik.search('Futbolka')

// search by brand
await mxik.brand('Samsung')

// find by dv cert
await mxik.dvCert('cert here')

// get with custom params
await mxik.params({
  brandName: 'Samsung',
  otherParam: 'Bla bla'
})
```

Go to [API Reference](/api#client) to see more methods

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
