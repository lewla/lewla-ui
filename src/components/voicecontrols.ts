import { app } from '..'
import { BaseElement } from '../classes/baseelement'
import { StreamPreviewElement } from './streampreview'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            display: flex;
            gap: 2px;
        }
    </style>
    <interface-button class='round bg-none color-lightgray p-6 bg-hov-evenlighterbg' id="mute-mic-button">
        <svg slot='icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2m7 9v3"/></g></svg>
        <svg slot='icon-active' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="m2 2l20 20m-3.11-8.77A7 7 0 0 0 19 12v-2M5 10v2a7 7 0 0 0 12 5m-2-7.66V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M12 19v3"/></g></svg>
    </interface-button>
    <interface-button class='round bg-none color-lightgray p-6 bg-hov-evenlighterbg' id="deafen-button">
        <svg slot='icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
        <svg slot='icon-active' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 14h-1.343M9.128 3.47A9 9 0 0 1 21 12v3.343M2 2l20 20m-1.586-1.586A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364"/></svg>
    </interface-button>
    <interface-button class='round bg-none color-lightgray p-6 bg-hov-evenlighterbg' id="show-stats-button">
        <svg slot='icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" color="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 10.75C12.4142 10.75 12.75 11.0858 12.75 11.5V16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5V11.5C11.25 11.0858 11.5858 10.75 12 10.75ZM12.5675 8.00075C12.8446 7.69287 12.8196 7.21865 12.5117 6.94156C12.2038 6.66446 11.7296 6.68942 11.4525 6.99731L11.4425 7.00842C11.1654 7.3163 11.1904 7.79052 11.4983 8.06761C11.8062 8.34471 12.2804 8.31975 12.5575 8.01186L12.5675 8.00075Z" fill="currentColor"></path></svg>
    </interface-button>
    <interface-button class='round bg-none color-lightgray p-6 bg-hov-evenlighterbg' id="share-screen-button">
        <svg slot='icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3M8 21h8m-4-4v4m5-13l5-5m-5 0h5v5"/></svg>
        <svg slot='icon-active' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3M8 21h8m-4-4v4M22 3l-5 5m0-5l5 5"/></svg>
    </interface-button>
`

export class VoiceControlsElement extends BaseElement {
    static observedAttributes = [
        'voice-producer',
        'muted',
        'deafened',
        'stats-visible',
        'channel',
        'sharing-screen',
        'screen-video-producer',
        'screen-audio-producer',
    ]

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        super.attributeChangedCallback(name, oldValue, newValue)
    }

    constructor () {
        super(templateElement)

        this.setAttribute('sharing-screen', 'false')

        const muteButton = this.shadowRoot?.getElementById('mute-mic-button')
        const deafenButton = this.shadowRoot?.getElementById('deafen-button')
        const showStatsButton = this.shadowRoot?.getElementById('show-stats-button')
        const shareScreenButton = this.shadowRoot?.getElementById('share-screen-button')

        muteButton?.addEventListener('click', (event) => {
            const producerId = this.getAttribute('voice-producer')
            if (typeof producerId === 'string' && app.rtc.producers.has(producerId)) {
                const producer = app.rtc.producers.get(producerId)

                if (producer === undefined) {
                    return
                }

                if (this.getAttribute('muted') === 'false') {
                    this.setAttribute('muted', 'true')
                    muteButton.classList.add('color-warn')
                    muteButton.setAttribute('active-icon', 'true')
                    producer.pause()
                } else {
                    this.setAttribute('muted', 'false')
                    muteButton.classList.remove('color-warn')
                    muteButton.removeAttribute('active-icon')
                    producer.resume()
                }
            }
        })

        deafenButton?.addEventListener('click', (event) => {
            this.setAttribute('deafened', this.getAttribute('deafened') === 'false' ? 'true' : 'false')

            if (this.getAttribute('deafened') === 'true') {
                deafenButton.classList.add('color-warn')
                deafenButton.setAttribute('active-icon', 'true')
            } else {
                deafenButton.classList.remove('color-warn')
                deafenButton.removeAttribute('active-icon')
            }

            for (const consumer of app.rtc.consumers.values()) {
                if (this.getAttribute('deafened') === 'true') {
                    consumer.pause()
                } else {
                    consumer.resume()
                }
            }
        })

        showStatsButton?.addEventListener('click', (event) => {
            if (this.getAttribute('stats-visible') === 'false') {
                this.setAttribute('stats-visible', 'true')
                app.rootElement?.querySelector('voice-panel')?.removeAttribute('hidden')
            } else {
                this.setAttribute('stats-visible', 'false')
                app.rootElement?.querySelector('voice-panel')?.setAttribute('hidden', 'true')
            }
        })

        shareScreenButton?.addEventListener('click', (event) => {
            if (this.getAttribute('sharing-screen') === 'true') {
                app.rtc.stopScreenShare()
                return
            }

            app.rootElement?.addEventListener('localstreamended', () => {
                this.setAttribute('sharing-screen', 'false')
                shareScreenButton.classList.remove('color-good')
                shareScreenButton.removeAttribute('active-icon')
            })

            app.rtc.shareScreen()
                .then(async (producer) => {
                    if (app.rtc.localScreenShare.stream !== undefined) {
                        this.setAttribute('sharing-screen', 'true')
                        shareScreenButton.classList.add('color-good')
                        shareScreenButton.setAttribute('active-icon', 'true')

                        const el = new StreamPreviewElement(app.rtc.localScreenShare.stream)
                        app.rootElement?.appendChild(el)
                        await el.video.play()

                        producer.observer.on('close', () => {
                            el.video.pause()
                            el.remove()
                        })
                    }
                })
                .catch((reason) => {
                    console.error(reason)
                })
        })
    }
}

window.customElements.define('voice-controls', VoiceControlsElement)
