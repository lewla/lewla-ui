import { app } from '../index'
import { LoginAction } from '../actions/outgoing/login'
import { RegisterAction } from '../actions/outgoing/register'
import { BaseElement } from '../classes/baseelement'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        h2 {
            margin: 0 0 6px 0;
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
        .status-message {
            padding: 2px 0px 5px 0px;
            font-weight: 600;
            font-size: 14px;
        }
        .status-message.error {
            color: var(--warn);
        }
    </style>
    <div class="form-section login">
        <h2>Login</h2>
        <form id="login-form">
            <div id="login-status-message" class="status-message"></div>
            <input type="text" placeholder="Username" id='login-username-input' name="username">
            <input type="password" placeholder="Password" id='login-password-input' name="current-password" autocomplete="current-password">
            <input type="submit" value="Login" class="form-button">
        </form>
    </div>
    <div class="form-section register">
        <h2>Create an account</h2>
        <form id="register-form">
            <div id="register-status-message" class="status-message"></div>
            <input type="text" placeholder="Username" id='register-username-input' name="username">
            <input type="password" placeholder="Password" id='register-password-input' name="new-password" autocomplete="new-password">
            <input type="submit" value="Register" class="form-button">
        </form>
    </div>
`

export class AuthenticateFormElement extends BaseElement {
    static observedAttributes = [
    ]

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        super.attributeChangedCallback(name, oldValue, newValue)
    }

    constructor () {
        super(templateElement)

        this.shadowRoot?.getElementById('register-form')?.addEventListener('submit', (event) => {
            event.preventDefault()
            this.register()
        })

        this.shadowRoot?.getElementById('register-submit')?.addEventListener('click', (event) => {
            this.register()
        })

        this.shadowRoot?.getElementById('login-form')?.addEventListener('submit', (event) => {
            event.preventDefault()
            this.login()
        })

        this.shadowRoot?.getElementById('login-submit')?.addEventListener('click', (event) => {
            this.login()
        })
    }

    register (): void {
        const usernameEl = this.shadowRoot?.getElementById('register-username-input')
        const passwordEl = this.shadowRoot?.getElementById('register-password-input')
        const statusMsgEl = this.shadowRoot?.getElementById('register-status-message')
        if (usernameEl instanceof HTMLInputElement && passwordEl instanceof HTMLInputElement) {
            if (statusMsgEl instanceof HTMLElement) {
                statusMsgEl.innerText = ''
                statusMsgEl.classList.remove('error')
            }
            const registerMsg = new RegisterAction(app.ws, { data: { username: usernameEl.value, password: passwordEl.value } })
            registerMsg.sendAsync()
                .then((response) => {
                    console.error('response', response)
                })
                .catch((reason) => {
                    if (statusMsgEl instanceof HTMLElement) {
                        statusMsgEl.innerText = reason.message ?? 'Unknown error occurred'
                        statusMsgEl.classList.add('error')
                    }
                })
        }
    }

    login (): void {
        const usernameEl = this.shadowRoot?.getElementById('login-username-input')
        const passwordEl = this.shadowRoot?.getElementById('login-password-input')
        const statusMsgEl = this.shadowRoot?.getElementById('login-status-message')
        if (usernameEl instanceof HTMLInputElement && passwordEl instanceof HTMLInputElement) {
            if (statusMsgEl instanceof HTMLElement) {
                statusMsgEl.innerText = ''
                statusMsgEl.classList.remove('error')
            }
            const loginMsg = new LoginAction(app.ws, { data: { username: usernameEl.value, password: passwordEl.value } })
            loginMsg.sendAsync()
                .then((response) => {
                    console.error('response', response)
                })
                .catch((reason) => {
                    if (statusMsgEl instanceof HTMLElement) {
                        statusMsgEl.innerText = reason.message ?? 'Unknown error occurred'
                        statusMsgEl.classList.add('error')
                    }
                })
        }
    }
}

window.customElements.define('authenticate-form', AuthenticateFormElement)
