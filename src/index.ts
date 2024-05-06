import { Application } from './classes/application.js'
import './components/index.js'

export const app = new Application()
app.init('ws://127.0.0.1:8280')
