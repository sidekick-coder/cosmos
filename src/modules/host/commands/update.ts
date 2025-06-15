import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'update',
    description: 'Update a host entry in ~/.ssh/config',
    options: {
        'name': {
            type: 'arg',
            description: 'Host alias to update',
        },
        'host': {
            type: 'flag',
            description: 'Hostname (IP or domain)',
            alias: ['h'],
        },
        'hostname': {
            type: 'flag',
            description: 'Hostname (IP or domain)',
            alias: ['h'],
        },
        'user': {
            type: 'flag',
            description: 'Username',
            alias: ['u'],
        },
        'port': {
            type: 'flag',
            description: 'Port',
            alias: ['p'],
        },
        'identity-file': {
            type: 'flag',
            description: 'Path to private key',
            alias: ['i'],
        },
    },
    execute: async ({ options }) => {
        const repository = new HostRepository()
        const data = {
            Host: options['host'],
            Hostname: options.hostname,
            User: options.user,
            Port: options.port,
            IdentityFile: options['identity-file'] ? [options['identity-file']] : undefined,
        }

        let name = options.name

        if (!name) {
            name = await input({ message: 'Host alias to update:' })
        }

        await repository.update(name, data)

        console.log('Host updated.')
    },
})
