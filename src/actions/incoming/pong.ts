import { BaseAction } from './../base'

interface PongData {
    timestamp: number
}

export class PongAction extends BaseAction {
    public static identifier = 'pong'
    public body: { data: PongData }

    constructor (target: WebSocket | undefined, body: { data: PongData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.timestamp !== 'number'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        const rtt = Date.now() - this.body.data.timestamp
        console.info('Round-trip time:', rtt, 'ms')
    }
}
