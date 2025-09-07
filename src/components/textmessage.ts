import { BaseElement } from '../classes/baseelement'
import { app } from '../index'
import type { Message as MessageInterface } from '../interfaces/message'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        .message {
            display: flex;
            gap: 5px;
            padding: 10px 10px 5px 8px;
            box-sizing: border-box;
            border-left: 2px solid transparent;
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
            border-radius: 100%;
            width: 32px;
        }
        .timestamp {
            font-size: 12px;
            color: var(--lightergray);
            margin-left: 8px;
            position: relative;
            cursor: default;
        }
        .left-section {
            user-select: none;
            min-width: 32px;
            max-width: 32px;
        }
        .metadata {
            align-items: center;
            line-height: 12px;
        }
        .main-section {
            display: flex;
            flex-direction: column;
            gap: 5px;
            overflow: visible;
            overflow-wrap: break-word;
            width: 0;
            flex-grow: 1;
            position: relative;
        }
        .left-section .timestamp {
            display: none;
            margin-left: 0;
            position: relative;
            font-size: 11px;
        }
        .message.collapsed {
            padding: 5px 10px 5px 8px;
        }
        .message.collapsed .left-section {
            min-width: 32px;
            max-width: 32px;
        }
        .message.collapsed .left-section img {
            display: none;
        }
        .message.collapsed .main-section .metadata {
            display: none;
        }
        .message.collapsed:hover .left-section .timestamp {
            display: inline;
        }
        .message.mentioned {
            background: #2076ba22;
            border-left: 2px solid var(--accent);
        }
        .timestamp-tooltip {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            max-width: 220px;
            width: 100vw;
            font-weight: 500;
            background: var(--black);
            padding: 8px 12px;
            text-align: center;
            border-radius: 8px;
            margin-top: -8px;
            margin-left: 32px;
            z-index: 5;
            font-size: 12px;
        }
        .timestamp-tooltip.show {
            display: block;
        }
    </style>
    <div class="message" data-id="">
        <div class="left-section">
            <img src="" class="avatar">
            <span class="timestamp"></span>
        </div>
        <div class="main-section">
            <span class="metadata">
                <span class="member"></span><span class="timestamp"></span>
            </span>
            <span class="body"></span>
        </div>
    </div>
`

export class TextMessageElement extends BaseElement {
    static observedAttributes = [
        'id',
        'member',
        'timestamp'
    ]

    protected content: MessageInterface

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
    }

    render (): void {
        this.setAttribute('member', this.content.member)
        this.setAttribute('timestamp', this.content.timestamp)
        this.dataset.id = this.content.id

        const messageEl = this.shadowRoot?.querySelector('.message')
        const bodyEl = this.shadowRoot?.querySelector('.body')
        const memberEl = this.shadowRoot?.querySelector('.member')
        const avatarEl = this.shadowRoot?.querySelector('.avatar')

        if (bodyEl instanceof HTMLElement) {
            bodyEl.innerHTML = this.content.body?.text ?? ''

            const isMentioned = (((app.currentMember?.display_name.toLowerCase()) != null) && this.content.body?.text?.toLowerCase().includes(app.currentMember?.display_name.toLowerCase())) ?? false

            if (isMentioned) {
                messageEl?.classList.add('mentioned')
            }
        }

        if (this.content.member !== undefined) {
            if (memberEl instanceof HTMLElement) {
                memberEl.textContent = app.members.get(this.getAttribute('member') ?? '')?.display_name ?? ''
            }
            if (avatarEl instanceof HTMLImageElement) {
                avatarEl.src = app.members.get(this.getAttribute('member') ?? '')?.avatar_url ?? 'resources/images/256.png'
            }
        }

        this.shadowRoot?.querySelectorAll('.timestamp')?.forEach(
            (timestampEl) => {
                const date = new Date(this.content.timestamp)
                timestampEl.textContent = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
                timestampEl.setAttribute('popovertarget', 'timestamp-' + this.content.id)

                const timestampPopover = document.createElement('div')
                timestampPopover.id = 'timestamp-' + this.content.id

                timestampPopover.innerText = new Intl.DateTimeFormat(navigator.language, { dateStyle: 'full', timeStyle: 'medium' }).format(date)
                timestampPopover.classList.add('timestamp-tooltip')
                timestampPopover.setAttribute('role', 'tooltip')

                timestampEl.addEventListener('mouseenter', (event) => { timestampPopover.classList.add('show') })
                timestampEl.addEventListener('mouseleave', (event) => { timestampPopover.classList.remove('show') })

                timestampEl.appendChild(timestampPopover)
            }
        )
    }

    collapse (): void {
        const messageEl = this.shadowRoot?.querySelector('.message')
        messageEl?.classList.add('collapsed')
    }

    constructor (content: MessageInterface) {
        super(templateElement)
        this.content = content
        this.render()
    }
}

window.customElements.define('text-message', TextMessageElement)
