import { Application } from './classes/application.js'
import './components/index.js'

export const app = new Application()
app.init('')
app.loadUI()
