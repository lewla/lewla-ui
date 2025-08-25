import { MemberListElement } from '../components'
import { ServerMemberElement } from '../components/servermember'
import { storeData } from '../db/index'
import type { ServerMember as ServerMemberInterface } from '../interfaces/servermember'

export class ServerMember implements ServerMemberInterface {
    public id: string
    public type: 'user' | 'bot'
    public display_name: string
    public avatar_url: string
    public status: 'online' | 'offline' | 'busy' | 'away'

    private _element?: ServerMemberElement

    constructor (member: ServerMemberInterface, element?: ServerMemberElement) {
        this.id = member.id
        this.type = member.type
        this.display_name = member.display_name
        this.avatar_url = member.avatar_url ?? 'resources/images/256.png'

        if (member.status == null || !['online', 'offline', 'busy', 'away'].includes(member.status)) {
            member.status = 'offline'
        }
        this.status = member.status

        if (element !== undefined) this._element = element
    }

    public get element (): ServerMemberElement | undefined {
        return this._element
    }

    public set element (value: ServerMemberElement | undefined) {
        this._element = value
    }

    public update (): void {
        this._element?.setAttribute('status', this.status)
        this._element?.setAttribute('display-name', this.display_name)
        this._element?.setAttribute('avatar', this.avatar_url)
        this.store()
    }

    public store (): void {
        storeData(
            'member',
            {
                id: this.id,
                type: this.type,
                display_name: this.display_name,
                avatar_url: this.avatar_url,
                status: this.status,
            }
        ).catch((error) => {
            console.error(error)
        })
    }

    public display (): void {
        this.element = new ServerMemberElement(this)
        const memberList = document.querySelector('member-list')

        if (memberList instanceof MemberListElement) {
            memberList.addItem(this.element)
        }
    }
}
