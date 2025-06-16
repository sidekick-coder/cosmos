import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import HostRepository from '@/repositories/HostRepository.js'
import type Container from '../entities/Container.js'
import ContainerRepository from '../repositories/ContainerRepository.js'
import { tryCatch } from '@/utils/tryCatch.js'
import Host from '@/entities/Host.js'

export default defineCommand({
    name: 'register',
    description: 'Tell cosmos that hosts have containers',
    options: {
        host: {
            type: 'arg',
            description: 'The host to register containers for',
        },
    },
    execute: async ({ options }) => {
        const hostRepository = new HostRepository()
        const host = await hostRepository.find(options.host)

        await hostRepository.updateMetadata(host.Host, {
            docker: true,
        })

        console.log(`Containers registered for host: ${host.Host}`)
    },
})
