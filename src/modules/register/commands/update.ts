import { defineCommand } from '@/core/commander/index.js'
import { EntryRepository } from '../repositories/EntryRepository.js'
import HostRepository from 'dist/repositories/HostRepository.js'
import qs from 'qs'
import { object } from '@/core/ui/object.js'

export default defineCommand({
    name: 'update',
    description: 'Update a register entry for a host',
    options: {
        host: {
            type: 'arg',
            description: 'The host to update',
        },
        id: {
            type: 'arg',
            description: 'ID of the entry to update',
            alias: ['i'],
        },
        data: {
            type: 'flag',
            description: 'Data to update in query string format (e.g., "key=value")',
            alias: ['d'],
            transform: (value) => {
                const parsed = qs.parse(value)
                if (!parsed || typeof parsed !== 'object') {
                    throw new Error('Invalid data format. Use "key=value" format.')
                }
                return parsed as Record<string, string>
            },
        },
    },
    async execute({ options }) {
        if (!options.host || !options.id || !options.data) {
            console.error('host, id, and data are required.')
            return
        }

        const hostRepository = new HostRepository()
        const host = await hostRepository.find(options.host)

        if (!host.metadata.register) {
            console.log(`Host ${host.Host} does not have register enabled.`)
            console.log(
                'Please enable register on the host first using `cosmos host set <host> register true`'
            )
            return
        }

        const entryRepository = new EntryRepository(host)

        const updated = await entryRepository.update(options.id, options.data)

        object(updated)
    },
})
