/**
 * A base for all WebComponents
 * @extends HTMLElement
 * @abstract
 */
export abstract class BaseElement extends HTMLElement {
    static observedAttributes: string[] = []

    /**
     * Create an instance of an Element
     */
    constructor (template?: HTMLTemplateElement) {
        super()
        if (template !== undefined) {
            this.attachShadow({ mode: 'open' })
            this.shadowRoot?.appendChild(template.content.cloneNode(true))
        }
    }

    /**
     * Called when the Element is added to page
     */
    connectedCallback (): void {}

    /**
     * Called when the Element is removed from page
     */
    disconnectedCallback (): void {}

    /**
     * Called when an Element attribute is changed
     * @param name Name of attribute that changed
     * @param oldValue Old attribute value
     * @param newValue New attribute value
     */
    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        Array.from(this.shadowRoot?.querySelectorAll('slot') ?? [])
            .forEach(slot => { if (slot.name === name) slot.innerText = newValue ?? '' })
    }
}

export default BaseElement
