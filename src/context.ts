import { EventEmitter } from './event-emitter.js'

export class Context extends EventEmitter<{
  'request-re-render': undefined
  'reaction-added': string
  'reaction-removed': string
}> {
  public hooksIndex: number = 0
  public hooks: unknown[] = []
  public reactions: { reaction?: string, reactions?: string[] } = {}

  constructor () {
    super()

    this.on('reaction-added', (reaction: string) => {
      this.reactions.reaction = reaction
      this.emit('request-re-render', undefined)
    })

    this.on('reaction-removed', () => {
      delete this.reactions.reaction
      this.emit('request-re-render', undefined)
    })
  }
}

let currentContext: Context | null = null

export const getCurrentContext = (): Context => {
  if (currentContext === null) throw new Error()
  return currentContext
}

export const setCurrentContext = (context: Context | null) => {
  if (context && currentContext !== null) throw new Error()
  currentContext = context
}
