import { Message } from './message.js'

export const embed = <T extends Message> (a: T, b: T): boolean => {
  if (a.description !== b.description) return true
  return false
}