export class Context <T> {
  internalHooksIndex = 0
  internalHooksState: unknown[] = []

  triggerReRender: Function

  constructor (onRenderCallback: Function) {
    this.triggerReRender = onRenderCallback
  }
}

let currentContext: Context<unknown> | null = null

export const getCurrentContext = <T> (): Context<T> => {
  if (currentContext === null) {
    throw new Error('Invalid call to get current context.')
  }

  return currentContext as Context<T>
}

export const setCurrentContext = <T> (context: Context<T> | null) => {
  if (context && currentContext !== null) {
    throw new Error('Cannot overwrite current context.')
  }

  currentContext = context
}
