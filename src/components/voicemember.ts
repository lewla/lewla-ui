import { BaseElement } from '../classes/baseelement'
import type { ServerMember } from '../interfaces/servermember'

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
            position: relative;
            border-right: 3px solid transparent;
            transition: 0.2s;
        }
        :host([speaking="true"]) .member {
            border-color: var(--good);
            box-shadow: inset 0px 0px 20px 20px #86db371c;
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
            width: 32px;
            height: 32px;
            display: block;
            border-radius: 3px;
        }
        .member .display-name {
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            text-wrap: nowrap;
        }
        .member .extra {
            display: none;
        }
    </style>
    <div class='member'>
        <img src class="avatar"><span class='display-name'><slot name="display-name">Unknown Member</slot></span><div class="extra"></div>
    </div>
`

export class VoiceMemberElement extends BaseElement {
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
            this.setAttribute('display-name', member.display_name)
            this.setAttribute('avatar', member.avatar_url)
            this.setAttribute('id', member.id)
        }
    }
}

window.customElements.define('voice-member', VoiceMemberElement)
