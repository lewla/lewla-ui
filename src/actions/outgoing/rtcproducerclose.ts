import { BaseAction } from './../base'

interface RTCProducerCloseData {
    producerId: string
}

export class RTCProducerCloseAction extends BaseAction {
    public static identifier = 'rtcproducerclose'
    public body: { data: RTCProducerCloseData }

    constructor (target: WebSocket | undefined, body: { data: RTCProducerCloseData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.producerId !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
