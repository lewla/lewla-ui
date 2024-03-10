import { BaseElement } from '../classes/baseelement.js'
import { ServerMemberElement } from './servermember.js'
import type { ServerMember } from '../objects/servermember.js'

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

export class MemberListElement extends BaseElement {
    static observedAttributes = []

    constructor () {
        super(templateElement)
    }

    loadContent (members: Map<string, ServerMember> | null): void {
        this.shadowRoot?.querySelectorAll('server-member').forEach(el => { el.remove() })
        if (members === null) { return }
        members.forEach(
            (member) => {
                const el = new ServerMemberElement(member)
                member.element = el
                this.shadowRoot?.appendChild(el)
            }
        )
    }
}

window.customElements.define('member-list', MemberListElement)
