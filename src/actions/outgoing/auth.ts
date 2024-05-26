import { BaseAction } from '../base.js'

interface AuthData {
    token: string
}

export class AuthAction extends BaseAction {
    public static identifier = 'auth'
    public body: { data: AuthData }

    constructor (target: WebSocket, body: { data: AuthData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.token !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }
}
