export interface Channel {
    id: string
    type: 'text' | 'voice'
    name: string
    order: number
}
