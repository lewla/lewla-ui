import { BaseAction } from '../base'

interface RegisterData {
    username: string
    password: string
}

export class RegisterAction extends BaseAction {
    public static identifier = 'register'
    public body: { data: RegisterData }

    constructor (target: WebSocket | undefined, body: { data: RegisterData }) {
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
