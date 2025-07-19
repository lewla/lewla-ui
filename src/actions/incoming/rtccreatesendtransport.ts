import { app } from '../..'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

export interface RTCCreateSendTransportData {
    id: string
    iceParameters: types.IceParameters
    iceCandidates: types.IceCandidate[]
    dtlsParameters: types.DtlsParameters
    sctpParameters: types.SctpParameters | undefined
    channelId: string
    iceServers: RTCIceServer[]
}

export class RTCCreateSendTransportAction extends BaseAction {
    public static identifier = 'rtccreatesendtransport'
    public body: { data: RTCCreateSendTransportData }

    constructor (sender: WebSocket, body: { data: RTCCreateSendTransportData }) {
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
        app.rtc.initSendTransport(this.body.data)
        app.rtc.produceMicrophone()
            .catch((reason) => {
                console.error(reason)
            })
    }
}
