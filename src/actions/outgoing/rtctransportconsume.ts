import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

interface RTCTransportConsumeData {
    transportId: string
    producerId: string
    rtpCapabilities: types.RtpCapabilities
    channelId: string
}

export class RTCTransportConsumeAction extends BaseAction {
    public static identifier = 'rtctransportconsume'
    public body: { data: RTCTransportConsumeData }

    constructor (target: WebSocket | undefined, body: { data: RTCTransportConsumeData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.transportId !== 'string' ||
            typeof this.body.data.producerId !== 'string' ||
            typeof this.body.data.channelId !== 'string' ||
            this.body.data.rtpCapabilities === undefined
        ) {
            throw new Error('Invalid payload')
        }
    }
}
