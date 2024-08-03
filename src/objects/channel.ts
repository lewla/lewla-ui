import type { TextChannelElement } from '../components/textchannel.js'
import type { VoiceChannelElement } from '../components/voicechannel.js'
import { storeData } from '../db/index.js'
import type { Channel as ChannelInterface } from '../interfaces/channel.js'
import type { Message as MessageInterface } from '../interfaces/message.js'

export class Channel implements ChannelInterface {
    public id: string
    public name: string
    public type: 'text' | 'voice'
    public order: number
    public messages: Map<string, MessageInterface>

    private _element?: TextChannelElement | VoiceChannelElement

    constructor (channel: ChannelInterface, messages?: Map<string, MessageInterface>, element?: TextChannelElement | VoiceChannelElement) {
        this.id = channel.id
        this.name = channel.name
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

    public store (): void {
        storeData(
            'channel',
            {
                id: this.id,
                name: this.name,
                type: this.type,
                order: this.order,
            }
        ).catch((error) => {
            console.log(error)
        })
    }
}
