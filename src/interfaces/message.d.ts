export interface Message {
    id: string
    timestamp: string
    member: string
    channel: string
    type: string
    body: {
        text?: string
        components?: Array<{
            type: string
            data: any
        }>
    }
}
