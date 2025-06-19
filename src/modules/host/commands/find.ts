import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import { object } from '@/core/ui/object.js'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'find',
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

        console.log(`Details`)

        object(host, {
            excludeKeys: ['metadata'],
        })

        console.log(`Metadata`)

        array(Object.entries(host.metadata), [
            {
                label: 'Key',
                value: '0',
                width: 20,
            },
            {
                label: 'Value',
                value: '1',
                width: 30,
            },
        ])
    },
})
