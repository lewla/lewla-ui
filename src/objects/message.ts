import type { TextMessageElement } from '../components/textmessage.js'
import type { Message as MessageInterface } from '../interfaces/message.js'
import type { Channel } from './channel.js'
import type { ServerMember } from './servermember.js'

export class Message implements MessageInterface {
    public id: string
    public body: { text: string }
    public member?: ServerMember
    public channel?: Channel

    private _element?: TextMessageElement

    constructor (message: MessageInterface, element?: TextMessageElement) {
        this.id = message.id
        this.body = message.body
        this.channel = message.channel
        this.member = message.member
    }

    public get element (): TextMessageElement | undefined {
        return this._element
    }

    public set element (value: TextMessageElement | undefined) {
        this._element = value
    }
}
