import { BaseAction } from '../base'
import type { types } from 'mediasoup-client'

interface RTCCreateTransportData {
    sctpCapabilities: types.SctpCapabilities
    channelId: string
}

export class RTCCreateReceiveTransportAction extends BaseAction {
    public static identifier = 'rtccreatereceivetransport'
    public body: { data: RTCCreateTransportData }

    constructor (target: WebSocket | undefined, body: { data: RTCCreateTransportData }) {
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
