import { BaseAction } from './../base'

interface PingData {
    timestamp: number
}

export class PingAction extends BaseAction {
    public static identifier = 'ping'
    public body: { data: PingData }

    constructor (target: WebSocket | undefined, body: { data: PingData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.timestamp !== 'number'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
