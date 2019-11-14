import * as compare from './compare.js'
import { getCurrentContext } from './context.js'

const useInternal = <D> (defaults: D): [D, (updater: D) => void] => {
  const context = getCurrentContext()

  const index = context.hooksIndex++
  const internal: D = index in context.hooks
    ? context.hooks[index] as D
    : context.hooks[index] = defaults

  const setInternal = (updater: D) => {
    context.hooks[index] = updater
  }
  return [internal, setInternal]
}

export const useState = <T> (initial: T): [T, (updated: T) => void] => {
  const context = getCurrentContext()
  const [state, setInternal] = useInternal(initial)
  const setState = (updater: T) => {
    setInternal(updater)
    context.emit('request-re-render', undefined)
  }
  return [state, setState]
}

export const useEffect = <D extends unknown[]> (effect: () => void, deps: D): void => {
  const [prevDeps, setDeps] = useInternal<D | null>(null)
  if (!prevDeps || compare.array(deps, prevDeps)) process.nextTick(() => effect())
  setDeps(deps)
}

export const useReactions = (): [string | undefined, (reactions: string[]) => void] => {
  const context = getCurrentContext()
  const setReactions = (reactions: string[]) => {
    context.reactions.reactions = reactions
  }
  return [context.reactions.reaction, setReactions]
}
