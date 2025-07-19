import { BaseElement } from '../classes/baseelement'
import type { ServerMember } from '../interfaces/servermember'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            flex-grow: 1;
            max-width: 800px;
            max-height: 440px;
            min-width: 150px;
            height: 100%;
        }
        .member {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            row-gap: 12px;
            justify-content: center;
            user-select: none;
            position: relative;
            background: var(--accent);
            border-radius: 10px;
            flex-direction: column;
            box-shadow: inset 0px 0px 14px 4px #000000b0;
            height: 100%;
        }
        .member .avatar {
            max-width: 84px;
            max-height: 84px;
            width: 90%;
            display: block;
            border-radius: 100%;
        }
    </style>
    <div class='member'>
        <img src class="avatar">
    </div>
`

export class VoiceOverviewMemberElement extends BaseElement {
    static observedAttributes = [
        'avatar'
    ]

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        super.attributeChangedCallback(name, oldValue, newValue)
        switch (name) {
            case 'avatar':
                if (newValue === null) return
                this.shadowRoot?.querySelectorAll('.avatar').forEach(el => {
                    if (el instanceof HTMLImageElement) el.setAttribute('src', newValue)
                })
                break
        }
    }

    constructor (member?: ServerMember) {
        super(templateElement)

        if (member !== undefined) {
            this.setAttribute('avatar', member.avatar_url)
            this.setAttribute('id', member.id)
        }
    }
}

window.customElements.define('voice-overview-member', VoiceOverviewMemberElement)
