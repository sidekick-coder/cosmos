import { defineCommand } from '@/core/commander/defineCommand.js'
import HostRepository from '@/repositories/HostRepository.js'
import { array } from '@/core/ui/array.js'
import StackRepository from '../repositories/StackRepository.js'
import EntryRepository from '@/modules/register/repositories/EntryRepository.js'
import { tryCatch } from '@/utils/tryCatch.js'

export default defineCommand({
    name: 'list',
    description: 'List stacks',
    options: {
        host: {
            type: 'flag',
            description: 'Filter stacks by host',
            alias: ['h'],
        },
        format: {
            type: 'flag',
            description: 'Output format (json, table)',
            alias: ['f'],
        },
    },
    async execute({ options }) {
        const hostRepository = new HostRepository()

        const allHosts = await hostRepository.list()

        const hostsWithStacks = allHosts.filter((host) => host.metadata.stack)

        const stacks = []

        for await (const host of hostsWithStacks) {
            if (options.host && host.Host !== options.host) {
                continue
            }

            const stackRepository = new StackRepository(host, new EntryRepository(host))

            const [error, hostStacks] = await tryCatch(() => stackRepository.list())

            if (error) {
                console.error(`Error listing stacks for host ${host.Host}:`, error)
                continue
            }

            stacks.push(...hostStacks)
        }

        if (options.format === 'json') {
            console.log(JSON.stringify(stacks))
            return
        }

        array(stacks, [
            {
                label: 'Host',
                value: 'host',
                width: 15,
            },
            {
                label: 'Name',
                value: 'name',
                width: 15,
            },
            {
                label: 'File',
                value: 'file',
            },
            {
                label: 'Services',
                value: (stack) => stack.services.map((s) => s.name).join(', '),
            },
            {
                label: 'Containers',
                value: (stack) => stack.containers.map((s) => `${s.name}(${s.status})`).join(', '),
            },
        ])
    },
})
