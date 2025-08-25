import { app } from '../index'
import { BaseElement } from '../classes/baseelement'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        h2 {
            margin: 0;
            padding: 0;
            font-size: 1.2em;
        }
        .form-section {
            margin: 15px;
            max-width: 400px;
            background: var(--darker);
            padding: 20px;
            border-radius: 10px;
        }
        input {
            outline: none;
            padding: 9px 12px;
            max-width: 400px;
            margin: 5px 0px;
            width: 100%;
            box-sizing: border-box;
            border-radius: 3px;
            border: none;
            background: var(--lightbg);
            color: var(--white);
            font-size: 16px;
        }
        .form-button {
            margin: 6px 0 0 0;
            border-radius: 5px;
            background: var(--accent);
            color: var(--white);
            cursor: pointer;
            outline: none;
            box-shadow: none;
            max-width: 150px;
            width: 100%;
            font-weight: 600;
        }
    </style>    
    <div class="form-section official-server">
        <h2>Join official server</h2>
        <input type="submit" class="form-button" id="join-official-server-button" value="Connect">
    </div>
    <div class="form-section custom-server">
        <h2>Join custom server</h2>
        <form id="server-connect-form">
            <input type="text" placeholder="WebSocket URL" id='server-url-input'>
            <input type="submit" class="form-button" id="server-url-submit" value="Connect">
        </form>
    </div>
`

export class ServerConnectFormElement extends BaseElement {
    static observedAttributes = [
    ]

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        super.attributeChangedCallback(name, oldValue, newValue)
    }

    constructor () {
        super(templateElement)

        this.shadowRoot?.getElementById('server-connect-form')?.addEventListener('submit', (event) => {
            event.preventDefault()
            const input = this.shadowRoot?.getElementById('server-url-input')
            if (input instanceof HTMLInputElement) {
                app.connect(input.value)
            }
        })

        this.shadowRoot?.getElementById('server-url-submit')?.addEventListener('click', (event) => {
            const input = this.shadowRoot?.getElementById('server-url-input')
            if (input instanceof HTMLInputElement) {
                app.connect(input.value)
            }
        })

        this.shadowRoot?.getElementById('join-official-server-button')?.addEventListener('click', (event) => { app.connect(process.env.WEBSOCKET_SERVER_URL ?? 'ws://127.0.0.1:8280') })
    }
}

window.customElements.define('server-connect-form', ServerConnectFormElement)
