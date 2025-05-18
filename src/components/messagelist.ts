import { BaseElement } from '../classes/baseelement'
import { TextMessageElement } from './textmessage'
import type { Message as MessageInterface } from '../interfaces/message'
import { app } from '../index'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            flex-grow: 1;
            overflow: auto;
            padding-top: 4px;
            height: 100%;
            display: none;
        }
        :host([active="true"]) {
            display: block;
        }
    </style>
`

export class MessageListElement extends BaseElement {
    static observedAttributes = [
        'scrolling-paused'
    ]

    constructor () {
        super(templateElement)
    }

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {}

    loadContent (messages: Map<string, MessageInterface> | null): void {
        this.shadowRoot?.querySelectorAll('text-message').forEach(el => { el.remove() })
        if (messages === null) { return }
        messages.forEach(
            (message) => {
                const el = new TextMessageElement(message)
                this.addItem(el)
            }
        )
    }

    addItem (item: TextMessageElement): void {
        const prevMember = this.shadowRoot?.lastElementChild?.getAttribute('member')

        if (prevMember === item.getAttribute('member')) {
            const prevTimestamp = this.shadowRoot?.lastElementChild?.getAttribute('timestamp')
            const newTimestamp = item.getAttribute('timestamp')

            if (prevTimestamp != null && newTimestamp != null) {
                const prevDate = new Date(prevTimestamp)
                const newDate = new Date(newTimestamp)
                const difference = newDate.getTime() - prevDate.getTime()
                if (difference <= (3 * 60 * 1000)) {
                    item.collapse()
                }
            }
        }

        this.shadowRoot?.appendChild(item)

        if (
            item.getAttribute('member') === app.currentMember?.id ||
            this.getAttribute('scrolling-paused') !== 'true'
        ) {
            this.scrollTop = this.scrollHeight
        }
    }
}

window.customElements.define('message-list', MessageListElement)
