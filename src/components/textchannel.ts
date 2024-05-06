import { BaseElement } from '../classes/baseelement.js'
import { MessageListElement } from './messagelist.js'
import type { Channel } from '../interfaces/channel.js'
import { app } from '../index.js'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        .channel {
            color: var(--lightgray);
            display: block;
            padding: 8px 6px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            column-gap: 5px;
            justify-content: flex-start;
            margin: 0px 4px 4px 4px;
            cursor: pointer;
            border-radius: 3px;
            user-select: none;
        }
        .channel:hover {
            background: var(--lightbg);
            color: var(--white);
        }
        .channel:active {
            background: var(--lighterbg);
            color: var(--white);
        }
        .channel .display-name {
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            text-wrap: nowrap;
        }
        .channel svg {
            min-width: 24px;
            display: block;
        }
    </style>
    <div class='channel'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3L6 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M20.5 16H2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M22 7H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M18 3L14 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>
        <span class='display-name'><slot name="display-name">Unknown Channel</slot></span>
    </div>
`

export class TextChannelElement extends BaseElement {
    static observedAttributes = [
        'display-name',
        'selected'
    ]

    constructor (channel?: Channel) {
        super(templateElement)

        if (channel !== undefined) {
            this.setAttribute('display-name', channel.name)
            this.setAttribute('order', channel.order.toString())
            this.setAttribute('id', channel.id)
        }
        this.addEventListener('click', (ev) => {
            this.setActive()
        })
    }

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        super.attributeChangedCallback(name, oldValue, newValue)
        switch (name) {
            case 'selected':
                if (newValue === 'true') {
                    Array.from(document.querySelectorAll('.current-channel-name')).forEach((el) => {
                        if (el instanceof HTMLElement) {
                            el.innerText = this.getAttribute('display-name') ?? ''
                        }
                    })
                }
                break
        }
    }

    setActive (): void {
        if (this.getAttribute('selected') !== 'true') {
            const textChannels = Array.from(document.querySelector('section.channels channel-list')?.shadowRoot?.querySelectorAll('text-channel') ?? []).filter(el => el instanceof TextChannelElement) as TextChannelElement[]
            textChannels.forEach(el => { this === el ? el.setAttribute('selected', 'true') : el.removeAttribute('selected') })

            const messageList = document.querySelector('section.middle-section message-list')
            if (messageList instanceof MessageListElement) {
                messageList.loadContent(
                    app.channels.get(this.id)?.messages ?? null
                )
            }
        }
    }
}

window.customElements.define('text-channel', TextChannelElement)
