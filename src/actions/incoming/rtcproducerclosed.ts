import { app } from '../..'
import { BaseAction } from './../base'

interface RTCProducerClosedData {
    producerId: string
}

export class RTCProducerClosedAction extends BaseAction {
    public static identifier = 'rtcproducerclosed'
    public body: { data: RTCProducerClosedData }

    constructor (sender: WebSocket | undefined, body: { data: RTCProducerClosedData }, id?: string) {
        super(sender, body)
        this.body = body

        if (
            typeof this.body.data.producerId !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        const recvTransport = app.recvTransport

        if (recvTransport === undefined || app.device === undefined) {
            return
        }

        for (const consumer of app.consumers.values()) {
            if (consumer.producerId === this.body.data.producerId) {
                consumer.close()
                app.consumers.delete(consumer.id)
            }
        }
    }
}
