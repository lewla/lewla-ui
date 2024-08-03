import { BaseElement } from '../classes/baseelement.js'
import { MessageListElement } from './messagelist.js'
import type { Channel as ChannelInterface } from '../interfaces/channel.js'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        .channel {
            color: var(--lightgray);
            display: block;
            padding: 8px 3px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            column-gap: 5px;
            justify-content: flex-start;
            margin: 0px 4px 4px 4px;
            cursor: pointer;
            border-radius: 3px;
            user-select: none;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
        }
        .channel:hover {
            background: var(--lightbg);
            color: var(--white);
        }
        .channel:active, :host([selected="true"]) .channel {
            background: var(--lighterbg);
            color: var(--white);
        }
        :host([unread="true"]) .channel {
            border-right-color: var(--lightergray)
        }
        :host([selected="true"]) .channel {
            background: var(--lighterbg);
            color: var(--white);
            border-left-color: var(--accent);
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M10 3L6 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M20.5 16H2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M22 7H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M18 3L14 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>
        <span class='display-name'><slot name="display-name">Unknown Channel</slot></span>
    </div>
`

export class TextChannelElement extends BaseElement {
    static observedAttributes = [
        'display-name',
        'selected'
    ]

    constructor (channel?: ChannelInterface) {
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
        window.localStorage.setItem('selected-text-channel', this.getAttribute('id') ?? '')

        const textChannels = Array.from(document.querySelector('section.channels channel-list')?.shadowRoot?.querySelectorAll('text-channel') ?? []).filter(el => el instanceof TextChannelElement) as TextChannelElement[]
        textChannels.forEach(el => { this === el ? el.setAttribute('selected', 'true') : el.removeAttribute('selected') })

        const messageLists = Array.from(document.querySelectorAll('message-list[channel]') ?? []).filter(el => el instanceof MessageListElement) as MessageListElement[]
        messageLists.forEach(el => { this.getAttribute('id') === el.getAttribute('channel') ? el.setAttribute('active', 'true') : el.removeAttribute('active') })
    }
}

window.customElements.define('text-channel', TextChannelElement)
