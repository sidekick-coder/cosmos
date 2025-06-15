import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import HostRepository from '@/repositories/HostRepository.js'
import Host from '@/entities/Host.js'
import { object } from '@/core/ui/object.js'

export default defineCommand({
    name: 'create',
    description: 'Create a new host entry in ~/.ssh/config',
    options: {
        'host': {
            type: 'flag',
            description: 'Host alias',
            alias: ['h'],
        },
        'hostname': {
            type: 'flag',
            description: 'Hostname (IP or domain)',
            alias: ['hn'],
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
            Host: options.host,
            Hostname: options.hostname,
            User: options.user,
            Port: options.port,
            IdentityFile: options['identity-file'],
        }

        if (!data.Host) {
            data.Host = await input({ message: 'Host alias:' })
        }

        if (!data.Hostname) {
            data.Hostname = await input({ message: 'Hostname:' })
        }

        if (!data.User) {
            data.User = await input({ message: 'User:' })
        }

        if (!data.Port) {
            data.Port = await input({ message: 'Port:', default: '22' })
        }

        if (!data.IdentityFile) {
            data.IdentityFile = await input({ message: 'IdentityFile:', default: '~/.ssh/id_rsa' })
        }

        const host = new Host({
            Host: data.Host,
            Hostname: data.Hostname,
            User: data.User,
            Port: data.Port,
            IdentityFile: data.IdentityFile ? [data.IdentityFile] : undefined,
        })

        await repository.create(host)

        console.log('Host created successfully:')

        object(host)
    },
})
