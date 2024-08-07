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

## Contributing
If you would like to contribute to the project, please read the contributing guidelines.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

