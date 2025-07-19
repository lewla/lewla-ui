import { BaseElement } from '../classes/baseelement'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        :host {
            flex-grow: 1;
            max-width: 800px;
            max-height: 440px;
            min-width: 150px;
            height: 100%;
        }
        .member {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            row-gap: 12px;
            justify-content: center;
            user-select: none;
            position: relative;
            background: var(--black);
            border-radius: 10px;
            flex-direction: column;
            box-shadow: inset 0px 0px 14px 4px #000000b0;
            height: 100%;
            overflow: hidden;
        }
        .stream-container video {
            max-width: 100%;
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
