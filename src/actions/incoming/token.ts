import { AuthAction } from '../outgoing/auth'
import { BaseAction } from './../base'

export interface Payload {
    token: string
}

export class TokenAction extends BaseAction {
    public static identifier = 'token'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.token !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        window.localStorage.setItem('authtoken', this.body.data.token)
        new AuthAction(this.target, { data: { token: this.body.data.token } }).send()
    }
}
