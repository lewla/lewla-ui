import { BaseElement } from '../classes/baseelement'
import { VoiceChannelElement, TextChannelElement } from '../components/index'
import type { Channel } from '../objects/channel'

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

export class ChannelListElement extends BaseElement {
    static observedAttributes = []

    constructor () {
        super(templateElement)
    }

    loadContent (channels: Map<string, Channel> | null): void {
        this.shadowRoot?.querySelectorAll('text-channel, voice-channel').forEach(el => { el.remove() })
        if (channels === null) { return }
        channels.forEach(
            (channel) => {
                if (channel.type === 'text') {
                    const el = new TextChannelElement(channel)
                    channel.element = el
                    if (el.id === window.localStorage.getItem('selected-text-channel')) {
                        el.setAttribute('selected', 'true')
                        document.querySelector('message-list[channel="' + el.getAttribute('id') + '"]')?.setAttribute('active', 'true')
                    }
                    this.shadowRoot?.appendChild(el)
                } else if (channel.type === 'voice') {
                    const el = new VoiceChannelElement(channel)
                    channel.element = el
                    this.shadowRoot?.appendChild(el)
                }
            }
        )
    }
}

window.customElements.define('channel-list', ChannelListElement)
