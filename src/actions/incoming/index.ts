import { type BaseAction } from './../base'
import { TokenAction } from './token'
import { ErrorAction } from './error'
import { SuccessAction } from './success'
import { AuthenticatedAction } from './authenticated'
import { SetupAction } from './setup'
import { PongAction } from './pong'
import { MessageAction } from './message'
import { VoiceConnectAction } from './voiceconnect'
import { VoiceDisconnectAction } from './voicedisconnect'
import { RTPCapabilitiesAction } from './rtpcapabilities'
import { RTCCreateSendTransportAction } from './rtccreatesendtransport'
import { RTCCreateReceiveTransportAction } from './rtccreatereceivetransport'
import { RTCConsumeProducerAction } from './rtcconsumeproducer'
import { RTCNewProducerAction } from './rtcnewproducer'
import { UnauthAction } from './unauth'
import { RTCProducerClosedAction } from './rtcproducerclosed'
import { MemberStatusChangeAction } from './memberstatuschange'

export const actions = new Map<string, typeof BaseAction>([
    [TokenAction.identifier, TokenAction],
    [ErrorAction.identifier, ErrorAction],
    [SuccessAction.identifier, SuccessAction],
    [AuthenticatedAction.identifier, AuthenticatedAction],
    [SetupAction.identifier, SetupAction],
    [PongAction.identifier, PongAction],
    [MessageAction.identifier, MessageAction],
    [VoiceConnectAction.identifier, VoiceConnectAction],
    [VoiceDisconnectAction.identifier, VoiceDisconnectAction],
    [RTPCapabilitiesAction.identifier, RTPCapabilitiesAction],
    [RTCCreateSendTransportAction.identifier, RTCCreateSendTransportAction],
    [RTCCreateReceiveTransportAction.identifier, RTCCreateReceiveTransportAction],
    [RTCConsumeProducerAction.identifier, RTCConsumeProducerAction],
    [RTCNewProducerAction.identifier, RTCNewProducerAction],
    [UnauthAction.identifier, UnauthAction],
    [RTCProducerClosedAction.identifier, RTCProducerClosedAction],
    [MemberStatusChangeAction.identifier, MemberStatusChangeAction],
])
