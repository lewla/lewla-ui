import { Message } from '../../objects/message'
import { app } from '../../index'
import { BaseAction } from './../base'

export interface Payload {
    id: string
    timestamp: string
    member: string
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
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.channel !== 'string' ||
            typeof this.body.data.type !== 'string' ||
            typeof this.body.data.timestamp !== 'string' ||
            typeof this.body.data.member !== 'string' ||
            typeof this.body.data.id !== 'string' ||
            this.body.data?.body == null
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        const member = app.members.get(this.body.data.member)
        const channel = app.channels.get(this.body.data.channel)

        if (member === undefined) {
            return
        }
        if (channel === undefined) {
            return
        }

        const message = new Message({
            id: this.body.data.id,
            member: member.id,
            channel: channel.id,
            timestamp: this.body.data.timestamp,
            type: this.body.data.type,
            body: this.body.data.body
        })
        channel.messages.set(message.id, message)
        message.store()
        message.display()
    }
}
