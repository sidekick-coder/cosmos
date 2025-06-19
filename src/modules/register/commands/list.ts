import { defineCommand } from '@/core/commander/index.js'
import EntryRepository from '../repositories/EntryRepository.js'
import type Entry from '../entities/Entry.js'
import HostRepository from 'dist/repositories/HostRepository.js'
import { array } from '@/core/ui/array.js'
import { tryCatch } from '@/utils/tryCatch.js'

export default defineCommand({
    name: 'list',
    description: 'List all register entries from hosts',
    options: {
        host: {
            type: 'arg',
            description: 'The host to register',
        },
    },
    async execute({ options }) {
        const hostRepository = new HostRepository()

        const hosts = await hostRepository.list()

        const entries = [] as Entry[]

        for await (const host of hosts) {
            if (options.host && host.Host !== options.host) {
                continue
            }

            if (!host.metadata.register) {
                continue
            }

            const entryRepository = new EntryRepository(host)

            const [error, resut] = await tryCatch(() => entryRepository.list())

            if (error) {
                console.error(`Error listing entries for host ${host.Host}:`, error)
                continue
            }

            entries.push(...resut)
        }

        array(entries)
    },
})
