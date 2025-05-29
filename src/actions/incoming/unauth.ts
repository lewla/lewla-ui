import { app } from '../..'
import { BaseAction } from './../base'

interface UnauthData {
    message: string
}

export class UnauthAction extends BaseAction {
    public static identifier = 'unauth'
    public body: { data: UnauthData }

    constructor (target: WebSocket | undefined, body: { data: UnauthData }, id?: string) {
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
