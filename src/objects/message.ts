import { MessageListElement } from '../components/messagelist.js'
import { TextMessageElement } from '../components/textmessage.js'
import { storeData } from '../db/index.js'
import { app } from '../index.js'
import type { Message as MessageInterface } from '../interfaces/message.js'

export class Message implements MessageInterface {
    public id: string
    public member: string
    public channel: string
    public timestamp: string
    public type: string
    public body: {
        text?: string
        components?: Array<{
            type: string
            data: any
        }>
    }

    private _element?: TextMessageElement

    constructor (message: MessageInterface, element?: TextMessageElement) {
        this.id = message.id
        this.body = message.body
        this.channel = message.channel
        this.member = message.member
        this.timestamp = message.timestamp
        this.type = message.type
    }

    public get element (): TextMessageElement | undefined {
        return this._element
    }

    public set element (value: TextMessageElement | undefined) {
        this._element = value
    }

    public store (): void {
        storeData(
            'message',
            {
                id: this.id,
                body: this.body,
                channel: this.channel,
                member: this.member,
                timestamp: this.timestamp,
                type: this.type,
            }
        ).catch((error) => {
            console.log(error)
        })
    }

    public display (): void {
        const channel = app.channels.get(this.channel)

        if (channel == null) {
            return
        }

        this.element = new TextMessageElement(this)
        const messageList = document.querySelector('message-list[channel="' + channel.id + '"]')

        if (messageList instanceof MessageListElement) {
            messageList.addItem(this.element)
        }
    }
}
