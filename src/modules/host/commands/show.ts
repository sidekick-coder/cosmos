import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import { object } from '@/core/ui/object.js'
import Host from '@/entities/Host.js'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'show',
    description: 'Show details of hosts in ~/ssh/config',
    options: {
        host: {
            type: 'arg',
            description: 'The host to show details for',
        },
    },
    execute: async ({ options }) => {
        const repository = new HostRepository()

        const host = await repository.find(options.host)

        object(host)
    },
})
