import { defineCommand } from '@/core/commander/defineCommand.js'
import HostRepository from '@/repositories/HostRepository.js'
import { input } from '@inquirer/prompts'
import { ComposeFileRepository } from '../repositories/ComposeFileRepository.js'

export default defineCommand({
    name: 'register',
    description: 'Register a docker-compose file to be managed',
    options: {
        host: {
            type: 'arg',
            description: 'The IP, hostname or alias',
        },
        entry: {
            type: 'arg',
            description: 'Filename or glob to the docker-compose file(s)',
        },
    },
    async execute({ options }) {
        let entry = options.entry
        let hostName = options.host

        if (!hostName) {
            hostName = await input({
                message: 'Enter the host IP, hostname or alias:',
            })
        }

        if (!entry) {
            entry = await input({
                message: 'Enter the path to the file:',
            })
        }

        if (!entry || !hostName) {
            console.error('Both host and entry are required.')
            return
        }

        const hostRepository = new HostRepository()

        const host = await hostRepository.find(options.host)

        if (!host.metadata.stack) {
            console.log(`Host ${host.Host} does not have stacks enabled.`)
            console.log(
                'Please enable stacks on the host first using `cosmos host set <host> stacks true`'
            )
            return
        }

        const composeFileRepository = new ComposeFileRepository(host)

        composeFileRepository.register(entry)
    },
})
