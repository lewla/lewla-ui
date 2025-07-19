import { BaseElement } from '../classes/baseelement'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        video {
            position: absolute;
            max-width: 400px;
            width: 90%;
            bottom: 80px;
            right: 20px;
            z-index: 10;
            border-radius: 10px;
        }
    </style>
    <div class="stream-container"></div>
`

export class StreamPreviewElement extends BaseElement {
    public video: HTMLVideoElement

    static observedAttributes = [
    ]

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null): void {
        super.attributeChangedCallback(name, oldValue, newValue)
    }

    constructor (stream: MediaStream) {
        super(templateElement)

        this.video = document.createElement('video')
        this.video.muted = true
        this.video.volume = 0
        this.video.autoplay = true
        this.video.srcObject = stream
        this.shadowRoot?.querySelector('.stream-container')?.appendChild(this.video)
    }
}

window.customElements.define('stream-preview', StreamPreviewElement)
