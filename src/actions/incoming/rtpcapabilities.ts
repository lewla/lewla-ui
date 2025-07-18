import { app } from '../../index'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

export interface RTPCapabilitiesData {
    rtpCapabilities: types.RtpCapabilities
    channelId: string
}

export class RTPCapabilitiesAction extends BaseAction {
    public static identifier = 'rtpcapabilities'
    public body: { data: RTPCapabilitiesData }

    constructor (target: WebSocket | undefined, body: { data: RTPCapabilitiesData }) {
        super(target, body)
        this.body = body

        if (
            typeof this.body.data.rtpCapabilities.codecs === 'undefined' ||
            typeof this.body.data.rtpCapabilities.headerExtensions === 'undefined' ||
            typeof this.body.data.channelId !== 'string'
        ) {
            throw new Error('Invalid payload')
        }
    }

    public async handle (): Promise<void> {
        await app.rtc.initDevice(this.body.data)
    }
}
