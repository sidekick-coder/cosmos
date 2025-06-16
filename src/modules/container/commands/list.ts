import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import HostRepository from '@/repositories/HostRepository.js'
import type Container from '../entities/Container.js'
import ContainerRepository from '../repositories/ContainerRepository.js'
import { tryCatch } from '@/utils/tryCatch.js'

export default defineCommand({
    name: 'list',
    description: 'List containers from sources',
    execute: async () => {
        const hostRepository = new HostRepository()
        const hosts = await hostRepository.list()

        const containers = [] as Container[]

        for await (const host of hosts) {
            if (!host.metadata?.docker) {
                continue
            }

            const containerRepository = new ContainerRepository(host)

            const [error, sourceContainers] = await tryCatch(() => containerRepository.list())

            if (error) {
                console.error(`Error listing containers for source ${host.Host}:`, error)
                continue
            }

            containers.push(...sourceContainers)
        }

        if (containers.length === 0) {
            console.log('No containers found.')
            return
        }

        array(containers)
    },
})
