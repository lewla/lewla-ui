import { VoiceChannelElement } from '../../components/voicechannel'
import { VoiceMemberElement } from '../../components/voicemember'
import { app } from '../../index'
import { BaseAction } from './../base'

interface VoiceConnectData {
    member: string
    channel: string
}

export class VoiceConnectAction extends BaseAction {
    public static identifier = 'voiceconnect'
    public body: { data: VoiceConnectData }

    constructor (target: WebSocket | undefined, body: { data: VoiceConnectData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.member !== 'string' ||
            typeof this.body.data.channel !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public handle (): void {
        const member = app.members.get(this.body.data.member)
        const channel = app.channels.get(this.body.data.channel)

        if (member === undefined || channel === undefined) {
            return
        }

        const voiceChannels = Array.from(document.querySelector('section.channels channel-list')?.shadowRoot?.querySelectorAll('voice-channel') ?? []).filter(el => el instanceof VoiceChannelElement)
        voiceChannels.forEach(voiceChannel => { voiceChannel?.shadowRoot?.querySelectorAll('.members voice-member[id="' + member.id + '"]').forEach(voiceMember => { voiceMember.remove() }) })

        const el = new VoiceMemberElement(member)
        channel.element?.shadowRoot?.querySelector('.members')?.appendChild(el)

        channel.members.set(member.id, member)
    }
}
