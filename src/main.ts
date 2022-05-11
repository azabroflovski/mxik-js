import './style.css'
import { MXIKSearch } from './lib'

// Usage example
const response = await MXIKSearch('футболка', { limit: 10 })
console.log(response)


const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `<h1>mxik</h1>`
