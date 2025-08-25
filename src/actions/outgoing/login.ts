import { BaseAction } from '../base'

export interface Payload {
    username: string
    password: string
}

export class LoginAction extends BaseAction {
    public static identifier = 'login'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.username !== 'string' ||
            typeof this.body.data.password !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
