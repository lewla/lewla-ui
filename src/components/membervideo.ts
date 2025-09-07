import { BaseElement } from '../classes/baseelement'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            flex-grow: 1;
            min-width: 150px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
            box-sizing: border-box;
        }
        .member {
            box-sizing: border-box;
            display: flex;
            row-gap: 12px;
            user-select: none;
            position: relative;
            background: var(--black);
            border-radius: 10px;
            box-shadow: inset 0px 0px 14px 4px #000000b0;
            height: 100%;
            overflow: hidden;
            width: fit-content;
        }
        .stream-container {
            max-height: 100%;
        }
        .stream-container video {
            max-height: 100%;
        }
    </style>
    <div class='member'>
        <div class="stream-container"></div>
    </div>
`

export class MemberVideoElement extends BaseElement {
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

window.customElements.define('member-video', MemberVideoElement)
