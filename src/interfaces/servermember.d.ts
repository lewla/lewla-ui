export interface ServerMember {
    id: string
    type: 'user' | 'bot'
    display_name: string
    avatar_url: string
    status: 'online' | 'offline' | 'busy' | 'away'
}
