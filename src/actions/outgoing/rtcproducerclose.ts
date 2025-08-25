import { BaseAction } from './../base'

export interface Payload {
    producerId: string
}

export class RTCProducerCloseAction extends BaseAction {
    public static identifier = 'rtcproducerclose'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.producerId !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
