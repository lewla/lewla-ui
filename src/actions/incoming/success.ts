import { BaseAction } from '../base.js'

interface SuccessData {
    message: string
}

export class SuccessAction extends BaseAction {
    public static identifier = 'success'
    public body: { data: SuccessData }

    constructor (target: WebSocket, body: { data: SuccessData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.message !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        console.log(this.body.data.message)
    }
}
