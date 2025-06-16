import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import HostRepository from '@/repositories/HostRepository.js'
import { createShell } from '@/gateways/createShell.js'

export default defineCommand({
    name: 'remove',
    description: 'Remove a container with specified options',
    options: {
        hostname: {
            type: 'flag',
            alias: ['h'],
            description: 'The hostname to use',
        },
    },
    async execute({ options }) {
        let hostname = options.hostname

        const hostRepository = new HostRepository()

        if (!hostname) {
            hostname = await input({
                message: 'Enter hostname for the container:',
            })
        }

        if (!hostname) {
            console.error('Hostname is required to create a container.')
            return
        }

        const host = await hostRepository.find(hostname)

        if (!host.metadata.docker) {
            console.error(`Host "${hostname}" does not have Docker installed or registered.`)
            return
        }

        const shell = createShell(host)

        const args = options._unknown.slice()

        args.unshift('docker', 'remove')

        const command = args.join(' ')

        await shell.command(command, {
            pty: true,
        })
    },
})
