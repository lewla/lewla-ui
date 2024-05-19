import { type BaseAction } from './base.js'
import { TokenAction } from './token.js'
import { ErrorAction } from './error.js'
import { SuccessAction } from './success.js'
import { AuthenticatedAction } from './authenticated.js'
import { SetupAction } from './setup.js'
import { PongAction } from './pong.js'

export const actions = new Map<string, typeof BaseAction>([
    [TokenAction.identifier, TokenAction],
    [ErrorAction.identifier, ErrorAction],
    [SuccessAction.identifier, SuccessAction],
    [AuthenticatedAction.identifier, AuthenticatedAction],
    [SetupAction.identifier, SetupAction],
    [PongAction.identifier, PongAction],
])
