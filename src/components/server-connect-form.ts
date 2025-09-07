import { type TemplateResult, type CSSResultGroup, LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { app } from '../index'

@customElement('server-connect-form')
export class ServerConnectForm extends LitElement {
    static styles: CSSResultGroup = css`
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
    `

    @property({ type: String })
        url: string = process.env.WEBSOCKET_SERVER_URL ?? 'ws://127.0.0.1:8280'

    private readonly _handleURLInput = (event: Event): void => {
        this.url = (event.target as HTMLInputElement).value
    }

    private readonly _handleCustomSubmit = (event: Event): void => {
        event.preventDefault()
        app.connect(this.url)
    }

    private readonly _handleConnectOfficialClicked = (event: Event): void => {
        app.connect(process.env.WEBSOCKET_SERVER_URL ?? 'ws://127.0.0.1:8280')
    }

    render (): TemplateResult<1> {
        return html`
            <div class="form-section official-server">
                <h2>Join official server</h2>
                <input type="submit" class="form-button" id="join-official-server-button" value="Connect" @click=${this._handleConnectOfficialClicked}>
            </div>
            <div class="form-section custom-server">
                <h2>Join custom server</h2>
                <form id="server-connect-form" @submit=${this._handleCustomSubmit}>
                    <input type="text" placeholder="WebSocket URL" id='server-url-input' .value=${this.url} @input=${this._handleURLInput}>
                    <input type="submit" class="form-button" id="server-url-submit" value="Connect">
                </form>
            </div>
        `
    }
}
