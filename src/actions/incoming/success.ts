import { BaseAction } from './../base'

interface SuccessData {
    message: string
}

export class SuccessAction extends BaseAction {
    public static identifier = 'success'
    public body: { data: SuccessData }

    constructor (target: WebSocket | undefined, body: { data: SuccessData }, id?: string) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.message !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        console.info(this.body.data.message)
    }
}
