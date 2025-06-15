import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'remove',
    description: 'Remove a host entry from ~/.ssh/config',
    options: {
        name: {
            type: 'arg',
            description: 'Host alias to remove',
        },
    },
    execute: async ({ options }) => {
        const repository = new HostRepository()

        let name = options.name

        if (!name) {
            name = await input({ message: 'Host alias to remove:' })
        }

        await repository.remove(name)

        console.log('Host removed.')
    },
})
