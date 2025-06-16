import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import SourceRepository from '../../repositories/SourceRepository.js'
import HostRepository from '@/repositories/HostRepository.js'
import Host from '@/entities/Host.js'
import { createShell } from '@/gateways/createShell.js'

export default defineCommand({
    name: 'run',
    description: 'Run a container with specified options',
    options: {
        hostname: {
            type: 'flag',
            alias: ['h'],
            description: 'The hostname to use',
        },
    },
    async execute({ options }) {
        let hostname = options.hostname

        const sourceRepository = new SourceRepository()
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

        const source = await sourceRepository.find(hostname)

        if (!source) {
            console.error(`Source with hostname "${hostname}" not found.`)
            return
        }

        const host = await hostRepository.find(hostname)

        const shell = createShell(host)

        const args = options._unknown.slice()

        args.unshift('docker', 'run')

        const command = args.join(' ')

        await shell.command(command, {
            pty: true,
        })
    },
})
