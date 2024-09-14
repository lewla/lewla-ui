import { MessageAction } from '../actions/outgoing/message.js'
import { BaseElement } from '../classes/baseelement.js'
import { app } from '../index.js'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            flex-grow: 1;
        }
        [contenteditable=true]:empty:before {
            content: attr(placeholder);
            pointer-events: none;
            display: block;
            color: var(--lightergray);
        }
        #chat-input {
            outline: none;
            border: none;
            background: none;
            padding: 8px 6px;
            border-radius: 6px;
            color: var(--offwhite);
            font-size: 0.9em;
            line-height: 20px;
        }
    </style>
    <div id="chat-input" role="textbox" aria-multiline="true" spellcheck="true" aria-invalid="false" autocorrect="off" data-can-focus="true" placeholder="Enter a message" contenteditable="true" zindex="-1"></div>
`

export class ChatInputElement extends BaseElement {
    static observedAttributes = []

    constructor () {
        super(templateElement)

        this.shadowRoot?.getElementById('chat-input')?.addEventListener('input', (event) => {
            if (event.target instanceof HTMLElement) {
                if (event.target.innerHTML === '<br>') event.target.innerHTML = ''
            }
        })

        this.shadowRoot?.getElementById('chat-input')?.addEventListener('keydown', (event) => {
            if (event.target instanceof HTMLElement) {
                if ((event.key === 'Enter' || event.key === 'NumpadEnter') && !event.shiftKey) {
                    const channelId = document.querySelector('channel-list')?.shadowRoot?.querySelector('text-channel[selected="true"]')?.getAttribute('id')
                    if (channelId == null) {
                        event.preventDefault()
                        return
                    }

                    let content = event.target.innerHTML
                    content = content.trim()

                    if (content.length === 0) {
                        event.preventDefault()
                        return
                    }

                    const message = new MessageAction(
                        app.ws,
                        {
                            data: {
                                channel: channelId,
                                type: 'text',
                                body: {
                                    text: event.target.innerHTML
                                }
                            }
                        }
                    )
                    message.send()

                    event.target.innerHTML = ''
                    event.preventDefault()
                }
            }
        })

        this.shadowRoot?.getElementById('chat-input')?.addEventListener('paste', (event) => {
            event.preventDefault()
            document.execCommand('insertText', false, event.clipboardData?.getData('text/plain') ?? '')
        })
    }
}

window.customElements.define('chat-input', ChatInputElement)
