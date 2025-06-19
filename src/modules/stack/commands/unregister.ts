import { defineCommand } from '@/core/commander/defineCommand.js'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'unregister',
    description: 'Tell cosmos to not check for stacks on the host',
    options: {
        host: {
            type: 'arg',
            description: 'The IP, hostname or alias',
        },
    },
    execute: async ({ options }) => {
        const hostRepository = new HostRepository()
        const host = await hostRepository.find(options.host)

        await hostRepository.updateMetadata(host.Host, {
            stacks: false,
        })

        console.log(`Uregistered: ${host.Host}`)
    },
})
