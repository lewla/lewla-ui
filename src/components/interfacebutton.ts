import { BaseElement } from '../classes/baseelement'
const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            display: flex;
            height: fit-content;
        }
        .button {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            width: fit-content;
            max-width: 300px;
            background: var(--offwhite);
            color: var(--black);
            padding: 8px 16px;
            border: 0;
            outline: 0;
            box-shadow: none;
            font-weight: 500;
            user-select: none;
        }

        ::slotted([slot="icon-active"]) {
            display: none;
        }
        :host([active-icon="true"]) ::slotted([slot="icon-active"]) {
            display: inline;
        }
        :host([active-icon="true"]) ::slotted([slot="icon"]) {
            display: none;
        }
        :host(:not([active-icon="true"])) ::slotted([slot="icon"]) {
            display: inline;
        }

        /* Padding */
        :host(.p-0) .button { padding: 0px }
        :host(.p-6) .button { padding: 6px }
        :host(.p-12) .button { padding: 12px }
        /* Border Radius */
        :host(.round)  .button { border-radius: 5px }
        :host(.circle) .button { border-radius: 20px }
        /* BG Color */
        :host(.bg-accent) .button { background: var(--accent) }
        :host(.bg-warn)   .button { background: var(--warn) }
        :host(.bg-good)   .button { background: var(--good) }
        :host(.bg-none)   .button { background: none }
        /* BG Hover Color */
        :host(.bg-hov-evenlighterbg) .button:hover { background: var(--evenlighterbg) }
        /* Text Color */
        :host(.color-white)     .button { color: var(--white) }
        :host(.color-offwhite)  .button { color: var(--offwhite) }
        :host(.color-lightgray) .button { color: var(--lightgray) }
        :host(.color-accent) .button { color: var(--accent) }
        :host(.color-warn) .button { color: var(--warn) }
        :host(.color-good) .button { color: var(--good) }
    </style>
    <div class='button'>
        <slot name="icon"></slot>
        <slot name="icon-active"></slot>
        <slot name="label"></slot>
    </div>
`

export class InterfaceButtonElement extends BaseElement {
    static observedAttributes = []

    constructor () {
        super(templateElement)
    }
}

window.customElements.define('interface-button', InterfaceButtonElement)
