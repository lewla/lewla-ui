import { ChannelListElement, MemberListElement, MessageListElement, AuthenticateFormElement } from '../components/index'
import type { ServerMember } from '../objects/servermember'
import type { Channel } from '../objects/channel'
import { actions } from '../actions/incoming/index'
import { type BaseAction } from '../actions/base'
import { PingAction } from '../actions/outgoing/ping'
import { AuthAction } from '../actions/outgoing/auth'
import { createDB } from '../db/index'
import { RTC } from './rtc'

/**
 * The application class
 */
export class Application {
    public ws?: WebSocket
    public channels: Map<string, Channel>
    public members: Map<string, ServerMember>
    public actions: Map<string, typeof BaseAction>
    public requests: Map<string, BaseAction>
    public serverName: string
    public rootElement: HTMLElement | null
    public currentMember?: ServerMember
    public websocketUrl?: string
    public rtc: RTC

    constructor () {
        this.channels = new Map()
        this.members = new Map()
        /**
         * Map of actions that can be handled by the Client
         */
        this.actions = actions
        this.requests = new Map()
        this.serverName = 'lew.la official'
        this.rootElement = document.getElementById('app')
        this.rtc = new RTC()

        createDB()
    }

    public connect (wsUrl: string): WebSocket {
        const ws = new WebSocket(wsUrl)
        this.websocketUrl = wsUrl

        ws.addEventListener('message', (event) => { this.handleMessage(event) })
        ws.addEventListener('open', (event) => { this.handleOpen(event) })
        ws.addEventListener('close', (event) => { this.handleClose(event) })
        ws.addEventListener('error', (event) => { this.handleError(event) })

        this.ws = ws
        return ws
    }

    protected handleOpen (event: Event): void {
        setInterval(() => {
            const timestamp = Date.now()
            new PingAction(this.ws, { data: { timestamp } })
                .sendAsync()
                .then(
                    (response) => {
                        const rtt = Date.now() - response.timestamp
                        console.info('Round-trip time:', rtt, 'ms')
                    })
                .catch(
                    (error) => {
                        console.error(error)
                    })
        }, 30000)

        if (window.localStorage.getItem('authtoken') !== null) {
            new AuthAction(this.ws, { data: { token: window.localStorage.getItem('authtoken') ?? '' } }).send()
        } else {
            this.showLoginUI()
        }
    }

    protected handleMessage (event: MessageEvent<any>): void {
        if (typeof event.data !== 'string') {
            throw new Error('Invalid payload')
        }
        const decoded = JSON.parse(event.data) ?? {}
        const messageAction = decoded.action
        const messageId = decoded.id ?? null
        const messageData = decoded.data ?? null

        // Pass response to async actions
        if (typeof messageId === 'string' && this.requests.has(messageId)) {
            const asyncAction = this.requests.get(messageId)
            if (typeof asyncAction?.rejector !== 'undefined' && messageAction === 'error') {
                asyncAction.rejector(messageData)
                this.requests.delete(messageId)
                return
            }
            if (typeof asyncAction?.resolver !== 'undefined') {
                asyncAction.resolver(messageData)
                this.requests.delete(messageId)
                return
            }
        }

        if (
            typeof messageAction !== 'string' ||
            messageData === null
        ) {
            throw new Error('No action provided')
        }

        const Action = this.actions.get(messageAction.toLowerCase())
        if (Action == null) {
            throw new Error('Unsupported action: ' + messageAction)
        }

        const action = new Action(this.ws, { data: messageData })
        action.handle()
    }

    protected handleClose (event: CloseEvent): void {
        console.warn(event)
    }

    protected handleError (event: Event): void {
        console.error(event)
    }

    public showLoginUI (): void {
        if (this.rootElement != null) this.rootElement.innerText = ''
        const form = new AuthenticateFormElement()
        this.rootElement?.appendChild(form)
    }

