import type { TextChannelElement } from '../components/textchannel.js'
import type { VoiceChannelElement } from '../components/voicechannel.js'
import type { Channel as ChannelInterface } from '../interfaces/channel.js'
import type { Message } from './message.js'

export class Channel implements ChannelInterface {
    public id: string
    public displayName: string
    public type: 'text' | 'voice'
    public order: number
    public messages: Map<string, Message>

    private _element?: TextChannelElement | VoiceChannelElement

    constructor (channel: ChannelInterface, messages?: Map<string, Message>, element?: TextChannelElement | VoiceChannelElement) {
        this.id = channel.id
        this.displayName = channel.displayName
        this.type = channel.type
        this.order = channel.order
        this.messages = messages ?? new Map()

        if (element !== undefined) this._element = element
    }

    public get element (): TextChannelElement | VoiceChannelElement | undefined {
        return this._element
    }

    public set element (value: TextChannelElement | VoiceChannelElement | undefined) {
        this._element = value
    }
}
