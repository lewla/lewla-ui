import { app } from '../..'
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
            iceServers: app.iceServers
        })

        if (recvTransport === undefined) {
            return
        }

        recvTransport.on('connectionstatechange', (state) => { console.info('recvTransport', state) })

        app.recvTransport = recvTransport

        recvTransport.on(
            'connect',
            (data, callback, errback) => {
                try {
                    let prevBytes: number
                    let prevTimestamp: number

                    setInterval(() => {
                        recvTransport.getStats().then((report) => {
                            report.forEach((value, key) => {
                                if (value.type === 'transport') {
                                    if (prevBytes !== undefined && prevTimestamp !== undefined) {
                                        const bytesDiff = value.bytesReceived - prevBytes
                                        const timeDiff = value.timestamp - prevTimestamp

                                        const bytesPerSecond = (bytesDiff * 8) / (timeDiff / 1000)
                                        document.querySelector('voice-panel')?.setAttribute('download-per-second', `${(bytesPerSecond / 1000).toFixed(1)} kb/s`)
                                    }

                                    prevBytes = value.bytesReceived
                                    prevTimestamp = value.timestamp
                                }
                            })
                        }).catch((reason) => {
                            console.log(reason)
                        })
                    }, 1000)

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
