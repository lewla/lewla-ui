import { app } from '../..'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

export interface Payload {
    id: string
    rtpParameters: types.RtpParameters
    producerId: string
    kind: types.MediaKind
    appData: types.AppData
}

export class RTCConsumeProducerAction extends BaseAction {
    public static identifier = 'rtcconsumeproducer'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
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
        app.rtc.consumerProducer(this.body.data)
    }
}
