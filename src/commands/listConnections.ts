import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import ConnectionRepository from '@/repositories/ConnectionRepository.js'

export default defineCommand({
    name: 'list-connections',
    description: 'List all connections',
    execute: async () => {
        const repository = new ConnectionRepository()

        const connections = await repository.list()

        if (connections.length === 0) {
            console.log('No connections found')
            return
        }

        array(connections)
    },
})
