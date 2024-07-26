---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "mxik"
  text: "package for api calls tasnif.soliq.uz ️"
  tagline: Zero dependency and fully typed, try now
  actions:
    - theme: brand
      text: Getting Started
      link: ?#getting-started


features:
  - title: Zero dependency
    icon: 🪶
    details: Minimalist and Lightweight at 1kb
  - title: SSR Friendly
    icon: 💪
    details: Designed for Browser, Node, Bun, and Deno compatibility.
  - title: Fully Typed APIs
    icon: 🔑
    details: Flexible programmatic APIs with full TypeScript typing.
---

## Getting Started

### Installation

You can install the package using the following command:

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

### Importing the Package
After installing the package, you can import it into your project. Below is an example of how to import the package:

#### ES6
```ts 
import { MxikClient } from 'mxik'
```

### CommonJS
```ts
const MxikClient = require('mxik')
```

### Usage
Here are some examples of how to use the package:

```ts 
import { MxikClient } from 'mxik'

const mxik = new MxikClient()

// find by any keyword
await mxik.search('Футболка')

// or get mxik code detais
await mxik.code('06111001018000000')
```

Go to [API Reference](/api#client) to see more methods

## Contributing
If you would like to contribute to the project, please read the contributing guidelines.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

