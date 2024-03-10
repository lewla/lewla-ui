import { BaseElement } from '../classes/baseelement.js'
import type { ServerMember } from '../interfaces/servermember.js'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        .member {
            color: var(--lightgray);
            display: block;
            padding: 8px 6px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            column-gap: 8px;
            justify-content: flex-start;
            margin: 0px 4px 4px 4px;
            cursor: pointer;
            border-radius: 3px;
            user-select: none;
        }
        .member:hover {
            background: var(--lightbg);
            color: var(--white);
        }
        .member:active {
            background: var(--lighterbg);
            color: var(--white);
        }
        .member .avatar {
            max-width: 32px;
            display: block;
            border-radius: 3px;
        }
        .member .display-name {
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            text-wrap: nowrap;
        }
    </style>
    <div class='member'>
        <img src class="avatar"><span class='display-name'><slot name="display-name">Unknown Member</slot></span>
    </div>
`

export class ServerMemberElement extends BaseElement {
    static observedAttributes = [
        'display-name',
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
            this.setAttribute('display-name', member.displayName)
            this.setAttribute('avatar', member.avatar)
        }
    }
}

window.customElements.define('server-member', ServerMemberElement)
