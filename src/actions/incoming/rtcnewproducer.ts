import { app } from '../..'
import { RTCTransportConsumeAction } from '../outgoing/rtctransportconsume'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

interface RTCNewProducerData {
    producerId: string
    rtpParameters: types.RtpParameters
    memberId: string
    channelId: string
}

export class RTCNewProducerAction extends BaseAction {
    public static identifier = 'rtcnewproducer'
    public body: { data: RTCNewProducerData }

    constructor (sender: WebSocket | undefined, body: { data: RTCNewProducerData }, id?: string) {
        super(sender, body)
        this.body = body

        if (
            typeof this.body.data.producerId !== 'string' ||
            typeof this.body.data.memberId !== 'string' ||
            typeof this.body.data.channelId !== 'string' ||
            this.body.data.rtpParameters === undefined
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        const recvTransport = app.recvTransport

        if (recvTransport === undefined || app.device === undefined) {
            return
        }

        if (this.body.data.memberId !== app.currentMember?.id) {
            const consumeAction = new RTCTransportConsumeAction(app.ws, { data: { rtpCapabilities: app.device.rtpCapabilities, transportId: recvTransport.id, producerId: this.body.data.producerId, channelId: this.body.data.channelId } })
            consumeAction.send()
        } else {
            // debug, lets consume our own stream
            const consumeAction = new RTCTransportConsumeAction(app.ws, { data: { rtpCapabilities: app.device.rtpCapabilities, transportId: recvTransport.id, producerId: this.body.data.producerId, channelId: this.body.data.channelId } })
            consumeAction.send()
        }
    }
}
