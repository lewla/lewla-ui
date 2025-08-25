import { app } from '../index'
import { Device, type types } from 'mediasoup-client'
import type { Payload as RTCCreateReceiveTransportData } from '../actions/incoming/rtccreatereceivetransport'
import type { Payload as RTCNewProducerData } from '../actions/incoming/rtcnewproducer'
import type { Payload as RTPCapabilitiesData } from '../actions/incoming/rtpcapabilities'
import type { Payload as RTCConsumeProducerData } from '../actions/incoming/rtcconsumeproducer'
import type { Channel } from '../objects/channel'
import { RTCTransportConnectAction } from '../actions/outgoing/rtctransportconnect'
import { RTCTransportProduceAction } from '../actions/outgoing/rtctransportproduce'
import { VoiceControlsElement } from '../components'
import { RTCGetProducersAction } from '../actions/outgoing/rtcgetproducers'
import { RTCCreateSendTransportAction } from '../actions/outgoing/rtccreatesendtransport'
import { RTCCreateReceiveTransportAction } from '../actions/outgoing/rtccreatereceivetransport'
import { RTCTransportConsumeAction } from '../actions/outgoing/rtctransportconsume'
import { RTCProducerCloseAction } from '../actions/outgoing/rtcproducerclose'

export class RTC {
    public device?: Device
    public sendTransport?: types.Transport
    public recvTransport?: types.Transport
    public consumers: Map<string, types.Consumer>
    public producers: Map<string, types.Producer>
    public currentChannel: Channel | null
    public localScreenShare: {
        stream?: MediaStream
        video?: {
            track: MediaStreamTrack
            producer: types.Producer
        }
        audio?: {
            track: MediaStreamTrack
            producer: types.Producer
        }
    }

    constructor () {
        this.consumers = new Map()
        this.producers = new Map()
        this.currentChannel = null
        this.localScreenShare = {}
    }

    async initDevice (data: RTPCapabilitiesData): Promise<void> {
        if (this.device === undefined) {
            this.device = new Device()

            await this.device?.load({ routerRtpCapabilities: data.rtpCapabilities }).catch((reason) => { console.error(reason) })
        }

        if (this.device?.canProduce('audio') || this.device?.canProduce('video')) {
            const createSendTransport = new RTCCreateSendTransportAction(app.ws, { data: { sctpCapabilities: this.device?.sctpCapabilities, channelId: data.channelId } })
            createSendTransport.send()
            const createRecvTransport = new RTCCreateReceiveTransportAction(app.ws, { data: { sctpCapabilities: this.device?.sctpCapabilities, channelId: data.channelId } })
            createRecvTransport.send()
        } else {
            console.error('Cannot produce audio')
        }
    }

