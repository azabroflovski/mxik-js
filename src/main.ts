import './style.css'
import { MXIKSearch, MXIKSearchByCode, MXIKDetails } from './lib'

// Usage example
const response = await MXIKSearch('футболка', { limit: 10 })
console.log(response)

const res = await MXIKSearchByCode('06109001001000000', { limit: 20 })
console.log(res)

const details = await MXIKDetails('06109001001000000')
console.log(details)


const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `<h1>mxik</h1>`
