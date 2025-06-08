import { app } from '../..'
import { VoiceControlsElement } from '../../components/voicecontrols'
import { RTCTransportConnectAction } from '../outgoing/rtctransportconnect'
import { RTCTransportProduceAction } from '../outgoing/rtctransportproduce'
import { BaseAction } from './../base'
import type { types } from 'mediasoup-client'

interface RTCCreateSendTransportData {
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
        const sendTransport = app.device?.createSendTransport({
            id: this.body.data.id,
            iceParameters: this.body.data.iceParameters,
            iceCandidates: this.body.data.iceCandidates,
            dtlsParameters: this.body.data.dtlsParameters,
            sctpParameters: this.body.data.sctpParameters,
            iceServers: this.body.data.iceServers
        })

        if (sendTransport === undefined || app.device === undefined) {
            return
        }

        sendTransport.on('connectionstatechange', (state) => { console.info('sendTransport', state) })
        app.sendTransport = sendTransport

        sendTransport.on(
            'connect',
            (data, callback, errback) => {
                try {
                    const connectAction = new RTCTransportConnectAction(app.ws, { data: { transportId: sendTransport.id, dtlsParameters: data.dtlsParameters, channelId: this.body.data.channelId } })

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

        sendTransport.on(
            'produce',
            (data, callback, errback) => {
                const produceAction = new RTCTransportProduceAction(app.ws, { data: { transportId: sendTransport.id, kind: data.kind, rtpParameters: data.rtpParameters, appData: data.appData, channelId: this.body.data.channelId } })
                produceAction.sendAsync()
                    .then((response) => {
                        callback({ id: response.producerId })
                    })
                    .catch((error) => {
                        console.error(error)
                        if (error instanceof Error) {
                            errback(error)
                        } else {
                            errback(Error('Unknown error'))
                        }
                    })
            }
        )

        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
        const audioTrack = stream.getAudioTracks()[0]
        sendTransport.produce({ track: audioTrack })
            .then((producer) => {
                app.producers.set(producer.id, producer)

                const controls = new VoiceControlsElement()
                controls.setAttribute('id', producer.id)
                controls.setAttribute('muted', 'false')
                controls.setAttribute('deafened', 'false')
                controls.setAttribute('stats-visible', 'true')

                app.rootElement?.querySelector('#footer-left-section')?.appendChild(controls)

                producer.observer.on('close', () => {
                    app.producers.delete(producer.id)
                })

                producer.on('transportclose', () => {
                    producer.close()
                })
            })
            .catch((reason) => {
                console.error(reason)
            })
    }
}
