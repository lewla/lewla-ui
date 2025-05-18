import { BaseElement } from '../classes/baseelement'

const templateElement = document.createElement('template')
templateElement.innerHTML = /* HTML */`
    <style>
        .panel {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 10px 6px;
            background: var(--black);
            font-weight: 500;
            color: var(--lightgray);
            text-align: center;
            overflow: hidden;
            gap: 5px;
        }
        .voice-connection-icon {
            color: var(--good);
        }
        .voice-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 6px;
        }
        .channel-name {
            font-size: 14px;
        }
        .bandwith-stats {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            justify-content: center
        }
        .bandwith-stats span {
            text-align: right;
            font-size: 12px;
            font-family: monospace;
            flex-basis: 30%;
            padding: 0px 3px;
        }
        .bandwith-stats span.right-part {
            text-align: left;
        }
        .download-icon {
            margin-left: -4px;
            margin-top: 3px;
        }
        .upload-icon {
            margin-right: -4px;
            margin-top: -3px;
        }
    </style>
    <div class="panel">
        <div class="voice-info">
            <svg class="voice-connection-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" color="currentColor"><path d="M12 6L12 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9 9L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 11L18 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 11L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 7L15 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            <span class="channel-name">Connected to <slot name="current-voice-channel">voice</slot></span>
        </div>
        <div class="bandwith-stats">
            <span class="left-part"><slot name="upload-per-second"></slot></span>
            <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke-width="1.5" viewBox="0 0 24 24" fill="none" color="currentColor"><path d="M12 21L12 3M12 3L20.5 11.5M12 3L3.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            <svg class="download-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke-width="1.5" viewBox="0 0 24 24" fill="none" color="currentColor"><path d="M12 3L12 21M12 21L20.5 12.5M12 21L3.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            <span class="right-part"><slot name="download-per-second"></slot></span>
        </div>
    </div>
`

export class VoicePanelElement extends BaseElement {
    static observedAttributes = [
        'current-voice-channel',
        'rtt',
        'upload-per-second',
        'download-per-second'
    ]

    constructor () {
        super(templateElement)
    }
}

window.customElements.define('voice-panel', VoicePanelElement)
