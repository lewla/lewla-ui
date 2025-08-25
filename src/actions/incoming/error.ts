import { BaseAction } from './../base'

export interface Payload {
    message: string
}

export class ErrorAction extends BaseAction {
    public static identifier = 'error'
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
        console.error(this.body.data.message)
    }
}
