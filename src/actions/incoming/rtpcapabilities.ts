import { app } from '../../index'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'
import { Device } from 'mediasoup-client'
import { RTCCreateSendTransportAction } from '../outgoing/rtccreatesendtransport'
import { RTCCreateReceiveTransportAction } from '../outgoing/rtccreatereceivetransport'

interface RTPCapabilitiesData {
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
        if (app.device === undefined) {
            app.device = new Device()

            await app.device?.load({ routerRtpCapabilities: this.body.data.rtpCapabilities }).catch((reason) => { console.error(reason) })
        }

        if (app.device?.canProduce('audio')) {
            const createSendTransport = new RTCCreateSendTransportAction(app.ws, { data: { sctpCapabilities: app.device?.sctpCapabilities, channelId: this.body.data.channelId } })
            createSendTransport.send()
            const createRecvTransport = new RTCCreateReceiveTransportAction(app.ws, { data: { sctpCapabilities: app.device?.sctpCapabilities, channelId: this.body.data.channelId } })
            createRecvTransport.send()
        } else {
            console.error('Cannot produce audio')
        }
    }
}
