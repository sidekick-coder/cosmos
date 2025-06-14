import { defineCommand } from '@/core/commander/defineCommand.js'
import ConnectionRepository from '@/repositories/ConnectionRepository.js'
import { input } from '@inquirer/prompts'

export default defineCommand({
    name: 'update',
    description: 'Update a connection',
    execute: async () => {
        const repository = new ConnectionRepository()

        const id = await input({ message: 'Enter connection id:' })
        const host = await input({ message: 'Enter new host:' })

        const connection = await repository.find(id)

        if (!connection) {
            console.log('Connection not found')
            return
        }

        connection.host = host

        await repository.update(connection)

        console.log('Connection updated')
    },
})
