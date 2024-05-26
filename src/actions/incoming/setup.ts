import { BaseAction } from '../base.js'
import { ServerMember } from '../../objects/servermember.js'
import type { ServerMember as ServerMemberInterface } from '../../interfaces/servermember.js'
import { Channel } from '../../objects/channel.js'
import type { Channel as ChannelInterface } from '../../interfaces/channel.js'
import { app } from '../../index.js'
import { getAll, storeData } from '../../db/index.js'
import type { MessageData } from './message.js'
import { TextMessageElement } from '../../components/textmessage.js'

interface SetupData {
    channels: ChannelInterface[]
    members: ServerMemberInterface[]
}

export class SetupAction extends BaseAction {
    public static identifier = 'setup'
    public body: { data: SetupData }

    constructor (target: WebSocket, body: { data: SetupData }) {
        super(target, body)
        this.body = body
    }

    public handle (): void {
        this.body.data.channels.forEach((data) => {
            const channel = new Channel(data)
            app.channels.set(channel.id, channel)

            storeData(
                'channel',
                {
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                    order: channel.order
                }
            ).catch((error) => {
                console.error(error)
            })
        })
        this.body.data.members.forEach((data) => {
            const member = new ServerMember(data)
            app.members.set(member.id, member)
        })

        caches.open('avatars').then((cache) => {
            app.members.forEach((member) => {
                storeData(
                    'member',
                    {
                        id: member.id,
                        type: member.type,
                        display_name: member.display_name,
                        avatar_url: member.avatar_url,
                        status: member.status
                    }
                ).catch((error) => {
                    console.error(error)
                })

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
            .then((messages: MessageData[]) => {
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

                    if (app.channels.get(message.channel)?.element?.getAttribute('selected') === 'true') {
                        const el = new TextMessageElement({ id: message.id, member, body: { text: message.body.text ?? '' } })
                        document.querySelector('message-list')?.shadowRoot?.appendChild(el)
                    }
                })
            })
            .catch((error) => {
                console.error(error)
            })
        app.loadUI()
    }
}
