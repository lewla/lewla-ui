import { BaseAction } from './base.js'

interface TokenData {
    token: string
}

export class TokenAction extends BaseAction {
    public static identifier = 'token'
    public body: { data: TokenData }

    constructor (sender: WebSocket, body: { data: TokenData }) {
        super(sender, body)
        this.body = body

        if (
            typeof this.body.data.token !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        this.sender.send(JSON.stringify({
            action: 'auth',
            data: {
                token: this.body.data.token
            }
        }))
    }
}
