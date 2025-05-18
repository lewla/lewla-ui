import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

interface RTCTransportConnectData {
    transportId: string
    dtlsParameters: types.DtlsParameters
    channelId: string
}

export class RTCTransportConnectAction extends BaseAction {
    public static identifier = 'rtctransportconnect'
    public body: { data: RTCTransportConnectData }

    constructor (target: WebSocket | undefined, body: { data: RTCTransportConnectData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.transportId !== 'string' ||
            typeof this.body.data.channelId !== 'string' ||
            this.body.data.dtlsParameters === undefined
        ) {
            throw new Error('Invalid payload')
        }
    }
}
