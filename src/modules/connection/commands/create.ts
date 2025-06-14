import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import ConnectionRepository from '@/repositories/ConnectionRepository.js'
import Connection from '@/entities/Connection.js'
import { object } from '@/core/ui/object.js'

export default defineCommand({
    name: 'create',
    description: 'Create a new connection',
    execute: async () => {
        const id = await input({
            message: 'Enter connection id:',
        })

        const host = await input({
            message: 'Enter host:',
        })

        const repository = new ConnectionRepository()
        const exists = await repository.find(id)

        if (exists) {
            console.log(`Connection with id '${id}' already exists`)
            return
        }

        const connection = new Connection({
            id: id,
            host: host,
        })

        await repository.create(connection)

        object(connection)
    },
})
