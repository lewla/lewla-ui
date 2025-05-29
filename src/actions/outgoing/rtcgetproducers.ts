import { BaseAction } from './../base'

interface RTCGetProducersData {
    channelId: string
}

export class RTCGetProducersAction extends BaseAction {
    public static identifier = 'rtcgetproducers'
    public body: { data: RTCGetProducersData }

    constructor (target: WebSocket | undefined, body: { data: RTCGetProducersData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.channelId !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
