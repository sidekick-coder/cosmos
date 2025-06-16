import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'list',
    description: 'List hosts on ~/ssh/config',
    options: {
        format: {
            type: 'flag',
            description: 'Format output, can be "json" or "table"',
            alias: ['f'],
        },
    },
    execute: async ({ options }) => {
        const repository = new HostRepository()

        const hosts = await repository.list()

        if (options.format === 'json') {
            console.log(JSON.stringify(hosts, null, 2))
            return
        }

        array(hosts, [
            {
                label: 'Host',
                value: 'Host',
                width: 20,
            },
            {
                label: 'Hostname',
                value: 'Hostname',
                width: 20,
            },
            {
                label: 'User',
                value: 'User',
                width: 10,
            },
            {
                label: 'Port',
                value: 'Port',
                width: 10,
            },
            {
                label: 'IdentityFile',
                value: 'IdentityFile',
            },
        ])
    },
})
