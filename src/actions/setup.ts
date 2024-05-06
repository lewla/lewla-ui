import { BaseAction } from './base.js'
import { ServerMember } from '../objects/servermember.js'
import type { ServerMember as ServerMemberInterface } from '../interfaces/servermember.js'
import { Channel } from '../objects/channel.js'
import type { Channel as ChannelInterface } from '../interfaces/channel.js'
import { app } from '../index.js'

interface SetupData {
    channels: ChannelInterface[]
    members: ServerMemberInterface[]
}

export class SetupAction extends BaseAction {
    public static identifier = 'setup'
    public body: { data: SetupData }

    constructor (sender: WebSocket, body: { data: SetupData }) {
        super(sender, body)
        this.body = body
    }

    public handle (): void {
        this.body.data.channels.forEach((data) => {
            const channel = new Channel(data)
            app.channels.set(channel.id, channel)
        })
        this.body.data.members.forEach((data) => {
            const member = new ServerMember(data)
            app.members.set(member.id, member)
        })
        app.loadUI()
    }
}
