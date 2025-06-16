import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'list',
    description: 'List containers from sources',
    execute: async () => {
        const repository = new HostRepository()

        const hosts = await repository.list()

        array(hosts, [])
    },
})