    initSendTransport (transportData: RTCCreateReceiveTransportData): void {
        const sendTransport = this.device?.createSendTransport({
            id: transportData.id,
            iceParameters: transportData.iceParameters,
            iceCandidates: transportData.iceCandidates,
            dtlsParameters: transportData.dtlsParameters,
            sctpParameters: transportData.sctpParameters,
            iceServers: transportData.iceServers
        })

        if (sendTransport === undefined || this.device === undefined) {
            return
        }

        sendTransport.on('connectionstatechange', (state) => { console.info('sendTransport', state) })
        this.sendTransport = sendTransport

        sendTransport.on(
            'connect',
            (data, callback, errback) => {
                try {
                    this.currentChannel = app.channels.get(transportData.channelId) ?? null
                    const connectAction = new RTCTransportConnectAction(app.ws, { data: { transportId: sendTransport.id, dtlsParameters: data.dtlsParameters, channelId: transportData.channelId } })

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
                const produceAction = new RTCTransportProduceAction(app.ws, { data: { transportId: sendTransport.id, kind: data.kind, rtpParameters: data.rtpParameters, appData: data.appData, channelId: transportData.channelId } })
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

        sendTransport.observer.on('close', () => { this.currentChannel = null })
    }

    initRecieveTransport (transportData: RTCCreateReceiveTransportData): void {
        const recvTransport = this.device?.createRecvTransport({
            id: transportData.id,
            iceParameters: transportData.iceParameters,
            iceCandidates: transportData.iceCandidates,
            dtlsParameters: transportData.dtlsParameters,
            sctpParameters: transportData.sctpParameters,
            iceServers: transportData.iceServers
        })

        if (recvTransport === undefined) {
            return
        }

        recvTransport.on('connectionstatechange', (state) => { console.info('recvTransport', state) })

        this.recvTransport = recvTransport

        const getProducers = new RTCGetProducersAction(app.ws, { data: { channelId: transportData.channelId } })
        getProducers.send()

        recvTransport.on(
            'connect',
            (data, callback, errback) => {
                try {
                    const connectAction = new RTCTransportConnectAction(app.ws, { data: { transportId: recvTransport.id, dtlsParameters: data.dtlsParameters, channelId: transportData.channelId } })

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

    async produceMicrophone (): Promise<void> {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
        const audioTrack = stream.getAudioTracks()[0]
        this.sendTransport?.produce({ track: audioTrack })
            .then((producer) => {
                this.producers.set(producer.id, producer)

                const controls = new VoiceControlsElement()
                controls.setAttribute('voice-producer', producer.id)
                controls.setAttribute('muted', 'false')
                controls.setAttribute('deafened', 'false')
                controls.setAttribute('stats-visible', 'true')

                if (this.currentChannel === null) {
                    return
                }

                const channel = app.channels.get(this.currentChannel.id)
                controls.setAttribute('channel', this.currentChannel.id)

                const container = app.rootElement?.querySelector('#footer-left-section')
                if (container != null) {
                    container.innerHTML = ''
                    container.appendChild(controls)
                }

                producer.observer.on('close', () => {
                    this.producers.delete(producer.id)
                })

                const audioContext = new AudioContext()
                const analyser = audioContext.createAnalyser()
                const source = audioContext.createMediaStreamSource(stream)
                source.connect(analyser)

                setInterval(() => {
                    const data = new Float32Array(analyser.fftSize)
                    analyser.getFloatTimeDomainData(data)
                    let sum = 0
                    for (let i = 0; i < data.length; i++) {
                        sum += data[i] * data[i]
                    }
                    const volume = Math.sqrt(sum / data.length)

                    if (volume > 0.0005) {
                        channel?.element?.shadowRoot?.querySelector('.members voice-member[id="' + app.currentMember?.id + '"]')?.setAttribute('speaking', 'true')
                    } else {
                        channel?.element?.shadowRoot?.querySelector('.members voice-member[id="' + app.currentMember?.id + '"]')?.removeAttribute('speaking')
                    }
                }, 150)
            })
            .catch((reason) => {
                console.error(reason)
            })
    }

    handleNewProducer (data: RTCNewProducerData): void {
        if (this.device === undefined || this.recvTransport === undefined) {
            return
        }

        if (data.memberId !== app.currentMember?.id) {
            const consumeAction = new RTCTransportConsumeAction(app.ws, { data: { rtpCapabilities: this.device.rtpCapabilities, transportId: this.recvTransport.id, producerId: data.producerId, channelId: data.channelId } })
            consumeAction.send()
        }
    }

    handleProducerClosed (producerId: string): void {
        if (this.device === undefined || this.recvTransport === undefined) {
            return
        }

        for (const consumer of this.consumers.values()) {
            if (consumer.producerId === producerId) {
                consumer.close()
                this.consumers.delete(consumer.id)
            }
        }
    }

    consumerProducer (data: RTCConsumeProducerData): void {
        if (this.recvTransport === undefined) {
            return
        }

        this.recvTransport.consume({
            id: data.id,
            producerId: data.producerId,
            rtpParameters: data.rtpParameters,
            kind: data.kind,
            appData: data.appData
        }).then((consumer) => {
            consumer.resume()

            this.consumers.set(consumer.id, consumer)

            const channelId = consumer.appData?.channelId
            const memberId = consumer.appData?.memberId

            if (typeof channelId === 'string' && typeof memberId === 'string') {
                const channel = app.channels.get(channelId)
                const member = app.members.get(memberId)

                if (member === undefined) {
                    return
                }
                if (channel === undefined) {
                    return
                }

                if (consumer.kind === 'audio') {
                    const audioEls = Array.from(document.querySelector('section.channels channel-list')?.shadowRoot?.querySelectorAll('audio') ?? []).filter(el => el instanceof HTMLAudioElement && el.getAttribute('member') === member.id)
                    audioEls.forEach((audioEl) => {
                        audioEl.pause()
                        audioEl.remove()
                    })

                    const el = document.createElement('audio')
                    el.setAttribute('member', memberId)
                    el.setAttribute('channelId', channelId)
                    el.volume = 0.5
                    el.autoplay = true

                    if (app.rootElement?.querySelector('voice-controls')?.getAttribute('deafened') === 'true') {
                        consumer.pause()
                    }

                    el.srcObject = new MediaStream([consumer.track])
                    channel.element?.shadowRoot?.querySelector('.members voice-member[id="' + member.id + '"]')?.shadowRoot?.querySelector('.extra')?.appendChild(el)

                    const speechIndicator = setInterval(() => {
                        if (consumer.closed) {
                            clearInterval(speechIndicator)
                            channel.element?.shadowRoot?.querySelector('.members voice-member[id="' + member.id + '"]')?.removeAttribute('speaking')
                        }
                        consumer.rtpReceiver?.getSynchronizationSources().forEach((source) => {
                            if ((source.audioLevel ?? 0) > 0.0005) {
                                channel.element?.shadowRoot?.querySelector('.members voice-member[id="' + member.id + '"]')?.setAttribute('speaking', 'true')
                            } else {
                                channel.element?.shadowRoot?.querySelector('.members voice-member[id="' + member.id + '"]')?.removeAttribute('speaking')
                            }
                        })
                    }, 150)
                }
            }

            consumer.observer.on('close', () => { consumer.close() })
        }).catch((reason: string) => {
            console.error(reason)
        })
    }

    async getUserScreen (): Promise<MediaStream> {
        return await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
    }

    stopScreenShare (): void {
        if (this.localScreenShare.video !== undefined) {
            this.producers.delete(this.localScreenShare.video.producer.id)
            this.localScreenShare.video.producer.close()
            const closeProducer = new RTCProducerCloseAction(app.ws, { data: { producerId: this.localScreenShare.video.producer.id } })
            closeProducer.send()
        }
        if (this.localScreenShare.audio !== undefined) {
            this.producers.delete(this.localScreenShare.audio.producer.id)
            this.localScreenShare.audio.producer.close()
            const closeProducer = new RTCProducerCloseAction(app.ws, { data: { producerId: this.localScreenShare.audio.producer.id } })
            closeProducer.send()
        }

        app.rootElement?.dispatchEvent(new CustomEvent('localstreamended'))
    }

    async shareScreen (): Promise<types.Producer> {
        return await new Promise((resolve, reject) => {
            if (this.currentChannel?.type !== 'voice') {
                reject(new Error('Invalid channel'))
            }

            this.getUserScreen()
                .then((stream) => {
                    this.localScreenShare = { stream }

                    const audioTrack = stream.getAudioTracks()[0]
                    const videoTrack = stream.getVideoTracks()[0]

                    audioTrack?.addEventListener('ended', () => { this.stopScreenShare() })
                    videoTrack?.addEventListener('ended', () => { this.stopScreenShare() })

                    if (audioTrack !== undefined) {
                        this.sendTransport?.produce({ track: audioTrack })
                            .then((producer) => {
                                this.producers.set(producer.id, producer)
                                this.localScreenShare.audio = { track: audioTrack, producer }

                                resolve(producer)

                                producer.observer.on('close', () => { this.stopScreenShare() })
                                audioTrack.addEventListener('ended', (event) => { this.stopScreenShare() })
                            })
                            .catch((reason) => { console.error(reason) })
                    }

                    if (videoTrack !== undefined) {
                        this.sendTransport?.produce({ track: videoTrack })
                            .then((producer) => {
                                this.producers.set(producer.id, producer)
                                this.localScreenShare.video = { track: videoTrack, producer }

                                resolve(producer)

                                producer.observer.on('close', () => { this.stopScreenShare() })
                                videoTrack.addEventListener('ended', (event) => { this.stopScreenShare() })
                            })
                            .catch((reason) => { console.error(reason) })
                    }
                })
                .catch((reason) => {
                    console.error(reason)
                })
        })
    }

    cleanupProducer (producer: types.Producer): void {
        producer.close()
        this.producers.delete(producer.id)
    }
}
