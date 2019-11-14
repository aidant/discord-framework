import Discord from 'discord.js'

import * as compare from './compare.js'
import { EventEmitter } from './event-emitter.js'
import { Message } from './message.js'
import { Context, setCurrentContext } from './context.js'

type Command = (message: string) => Message

class Response {
  public embed?: Discord.MessageEmbed
  public id?: string
  private response?: Discord.Message
  private promise?: Promise<void>

  set (message: Discord.MessageEmbed) {
    this.embed = message
  }

  async put (channel: Discord.MessageTarget) {
    if (this.promise) {
      await this.promise.then(() => { this.response?.edit(this.embed) })
    } else if (this.response) {
      await this.response.edit(this.embed)
    } else {
      this.promise = channel.send(this.embed)
        .then((response) => {
          this.response = response
          this.id = response.id
        })
        .then(() => { this.promise = undefined })
      
      await this.promise
    }
  }
}

export class ResponseContext extends EventEmitter<{
  rendered: Response
}> {
  private function: Command
  private message?: string
  private response: Response = new Response()
  public context: Context = new Context()

  constructor (func: Command) {
    super()
    this.function = func
    this.context.on('request-re-render', () => process.nextTick(() => this.render(this.message as string)))
  }

  render (msg: string) {
    this.message = msg
    this.context.hooksIndex = 0
    setCurrentContext(this.context)
    const message = this.function(msg)
    setCurrentContext(null)
    if (!this.response.embed || compare.embed(this.response.embed, message)) {
      this.response.set(message)
      this.emit('rendered', this.response)
    } else {
      this.response.set(message)
    }
  }
}

export const requestMap = new Map<string, ResponseContext>()
export const responseMap = new Map<string, ResponseContext>()
