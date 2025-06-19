import { defineCommand } from '@/core/commander/defineCommand.js'
import HostRepository from '@/repositories/HostRepository.js'
import { array } from '@/core/ui/array.js'

export default defineCommand({
    name: 'unset',
    description: 'Set metadata related to a host',
    options: {
        host: {
            type: 'arg',
            description: 'Hostname (IP or domain)',
        },
        key: {
            type: 'arg',
            description: 'Metadata key to set',
        },
    },
    execute: async ({ options }) => {
        const repository = new HostRepository()

        const host = await repository.find(options.host)

        await repository.updateMetadata(host.Host, {
            [options.key]: undefined,
        })

        delete host.metadata[options.key]

        console.log('Metadata updated successfully.')

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
