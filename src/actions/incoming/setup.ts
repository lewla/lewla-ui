import { BaseAction } from './../base'
import { ServerMember } from '../../objects/servermember'
import type { ServerMember as ServerMemberInterface } from '../../interfaces/servermember'
import type { Channel as ChannelInterface } from '../../interfaces/channel'
import type { Message as MessageInterface } from '../../interfaces/message'
import { Channel } from '../../objects/channel'
import { app } from '../../index'
import { getAll } from '../../db/index'
import { Message } from '../../objects/message'

export interface Payload {
    channels: ChannelInterface[]
    members: ServerMemberInterface[]
    messages: MessageInterface[]
    voiceUsers: Array<{
        member: string
        channel: string
        type: string
    }>
}

export class SetupAction extends BaseAction {
    public static identifier = 'setup'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body
    }

    public handle (): void {
        this.body.data.members.forEach((data) => {
            const member = new ServerMember(data)
            app.members.set(member.id, member)
            member.store()
        })
        this.body.data.channels.forEach((data) => {
            const channel = new Channel(data)
            app.channels.set(channel.id, channel)
            channel.store()
        })
        this.body.data.messages.forEach((data) => {
            const message = new Message(data)
            app.channels.get(message.channel)?.messages.set(message.id, message)
            message.store()
        })
        this.body.data.voiceUsers.forEach((data) => {
            const member = app.members.get(data.member)
            const channel = app.channels.get(data.channel)

            if (member === undefined || channel === undefined) {
                return
            }

            channel.members.set(member.id, member)
        })

        caches.open('avatars').then((cache) => {
            app.members.forEach((member) => {
                const avatar = member.avatar_url
                if (typeof avatar === 'string') {
                    const url = new URL(window.location.href + avatar)
                    cache.add(url)
                        .catch((error) => {
                            console.error(error)
                        })
                }
            })
        }).catch((error) => {
            console.error(error)
        })

        getAll('message')
            .then((messages: MessageInterface[]) => {
                messages.sort((a, b) => {
                    const dateA = new Date(a.timestamp).getTime()
                    const dateB = new Date(b.timestamp).getTime()

                    return dateA - dateB
                })
                messages.forEach((message) => {
                    const member = app.members.get(message.member)
                    const channel = app.channels.get(message.channel)

                    if (member === undefined) {
                        return
                    }
                    if (channel === undefined) {
                        return
                    }

                    const msg = new Message({
                        id: message.id,
                        member: member.id,
                        channel: channel.id,
                        timestamp: message.timestamp,
                        type: message.type,
                        body: message.body
                    })
                    channel.messages.set(msg.id, msg)
                    msg.display()
                })
            })
            .catch((error) => {
                console.error(error)
            })
        app.loadUI()
    }
}
