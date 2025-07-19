import { app } from '..'
import { BaseElement } from '../classes/baseelement'
import type { Channel } from '../objects/channel'
import { MemberVideoElement } from './membervideo'
import { VoiceOverviewMemberElement } from './voiceoverviewmember'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            height: 100%;
            width: 100%;
            position: absolute;
            background: radial-gradient(#09276f, #031627);
        }
        .channel-overview {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .members {
            display: flex;
            flex-direction: row;
            justify-content: center;
            gap: 15px;
            margin: 25px;
            flex-grow: 1;
            flex-wrap: wrap;
            align-content: center;
        }
    </style>
    <div class='channel-overview'>
        <div class='members'>
        </div>
    </div>
`

export class VoiceOverviewElement extends BaseElement {
    static observedAttributes = [
    ]

    public channel?: Channel

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        super.attributeChangedCallback(name, oldValue, newValue)
    }

    constructor (channel?: Channel) {
        super(templateElement)

        if (channel?.type !== 'voice') {
            throw new Error('Invalid channel type')
        }

        this.channel = channel

        this.render()
    }

    render (): void {
        const container = this.shadowRoot?.querySelector('.channel-overview')
        const membersList = this.shadowRoot?.querySelector('.members')

        if (container == null || membersList == null) {
            return
        }

        this.channel?.members.forEach((member) => {
            const el = new VoiceOverviewMemberElement()

            if (member === undefined) {
                return
            }

            el.setAttribute('avatar', member.avatar_url)
            el.setAttribute('member', member.id)

            membersList.appendChild(el)
        })

        app.rtc.consumers.forEach((consumer) => {
            console.log(consumer)
            if (consumer.kind === 'video' && consumer.appData?.channelId === this.channel?.id) {
                const stream = new MediaStream([consumer.track])
                const el = new MemberVideoElement(stream)
                membersList.appendChild(el)

                consumer.observer.on('close', () => {
                    el.remove()
                })
                consumer.track.addEventListener('ended', () => {
                    el.remove()
                    consumer.close()
                })
            }
        })
    }
}

window.customElements.define('voice-overview', VoiceOverviewElement)
