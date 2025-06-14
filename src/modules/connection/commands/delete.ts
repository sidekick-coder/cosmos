import { defineCommand } from '@/core/commander/defineCommand.js'
import ConnectionRepository from '@/repositories/ConnectionRepository.js'
import { input } from '@inquirer/prompts'

export default defineCommand({
    name: 'delete',
    description: 'Delete a connection',
    options: {
        id: {
            type: 'arg',
            description: 'The ID of the connection to delete',
        },
    },
    execute: async ({ options }) => {
        const repository = new ConnectionRepository()

        let id = options.id

        if (!id) {
            id = await input({ message: 'Enter connection id:' })
        }

        const connection = await repository.find(id)

        if (!connection) {
            console.log('Connection not found')
            return
        }

        await repository.destroy(id)

        console.log('Connection deleted')
    },
})
