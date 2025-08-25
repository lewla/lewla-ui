import { BaseAction } from './../base'

export interface Payload {
    channel: string
}

export class VoiceConnectAction extends BaseAction {
    public static identifier = 'voiceconnect'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.channel !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
