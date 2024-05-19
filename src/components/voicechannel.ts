import { BaseElement } from '../classes/baseelement.js'
import type { Channel } from '../interfaces/channel.js'
import { VoicePanelElement } from './voicepanel.js'

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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0V8Z"></path><path stroke-linecap="round" d="M13 8h4m-4 3h4m3-1v1a8 8 0 0 1-8 8m-8-9v1a8 8 0 0 0 8 8m0 0v3" opacity=".5"></path></g></svg>
        <span class='display-name'><slot name="display-name">Unknown Channel</slot></span>
    </div>
`

export class VoiceChannelElement extends BaseElement {
    static observedAttributes = [
        'display-name'
    ]

    constructor (channel?: Channel) {
        super(templateElement)

        if (channel !== undefined) {
            this.setAttribute('display-name', channel.name)
            this.setAttribute('order', channel.order.toString())
        }
        this.addEventListener('click', (ev) => {
            this.displayVoicePanel()
        })
    }

    // TODO: Move this method when event system is added (show when connect to voice event is fired)
    protected displayVoicePanel (): void {
        Array.from(document.getElementsByTagName('voice-panel')).forEach(el => { el.remove() })

        const voicePanel = new VoicePanelElement()
        voicePanel.setAttribute('current-voice-channel', this.getAttribute('display-name') ?? 'Unknown channel')
        voicePanel.setAttribute('rtt', '90')
        voicePanel.setAttribute('upload-per-second', Math.floor(Math.random() * 50).toString() + ' kb/s')
        voicePanel.setAttribute('download-per-second', Math.floor(Math.random() * 500).toString() + ' kb/s')

        document.querySelector('section.channels')?.appendChild(voicePanel)
    }
}

window.customElements.define('voice-channel', VoiceChannelElement)
