import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

export interface Payload {
    transportId: string
    kind: types.MediaKind
    rtpParameters: types.RtpParameters
    appData: types.AppData
    channelId: string
}

export class RTCTransportProduceAction extends BaseAction {
    public static identifier = 'rtctransportproduce'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.transportId !== 'string' ||
            typeof this.body.data.kind !== 'string' ||
            typeof this.body.data.channelId !== 'string' ||
            this.body.data.rtpParameters === undefined ||
            this.body.data.appData === undefined
        ) {
            throw new Error('Invalid payload')
        }
    }
}