    public loadUI (): void {
        if (this.rootElement != null) this.rootElement.innerText = ''

        const headerEl = document.createElement('header')
        headerEl.setAttribute('role', 'banner')

        headerEl.innerHTML = /* HTML */`
            <h2><span role="heading" class="current-server-name">${this.serverName}</span></h2>
            <h2><span role="heading" class="current-channel-name"></span></h2>
        `

        const mainEl = document.createElement('main')
        mainEl.innerHTML = /* HTML */`
            <section class="channels left-section"></section>
            <section class="messages middle-section"></section>
            <section class="members right-section"></section>
        `

        const footerEl = document.createElement('footer')
        footerEl.setAttribute('role', 'toolbar')
        footerEl.setAttribute('aria-orientation', 'horizontal')
        footerEl.innerHTML = /* HTML */`
            <section class="left-section" id="footer-left-section">
            </section>
            <section class="middle-section">
                <div id="chat-input-container">
                    <interface-button class='round bg-none color-lightgray p-0 bg-hov-evenlighterbg'>
                        <svg slot='icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" stroke-width="1.5" viewBox="0 0 24 24" fill="none" color="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM12.75 8C12.75 7.58579 12.4142 7.25 12 7.25C11.5858 7.25 11.25 7.58579 11.25 8V11.25H8C7.58579 11.25 7.25 11.5858 7.25 12C7.25 12.4142 7.58579 12.75 8 12.75H11.25V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V12.75H16C16.4142 12.75 16.75 12.4142 16.75 12C16.75 11.5858 16.4142 11.25 16 11.25H12.75V8Z" fill="currentColor"></path></svg>
                    </interface-button>
                    <chat-input></chat-input>
                    <interface-button class='round bg-none color-lightgray p-0 bg-hov-evenlighterbg'>
                        <svg slot='icon' xmlns="http://www.w3.org/2000/svg" width="22" height="22" stroke-width="1.5" viewBox="0 0 24 24" fill="none" color="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.78415 1.35644C6.28844 1.0927 4.86213 2.09142 4.5984 3.58713L2.16732 17.3744C1.90359 18.8701 2.9023 20.2965 4.39801 20.5602L16.2157 22.644C17.7114 22.9077 19.1377 21.909 19.4015 20.4133L21.8325 6.62597C22.0963 5.13026 21.0976 3.70395 19.6018 3.44022L7.78415 1.35644ZM9.05919 5.64323C8.65127 5.5713 8.26228 5.84368 8.19035 6.2516C8.11842 6.65952 8.3908 7.04851 8.79872 7.12044L16.6772 8.50963C17.0851 8.58155 17.4741 8.30918 17.546 7.90126C17.618 7.49334 17.3456 7.10434 16.9377 7.03242L9.05919 5.64323ZM7.49577 10.1911C7.5677 9.78313 7.95669 9.51076 8.36461 9.58268L16.2431 10.9719C16.651 11.0438 16.9234 11.4328 16.8514 11.8407C16.7795 12.2486 16.3905 12.521 15.9826 12.4491L8.10414 11.0599C7.69622 10.988 7.42384 10.599 7.49577 10.1911ZM7.67003 13.5212C7.26211 13.4492 6.87312 13.7216 6.80119 14.1295C6.72926 14.5374 7.00164 14.9264 7.40956 14.9984L12.3336 15.8666C12.7415 15.9385 13.1305 15.6662 13.2024 15.2582C13.2744 14.8503 13.002 14.4613 12.5941 14.3894L7.67003 13.5212Z" fill="currentColor"></path></svg>
                    </interface-button>
                </div>
            </section>
            <section class="right-section">
                <interface-button class='round bg-none color-lightgray p-6 bg-hov-evenlighterbg'>
                    <svg slot='icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" color="currentColor"><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </interface-button>
            </section>
        `

        this.rootElement?.append(headerEl)
        this.rootElement?.append(mainEl)
        this.rootElement?.append(footerEl)

        const channelList = new ChannelListElement()
        const memberList = new MemberListElement()

        this.channels.forEach(channel => {
            if (channel.type === 'text') {
                const messageList = new MessageListElement()
                messageList.setAttribute('channel', channel.id)
                document.querySelector('section.messages')?.appendChild(messageList)
            }
        })
        channelList.loadContent(this.channels)
        memberList.loadContent(this.members)

        document.querySelector('section.channels')?.appendChild(channelList)
        document.querySelector('section.members')?.appendChild(memberList)
    }
}
