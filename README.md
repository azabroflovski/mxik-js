# mxik-js

Simple package for API calls [tasnif.soliq.uz](https://tasnif.soliq.uz/)  (written in TypeScript ⚡) ️

## Install
Via package manager
```sh
# NPM
$ npm install mxik

# yarn
$ yarn add mxik
```

## Usage

```js
import { MXIKSearch } from 'mxik'

// works if u have top-level await
const response = await MXIKSearch('search query', { limit: 10 })

// or 
async function doSomething() {
    const response = await MXIKSearch('search query', { limit: 10 })
}
```

### via cdn
Copy the following URL and paste it into your HTML code via script tag
```
https://unpkg.com/mxik@0.0.1/mxik.umd.js
```

Example
```html
<body>
    <head>
        <titl>Your site</titl>
        ...
    </head>

    <script src="https://unpkg.com/mxik@0.0.1/mxik.umd.js"></script>
    <script>
        async function doSomething() {
            const response = await MXIKSearch('search query', { limit: 10 })
        }
        
        async function doAnother() {
            const response = await MXIKSearchByCode('06109001001000000', { limit: 10 })
        }
    </script>
</body>
```

## Examples

### Search items

```js
async function doSomething() {
    const response = await MXIKSearch('search query', { limit: 10 })
}
```


### Get items by mxik code

```js
async function doSomething() {
    const response = await MXIKSearchByCode('06109001001000000', { limit: 10 })
}
```

## API

#### `MXIKSearch(keyword: string, options: object)`
| Param                  | Default value | Description          |
|:-----------------------|:--------------|:---------------------|
| keyword `string`       | -             | Find items by name   |
| options `object`       | { ... }       | Search options       |
| options.limit `object` | 20            | Items count per page |

----

#### `MXIKSearchByCode(keyword: string, options: object)`
| Param                  | Default value | Description          |
|:-----------------------|:--------------|:---------------------|
| keyword `string`       | -             | Pass a mxik code     |
| options `object`       | { ... }       | Search options       |
| options.limit `object` | 20            | Items count per page |


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, azabroflovski
