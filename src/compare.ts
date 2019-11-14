import { Message } from './message.js'

export const array = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) return true

  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) return true
  }

  return false
}

export const embed = <T extends Message> (a: T, b: T): boolean => {
  if (a.description !== b.description) return true
  return false
}