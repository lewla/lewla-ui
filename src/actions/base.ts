import { app } from '../index.js'

export class BaseAction {
    public static identifier: string
    public body: { data: any }
    public target: WebSocket
    public id: string
    public resolver?: (value: unknown) => void

    constructor (target: WebSocket, body: { data: any }) {
        this.target = target
        this.body = body
        this.id = crypto.randomUUID()
    }

    public handle (): any {}

    public send (): void {
        const identifier = (this.constructor as typeof BaseAction).identifier ?? ''

        if (this.target.readyState !== this.target?.OPEN) {
            throw new Error('Error sending ' + identifier + ': WebSocket not open')
        }

        this.target.send(JSON.stringify({ id: this.id, action: identifier, data: this.body.data }))
    }

    public async sendAsync (timeout: number = 10000): Promise<any> {
        return await new Promise((resolve, reject) => {
            try {
                this.send()
                this.resolver = resolve
                app.requests.set(this.id, this)

                setTimeout(() => {
                    if (app.requests.has(this.id)) {
                        app.requests.delete(this.id)
                        throw new Error('Request took too long to respond')
                    }
                }, timeout)
            } catch (error) {
                reject(error)
            }
        })
    }
}
