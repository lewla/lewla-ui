import { BaseAction } from './../base'

export interface Payload {
    channelId: string
}

export class RTCGetProducersAction extends BaseAction {
    public static identifier = 'rtcgetproducers'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.channelId !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
