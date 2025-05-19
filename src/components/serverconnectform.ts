import { app } from '..'
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
        #server-url-input {
            outline: none;
            padding: 9px;
            max-width: 400px;
            margin: 10px 0px;
            width: 100%;
            box-sizing: border-box;
            border-radius: 3px;
            border: none;
        }
        #join-official-server-button {
            margin: 10px 0 0 0;
        }
    </style>
    
        <div class="form-section official-server">
                <h2>Join official server</h2>
            <interface-button class='round bg-accent color-offwhite p-12' id='join-official-server-button'>
                <span slot="label">Connect to Official Server</span>
            </interface-button>
        </div>
        <div class="form-section custom-server">
            <h2>Join custom server</h2>
            <form id="server-connect-form">
                <input type="text" placeholder="ws://127.0.0.1:8280" id='server-url-input'>
                <interface-button class='round bg-accent color-offwhite p-12' id='server-url-submit'>
                    <span slot="label">Connect</span>
                </interface-button>
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
                console.log(input.value)
                app.connect(input.value)
            } else {
                console.log(input)
            }
        })

        this.shadowRoot?.getElementById('server-url-submit')?.addEventListener('click', (event) => {
            const form = this.shadowRoot?.getElementById('server-connect-form')
            if (form instanceof HTMLFormElement) {
                form.submit()
            }
        })

        this.shadowRoot?.getElementById('join-official-server-button')?.addEventListener('click', (event) => { app.connect('ws://127.0.0.1:8280') })
    }
}

window.customElements.define('server-connect-form', ServerConnectFormElement)
