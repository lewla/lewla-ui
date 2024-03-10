import { BaseElement } from '../classes/baseelement.js'
import { TextMessageElement } from './textmessage.js'
import type { Message } from '../objects/message.js'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            flex-grow: 1;
            height: 0;
            overflow: auto;
            padding-top: 4px;
        }
    </style>
`

export class MessageListElement extends BaseElement {
    static observedAttributes = []

    constructor () {
        super(templateElement)
    }

    loadContent (messages: Map<string, Message> | null): void {
        this.shadowRoot?.querySelectorAll('text-message').forEach(el => { el.remove() })
        if (messages === null) { return }
        messages.forEach(
            (message) => {
                const el = new TextMessageElement(message)
                message.element = el
                this.shadowRoot?.appendChild(el)
            }
        )
    }
}

window.customElements.define('message-list', MessageListElement)
