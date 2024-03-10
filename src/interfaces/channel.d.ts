export interface Channel {
    id: string
    type: 'text' | 'voice'
    displayName: string
    order: number
}
