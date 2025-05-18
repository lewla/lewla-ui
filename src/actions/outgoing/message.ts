import { BaseAction } from './../base'

interface MessageData {
    channel: string
    type: string
    body: {
        text?: string
        components?: Array<{
            type: string
            data: any
        }>
    }
}

export class MessageAction extends BaseAction {
    public static identifier = 'message'
    public body: { data: MessageData }

    constructor (sender: WebSocket, body: { data: MessageData }) {
        super(sender, body)
        this.body = body

        if (
            typeof this.body.data.channel !== 'string' ||
            typeof this.body.data.type !== 'string' ||
            this.body.data.body == null
        ) {
            throw new Error('Invalid payload')
        }
    }
}
