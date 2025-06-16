import { defineCommand } from '@/core/commander/defineCommand.js'
import { confirm } from '@inquirer/prompts'
import HostRepository from '@/repositories/HostRepository.js'
import { createShell } from '@/gateways/createShell.js'
import ContainerRepository from '../repositories/ContainerRepository.js'

export default defineCommand({
    name: 'restart',
    description: 'Restart a container with specified options',
    options: {
        hosts: {
            type: 'flag',
            alias: ['h'],
            description: 'List of hostnames to use',
            transform: (value) => value.split(',').map((v) => v.trim()),
        },
        names: {
            type: 'flag',
            alias: ['n'],
            description: 'List of container names to restart',
            transform: (value) => value.split(',').map((v) => v.trim()),
        },
    },
    async execute({ options }) {
        const hostRepository = new HostRepository()

        if (!options.hosts?.length && !options.names?.length) {
            const value = await confirm({
                message:
                    'Not defined filters will restart all containers. Do you want to continue?',
                default: false,
            })

            if (!value) {
                console.log('Operation cancelled.')
                return
            }
        }

        const allhosts = await hostRepository.list()

        const hosts = allhosts.filter((h) => {
            if (!h.metadata.docker) {
                return false
            }

            if (options.hosts && !options.hosts.includes(h.Host)) {
                return false
            }

            return true
        })

        for await (const host of hosts) {
            const containerRepository = new ContainerRepository(host)

            const allContainers = await containerRepository.list()

            const containers = allContainers.filter((c) => {
                if (options.names && !options.names.includes(c.name)) {
                    return false
                }
                return true
            })

            if (!containers.length) {
                continue
            }

            const shell = createShell(host)

            const command = `docker restart ${containers.map((c) => c.name).join(' ')}`

            console.log(`[${host.Host}]`, command)

            await shell.command(command, {
                onData: (data) => {
                    if (!data.toString().trim()) {
                        return
                    }
                    console.log(`|--`, data.toString().trim())
                },
            })
        }
    },
})
