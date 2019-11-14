import Discord from 'discord.js'

import { ResponseContext, requestMap, responseMap } from './response-context.js'
import { useState, useEffect, useReactions } from './hooks.js'
import { Message } from './message.js'

const client = new Discord.Client()

client.on('message', (message) => {
  if (message.author?.bot) return
  
  const response = new ResponseContext((message) => {
    const [description, setDescription] = useState(message)
    const [reactions] = useReactions()

    useEffect(() => {
      if (reactions) setDescription(reactions)
    }, [reactions])

    useEffect(() => {
      setDescription(message)
    }, [message])

    return new Message().setDescription(description)
  })

  requestMap.set(message.id, response)

  response.on('rendered', (embed) => {
    console.log('rendered')
    if (message.channel) {
      embed.put(message.channel)
        .then(() => { responseMap.set(embed.id as string, response) })
    }
  })
  response.render(message.content as string)
})

client.on('messageUpdate', (_, message) => {
  const response = requestMap.get(message.id)
  if (response) response.render(message.content as string)
})

client.on('messageReactionAdd', (reaction) => {
  const response = responseMap.get(reaction.message.id)
  if (response) response.context.emit('reaction-added', reaction.emoji.name)
})

client.on('ready', () => {
  console.log('ready')
})

client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log('logged in'))
  .catch(console.error)
