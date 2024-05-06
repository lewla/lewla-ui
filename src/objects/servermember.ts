import type { ServerMemberElement } from '../components/servermember.js'
import type { ServerMember as ServerMemberInterface } from '../interfaces/servermember.js'

export class ServerMember implements ServerMemberInterface {
    public id: string
    public type: 'user' | 'bot'
    public display_name: string
    public avatar_url: string

    private _element?: ServerMemberElement

    constructor (member: ServerMemberInterface, element?: ServerMemberElement) {
        this.id = member.id
        this.type = member.type
        this.display_name = member.display_name
        this.avatar_url = member.avatar_url ?? 'resources/images/256.png'

        if (element !== undefined) this._element = element
    }

    public get element (): ServerMemberElement | undefined {
        return this._element
    }

    public set element (value: ServerMemberElement | undefined) {
        this._element = value
    }
}
