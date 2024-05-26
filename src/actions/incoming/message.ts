import { TextMessageElement } from '../../components/textmessage.js'
import { storeData } from '../../db/index.js'
import { app } from '../../index.js'
import { BaseAction } from '../base.js'

export interface MessageData {
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
    public body: { data: MessageData }

    constructor (target: WebSocket, body: { data: MessageData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.channel !== 'string' ||
            typeof this.body.data.type !== 'string' ||
            typeof this.body.data.timestamp !== 'string' ||
            typeof this.body.data.member !== 'string' ||
            this.body.data.body == null
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

        storeData('message', this.body.data)
            .catch((error) => {
                console.log(error)
            })

        if (channel.element?.getAttribute('selected') === 'true') {
            const message = new TextMessageElement({ id: this.body.data.id, member, body: { text: this.body.data.body.text ?? '' } })
            document.querySelector('message-list')?.shadowRoot?.appendChild(message)
        }
    }
}
