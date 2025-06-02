import { app } from '../..'
import { RTCGetProducersAction } from '../outgoing/rtcgetproducers'
import { RTCTransportConnectAction } from '../outgoing/rtctransportconnect'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

interface RTCCreateReceiveTransportData {
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
        const recvTransport = app.device?.createRecvTransport({
            id: this.body.data.id,
            iceParameters: this.body.data.iceParameters,
            iceCandidates: this.body.data.iceCandidates,
            dtlsParameters: this.body.data.dtlsParameters,
            sctpParameters: this.body.data.sctpParameters,
            iceServers: this.body.data.iceServers
        })

        if (recvTransport === undefined) {
            return
        }

        recvTransport.on('connectionstatechange', (state) => { console.info('recvTransport', state) })

        app.recvTransport = recvTransport

        const getProducers = new RTCGetProducersAction(app.ws, { data: { channelId: this.body.data.channelId } })
        getProducers.send()

        recvTransport.on(
            'connect',
            (data, callback, errback) => {
                try {
                    const connectAction = new RTCTransportConnectAction(app.ws, { data: { transportId: recvTransport.id, dtlsParameters: data.dtlsParameters, channelId: this.body.data.channelId } })

                    connectAction.sendAsync()
                        .then((response) => {
                            callback()
                        })
                        .catch((error) => {
                            error instanceof Error ? errback(error) : errback(Error('Unknown error'))
                        })
                } catch (error) {
                    error instanceof Error ? errback(error) : errback(Error('Unknown error'))
                }
            }
        )
    }
}
