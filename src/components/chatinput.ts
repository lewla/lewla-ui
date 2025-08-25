import { MessageAction } from '../actions/outgoing/message'
import { BaseElement } from '../classes/baseelement'
import { unescapeHtmlChars } from '../helpers/text'
import { app } from '../index'

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
            max-width: 60vw;
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
                    content.replace(/&nbsp;/g, '').replace(/\u00A0/g, '')

                    if (content.length === 0) {
                        event.preventDefault()
                        return
                    }

                    if (app.ws === undefined) {
                        event.preventDefault()
                        return
                    }

                    content = unescapeHtmlChars(content)

                    const message = new MessageAction(
                        app.ws,
                        {
                            data: {
                                channel: channelId,
                                type: 'text',
                                body: {
                                    text: content
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
            const clipboard = event.clipboardData?.getData('text/plain')
            if (typeof clipboard === 'string') {
                document.execCommand('insertText', false, clipboard)
            }
        })
    }
}

window.customElements.define('chat-input', ChatInputElement)
