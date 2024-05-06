import { BaseElement } from '../classes/baseelement.js'
import { app } from '../index.js'
import type { Message } from '../interfaces/message.js'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        .message {
            display: flex;
            gap: 5px;
            padding: 10px;
        }
        .message:hover {
            background: var(--lighterbg);
        }
        .member {
            font-weight: 500;
        }
        .body {
            font-weight: 400;
        }
        .avatar {
            max-width: 32px;
            border-radius: 100%;
        }
        .left-section {
            user-select: none;
        }
        .main-section {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
    </style>
    <div class="message" data-id="">
        <div class="left-section">
            <img src="resources/images/256.png" class="avatar">
        </div>
        <div class="main-section">
            <span class="member"></span>
            <span class="body"></span>
        </div>
    </div>
`

export class TextMessageElement extends BaseElement {
    static observedAttributes = []

    protected content: Message

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        super.attributeChangedCallback(name, oldValue, newValue)
        console.log(name, oldValue, newValue)
    }

    render (): void {
        const messageEl = this.shadowRoot?.querySelector('.message')
        const bodyEl = this.shadowRoot?.querySelector('.body')
        const memberEl = this.shadowRoot?.querySelector('.member')

        if (messageEl instanceof HTMLElement) {
            messageEl.dataset.id = this.content.id
        }

        if (bodyEl instanceof HTMLElement) {
            bodyEl.textContent = this.content.body?.text ?? ''
        }

        if (memberEl instanceof HTMLElement) {
            if (this.content.member !== undefined) {
                memberEl.textContent = app.members.get(this.content.member.id)?.display_name ?? ''
            }
            memberEl.dataset.id = this.content.member?.id ?? memberEl.dataset.id
        }
    }

    setContent (content: Message): void {
        this.content = content
        this.render()
    }

    constructor (content: Message) {
        super(templateElement)
        this.content = content
        this.render()
    }
}

window.customElements.define('text-message', TextMessageElement)
