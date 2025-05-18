import { BaseAction } from './../base'

interface VoiceConnectData {
    channel: string
}

export class VoiceConnectAction extends BaseAction {
    public static identifier = 'voiceconnect'
    public body: { data: VoiceConnectData }

    constructor (target: WebSocket | undefined, body: { data: VoiceConnectData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.channel !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
