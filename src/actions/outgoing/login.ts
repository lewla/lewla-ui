import { BaseAction } from '../base'

interface LoginData {
    username: string
    password: string
}

export class LoginAction extends BaseAction {
    public static identifier = 'login'
    public body: { data: LoginData }

    constructor (target: WebSocket | undefined, body: { data: LoginData }) {
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
