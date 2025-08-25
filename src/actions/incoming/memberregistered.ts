import { app } from './../../index'
import { BaseAction } from '../base'
import { ServerMember } from '../../objects/servermember'

export interface Payload {
    id: string
    type: 'user' | 'bot'
    display_name: string
    avatar_url: string
    status: 'offline'
    creation_date: string
}

export class MemberRegisteredAction extends BaseAction {
    public static identifier = 'memberregistered'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }, id?: string) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.id !== 'string' ||
            typeof this.body.data.type !== 'string' ||
            typeof this.body.data.display_name !== 'string' ||
            typeof this.body.data.status !== 'string' ||
            typeof this.body.data.creation_date !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        const member = new ServerMember(this.body.data)
        app.members.set(member.id, member)
        member.store()
        member.display()

        caches.open('avatars').then((cache) => {
            const avatar = member.avatar_url
            if (typeof avatar === 'string') {
                const url = new URL(window.location.href + avatar)
                cache.add(url)
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }).catch((error) => {
            console.error(error)
        })
    }
}
