export class BaseAction {
    public static identifier: string
    public body: { data: any }
    public target: WebSocket

    constructor (target: WebSocket, body: { data: any }) {
        this.target = target
        this.body = body
    }

    public handle (): any {}

    public send (): void {
        const identifier = (this.constructor as typeof BaseAction).identifier ?? ''
        this.target.send(JSON.stringify({ action: identifier, data: this.body.data }))
    }
}
