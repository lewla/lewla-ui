import { app } from './../../index'
import { BaseAction } from '../base'

interface AuthenticatedData {
    member: {
        id: string
        username: string
        display_name: string
        creation_date: string
        avatar_url: string | null
    }
}

export class AuthenticatedAction extends BaseAction {
    public static identifier = 'authenticated'
    public body: { data: AuthenticatedData }

    constructor (target: WebSocket | undefined, body: { data: AuthenticatedData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.member?.id !== 'string' ||
            typeof this.body.data.member?.username !== 'string' ||
            typeof this.body.data.member?.display_name !== 'string' ||
            typeof this.body.data.member?.creation_date !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        app.currentMember = app.members.get(this.body.data.member.id)
    }
}
