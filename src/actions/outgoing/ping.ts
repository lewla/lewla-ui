import { BaseAction } from './../base'

export interface Payload {
    timestamp: number
}

export class PingAction extends BaseAction {
    public static identifier = 'ping'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.timestamp !== 'number'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
