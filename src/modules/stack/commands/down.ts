import { defineCommand } from '@/core/commander/defineCommand.js'
import StackRepository from '../repositories/StackRepository.js'
import { confirm } from '@inquirer/prompts'
import { createShell } from '@/gateways/createShell.js'
import HostRepository from 'dist/repositories/HostRepository.js'
import EntryRepository from '@/modules/register/repositories/EntryRepository.js'

export default defineCommand({
    name: 'down',
    options: {
        hosts: {
            type: 'flag',
            alias: ['h'],
            description: 'Filter stacks by host',
            transform: (value) => value.split(',').map((h) => h.trim()),
        },
        names: {
            type: 'flag',
            description: 'Filter stacks by name',
            alias: ['n'],
            transform: (value) => value.split(',').map((n) => n.trim()),
        },
    },
    async execute({ options }) {
        if (!options.hosts?.length && !options.names?.length) {
            const value = await confirm({
                message: 'Not defined filters will start all containers. Do you want to continue?',
                default: false,
            })

            if (!value) {
                console.log('Operation cancelled.')
                return
            }
        }

        const hostRepository = new HostRepository()
        const allhosts = await hostRepository.list()

        const hosts = allhosts.filter((h) => {
            if (!h.metadata.stack) {
                return false
            }

            if (options.hosts && !options.hosts.includes(h.Host)) {
                return false
            }

            return true
        })

        for await (const host of hosts) {
            const stackRepository = new StackRepository(host, new EntryRepository(host))

            const allStacks = await stackRepository.list()

            const stacks = allStacks.filter((c) => {
                if (options.names && !options.names.includes(c.name)) {
                    return false
                }

                return true
            })

            if (!stacks.length) {
                continue
            }

            const shell = createShell(host)

            const command = `docker compose -f ${stacks.map((s) => s.file).join(' -f ')} down`

            console.log(`[${host.Host}]`, command)

            await shell.command(command, {
                onData: (data) => process.stdout.write(data),
            })
        }
    },
})
