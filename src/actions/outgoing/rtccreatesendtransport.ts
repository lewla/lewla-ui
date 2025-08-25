import { BaseAction } from '../base'
import type { types } from 'mediasoup-client'

export interface Payload {
    sctpCapabilities: types.SctpCapabilities
    channelId: string
}

export class RTCCreateSendTransportAction extends BaseAction {
    public static identifier = 'rtccreatesendtransport'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.sctpCapabilities.numStreams === 'undefined' ||
            typeof this.body.data.channelId !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
