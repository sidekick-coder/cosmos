import { defineCommand } from '@/core/commander/defineCommand.js'
import HostRepository from '@/repositories/HostRepository.js'
import { input } from '@inquirer/prompts'
import { ComposeFileRepository } from '../repositories/ComposeFileRepository.js'
import { array } from '@/core/ui/array.js'

export default defineCommand({
    name: 'list-register',
    description: 'Register a docker-compose file to be managed',
    options: {
        host: {
            type: 'arg',
            description: 'The IP, hostname or alias',
        },
    },
    async execute({ options }) {
        let hostName = options.host

        if (!hostName) {
            hostName = await input({
                message: 'Enter the host IP, hostname or alias:',
            })
        }

        if (!hostName) {
            console.error('Host is required.')
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

        const config = await composeFileRepository.readConfig()

        array(config.files, [
            {
                label: 'Index',
                value: (i) => config.files.indexOf(i) + 1,
                width: 5,
            },
            {
                label: 'File',
                value: (i) => i,
                width: 50,
            },
        ])
    },
})
