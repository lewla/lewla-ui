import { VoiceConnectAction } from '../actions/outgoing/voiceconnect'
import { BaseElement } from '../classes/baseelement'
import { app } from '../index'
import type { Channel as ChannelInterface } from '../interfaces/channel'
import { VoiceMemberElement } from './voicemember'
import { VoicePanelElement } from './voicepanel'

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
        :host([selected="true"]) .channel {
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
        .members {
            padding: 0px 5px;
        }
    </style>
    <div class='channel'>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0V8Z"></path><path stroke-linecap="round" d="M13 8h4m-4 3h4m3-1v1a8 8 0 0 1-8 8m-8-9v1a8 8 0 0 0 8 8m0 0v3" opacity=".5"></path></g></svg>
        <span class='display-name'><slot name="display-name">Unknown Channel</slot></span>
    </div>
    <div class='members'>
    </div>
`

export class VoiceChannelElement extends BaseElement {
    static observedAttributes = [
        'display-name'
    ]

    public connection?: RTCPeerConnection

    constructor (channel?: ChannelInterface) {
        super(templateElement)

        if (channel !== undefined) {
            this.setAttribute('display-name', channel.name)
            this.setAttribute('order', channel.order.toString())
            this.setAttribute('id', channel.id)
            channel.members.forEach(memberId => { this.addVoiceMember(memberId) })
        }
        this.shadowRoot?.querySelector('.channel')?.addEventListener('click', (ev) => {
            this.setActive()
            this.connect()
        })
    }

    addVoiceMember (memberId: string): void {
        const member = app.members.get(memberId)

        if (member === undefined) {
            return
        }

        this.shadowRoot?.querySelectorAll('.members voice-member[id="' + member.id + '"]').forEach(voiceMember => { voiceMember.remove() })

        const el = new VoiceMemberElement(member)
        this.shadowRoot?.querySelector('.members')?.appendChild(el)
    }

    // TODO: Move this method when event system is added (show when connect to voice event is fired)
    protected displayVoicePanel (): void {
        Array.from(document.getElementsByTagName('voice-panel')).forEach(el => { el.remove() })

        const voicePanel = new VoicePanelElement()
        voicePanel.setAttribute('current-voice-channel', this.getAttribute('display-name') ?? 'Unknown channel')
        voicePanel.setAttribute('rtt', '90')

        document.querySelector('section.channels')?.appendChild(voicePanel)
    }

    setActive (): void {
        window.localStorage.setItem('selected-voice-channel', this.getAttribute('id') ?? '')

        const voiceChannels = Array.from(document.querySelector('section.channels channel-list')?.shadowRoot?.querySelectorAll('voice-channel') ?? []).filter(el => el instanceof VoiceChannelElement)
        voiceChannels.forEach(el => { this === el ? el.setAttribute('selected', 'true') : el.removeAttribute('selected') })

        this.displayVoicePanel()
    }

    connect (): void {
        if (app.ws === undefined) {
            return
        }

        app.sendTransport?.close()
        app.recvTransport?.close()

        const connect = new VoiceConnectAction(
            app.ws,
            {
                data: {
                    channel: this.getAttribute('id') ?? ''
                }
            }
        )
        connect.send()
    }
}

window.customElements.define('voice-channel', VoiceChannelElement)
