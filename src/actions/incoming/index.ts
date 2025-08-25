import { BaseAction } from '../base'

export const actions = new Map<string, typeof BaseAction>()

const context = require.context('./', false, /\.ts$/)

context.keys().forEach((file) => {
    if (file === 'index.ts') return

    const module: Record<string, any> = context(file)

    const className = Object.keys(module).find(exportName => {
        const exported = module[exportName]
        return (
            typeof exported === 'function' &&
            exported.prototype instanceof BaseAction
        )
    })

    if (className !== undefined) {
        const actionClass: typeof BaseAction = module[className]
        actions.set(actionClass.identifier, actionClass)
    }
})
