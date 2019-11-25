import { getCurrentContext } from './context.js'

const useInternalHookState = <D> (defaults: D): [D, (updater: D) => void] => {
  const context = getCurrentContext()

  const index = context.internalHooksIndex++
  const internal: D = index in context.internalHooksState
    ? context.internalHooksState[index] as D
    : context.internalHooksState[index] = defaults

  const setInternal = (updater: D) => {
    context.internalHooksState[index] = updater
  }

  return [internal, setInternal]
}

export const useState = <T> (initial: T): [T, (updated: T) => void] => {
  const context = getCurrentContext()
  const [state, setInternalHookState] = useInternalHookState(initial)
  const setState = (updater: T) => {
    setInternalHookState(updater)
    context.triggerReRender()
  }
  return [state, setState]
}

const dependenciesChanged = (previousDependencies: unknown[] | null, currentDependencies: unknown[]): boolean => {
  if (!previousDependencies) return true

  if (previousDependencies.length !== currentDependencies.length) {
    throw new Error('Invalid call to useEffect, dependencies length changed since last render.')
  }

  for (let index = 0; index < currentDependencies.length; index++) {
    if (!Object.is(previousDependencies[index], currentDependencies[index])) {
      return true
    }
  }

  return false
}

export const useEffect = <D extends unknown[]> (effect: () => void, deps: D): void => {
  const [prevDeps, setDeps] = useInternalHookState<D | null>(null)

  if (dependenciesChanged(prevDeps, deps)) queueMicrotask(() => effect())

  setDeps(deps)
}
