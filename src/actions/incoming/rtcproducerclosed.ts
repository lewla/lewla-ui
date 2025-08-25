import { app } from '../..'
import { BaseAction } from './../base'

export interface Payload {
    producerId: string
}

export class RTCProducerClosedAction extends BaseAction {
    public static identifier = 'rtcproducerclosed'
    public body: { data: Payload }

    constructor (sender: WebSocket | undefined, body: { data: Payload }, id?: string) {
        super(sender, body)
        this.body = body

        if (
            typeof this.body.data.producerId !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        app.rtc.handleProducerClosed(this.body.data.producerId)
    }
}
