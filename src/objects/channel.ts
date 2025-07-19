import { app } from '..'
import type { TextChannelElement } from '../components/textchannel'
import type { VoiceChannelElement } from '../components/voicechannel'
import { storeData } from '../db/index'
import type { Channel as ChannelInterface } from '../interfaces/channel'
import type { Message as MessageInterface } from '../interfaces/message'
import type { ServerMember } from './servermember'

export class Channel implements ChannelInterface {
    public id: string
    public name: string
    public type: 'text' | 'voice'
    public order: number
    public messages: Map<string, MessageInterface>
    public members: Map<string, ServerMember>

    private _element?: TextChannelElement | VoiceChannelElement

    constructor (channel: ChannelInterface, messages?: Map<string, MessageInterface>, members?: string[], element?: TextChannelElement | VoiceChannelElement) {
        this.id = channel.id
        this.name = channel.name
        this.type = channel.type
        this.order = channel.order
        this.messages = messages ?? new Map()
        this.members = new Map()

        members?.forEach((id) => {
            const member = app.members.get(id)
            if (member !== undefined) {
                this.members.set(member.id, member)
            }
        })

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
            console.error(error)
        })
    }
}
