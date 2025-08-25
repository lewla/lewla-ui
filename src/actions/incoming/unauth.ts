import { app } from '../..'
import { BaseAction } from './../base'

export interface Payload {
    message: string
}

export class UnauthAction extends BaseAction {
    public static identifier = 'unauth'
    public body: { data: Payload }

    constructor (target: WebSocket | undefined, body: { data: Payload }, id?: string) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.message !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        window.localStorage.removeItem('authtoken')
        app.showLoginUI()
    }
}
