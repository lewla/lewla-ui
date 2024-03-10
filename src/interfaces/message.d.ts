import type { Channel } from '../objects/channel.js'
import type { ServerMember } from '../objects/servermember.js'

export interface Message {
    id: string
    member?: ServerMember
    channel?: Channel
    body: {
        text: string
    }
}
