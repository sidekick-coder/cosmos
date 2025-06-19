import { defineCommand } from '@/core/commander/defineCommand.js'
import HostRepository from '@/repositories/HostRepository.js'
import { array } from '@/core/ui/array.js'

export default defineCommand({
    name: 'set',
    description: 'Set metadata related to a host',
    options: {
        host: {
            type: 'arg',
            description: 'Hostname (IP or domain)',
            alias: ['h'],
        },
        key: {
            type: 'arg',
            description: 'Metadata key to set',
        },
        value: {
            type: 'arg',
            description: 'Value to set for the key',
            transform: (payload: string) => {
                if (!payload.includes(':')) {
                    return payload
                }

                const [type, ...rest] = payload.split(':')

                const value = rest.join(':')

                if (type === 'bool') {
                    return value === 'true' || value === '1'
                }

                if (type === 'number') {
                    const number = parseFloat(value)

                    if (isNaN(number)) {
                        throw new Error(`Invalid number: ${value}`)
                    }

                    return number
                }

                return value
            },
        },
    },
    execute: async ({ options }) => {
        const repository = new HostRepository()

        const host = await repository.find(options.host)

        await repository.updateMetadata(host.Host, {
            [options.key]: options.value,
        })

        host.metadata[options.key] = options.value

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
