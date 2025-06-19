import { defineCommand } from '@/core/commander/index.js'
import EntryRepository from '../repositories/EntryRepository.js'
import HostRepository from 'dist/repositories/HostRepository.js'
import { object } from '@/core/ui/object.js'

export default defineCommand({
    name: 'find',
    description: 'Find a register entry by id for a host',
    options: {
        host: {
            type: 'arg',
            description: 'The host to search',
        },
        id: {
            type: 'arg',
            description: 'ID of the entry to find',
        },
    },
    async execute({ options }) {
        if (!options.host || !options.id) {
            console.error('host and id are required.')
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

        const entry = await entryRepository.find(options.id)

        if (!entry) {
            console.log(`Entry with id ${options.id} not found for host ${options.host}`)
            return
        }

        object(entry)
    },
})
