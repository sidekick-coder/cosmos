import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'list',
    description: 'List hosts on ~/ssh/config',
    execute: async () => {
        const repository = new HostRepository()

        const hosts = await repository.list()

        array(hosts, [
            {
                label: 'Host',
                value: 'Host',
                width: 30,
            },
            {
                label: 'User',
                value: 'User',
                width: 15,
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
