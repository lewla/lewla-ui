import { app } from '../..'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

interface RTCConsumeProducerData {
    id: string
    rtpParameters: types.RtpParameters
    producerId: string
    kind: 'audio' | 'video'
    appData: types.AppData
}

export class RTCConsumeProducerAction extends BaseAction {
    public static identifier = 'rtcconsumeproducer'
    public body: { data: RTCConsumeProducerData }

    constructor (target: WebSocket | undefined, body: { data: RTCConsumeProducerData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.id !== 'string' ||
            typeof this.body.data.producerId !== 'string' ||
            (this.body.data.kind !== 'audio' && this.body.data.kind !== 'video') ||
            this.body.data.rtpParameters === undefined ||
            this.body.data.appData === undefined
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        const recvTransport = app.recvTransport

        if (recvTransport === undefined) {
            return
        }

        recvTransport.consume({
            id: this.body.data.id,
            producerId: this.body.data.producerId,
            rtpParameters: this.body.data.rtpParameters,
            kind: this.body.data.kind,
            appData: this.body.data.appData
        }).then((consumer) => {
            consumer.resume()

            const channelId = consumer.appData?.channelId
            const memberId = consumer.appData?.memberId

            if (typeof channelId === 'string' && typeof memberId === 'string') {
                const channel = app.channels.get(channelId)
                const member = app.members.get(memberId)

                if (member === undefined) {
                    return
                }
                if (channel === undefined) {
                    return
                }

                const audioEls = Array.from(document.querySelector('section.channels channel-list')?.shadowRoot?.querySelectorAll('audio') ?? []).filter(el => el instanceof HTMLAudioElement && el.getAttribute('memberid') === member.id)
                audioEls.forEach((audioEl) => {
                    audioEl.pause()
                    audioEl.remove()
                })

                const el = document.createElement('audio')
                el.setAttribute('memberId', memberId)
                el.setAttribute('channelId', channelId)
                el.volume = 0.5
                el.autoplay = true
                el.srcObject = new MediaStream([consumer.track])
                channel.element?.shadowRoot?.querySelector('.members voice-member[id="' + member.id + '"]')?.shadowRoot?.querySelector('.extra')?.appendChild(el)
            }
        }).catch((reason: string) => {
            console.error(reason)
        })
    }
}
