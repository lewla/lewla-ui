import { app } from '../..'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

export interface RTCCreateReceiveTransportData {
    id: string
    iceParameters: types.IceParameters
    iceCandidates: types.IceCandidate[]
    dtlsParameters: types.DtlsParameters
    sctpParameters: types.SctpParameters | undefined
    channelId: string
    iceServers: RTCIceServer[]
}

export class RTCCreateReceiveTransportAction extends BaseAction {
    public static identifier = 'rtccreatereceivetransport'
    public body: { data: RTCCreateReceiveTransportData }

    constructor (sender: WebSocket, body: { data: RTCCreateReceiveTransportData }) {
        super(sender, body)
        this.body = body

        if (
            typeof this.body.data.id !== 'string' ||
            typeof this.body.data.channelId !== 'string' ||
            this.body.data.iceParameters === undefined ||
            this.body.data.iceCandidates === undefined ||
            this.body.data.iceServers === undefined ||
            this.body.data.dtlsParameters === undefined
        ) {
            throw new Error('Invalid payload')
        }
    }

    public async handle (): Promise<void> {
        app.rtc.initRecieveTransport(this.body.data)
    }
}
