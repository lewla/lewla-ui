import { app } from '../../index'
import { BaseAction } from './../base'

export interface Payload {
    member: string
    status: 'online' | 'offline' | 'busy' | 'away'
}

export class MemberStatusChangeAction extends BaseAction {
    public static identifier = 'memberstatuschange'
    public body: { data: Payload }

    constructor (sender: WebSocket, body: { data: Payload }) {
        super(sender, body)
        this.body = body

        if (
            typeof this.body.data.member !== 'string' ||
            !['online', 'offline', 'busy', 'away'].includes(this.body.data.status)
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        const member = app.members.get(this.body.data.member)
        if (member === undefined) {
            return
        }

        member.status = this.body.data.status
        member.update()
    }
}
