import { defineCommand } from '@/core/commander/index.js'
import EntryRepository from '../repositories/EntryRepository.js'
import Entry from '../entities/Entry.js'
import qs from 'qs'
import HostRepository from 'dist/repositories/HostRepository.js'

export default defineCommand({
    name: 'create',
    description: 'Create a new register entry for a host',
    options: {
        host: {
            type: 'arg',
            description: 'The host to register',
        },
        data: {
            type: 'flag',
            description: 'Data for the entry in query string format (e.g., "key=value")',
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
        if (!options.host || !options.data) {
            console.error('host and data are required.')
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

        const entry = new Entry(options.data)

        await entryRepository.create(entry)

        console.log(`Entry created for host ${host.Host}:`, entry)
    },
})
