import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import HostRepository from '@/repositories/HostRepository.js'
import SourceRepository from '../../repositories/SourceRepository.js'
import type Container from '../../entities/Container.js'
import ContainerRepository from '../../repositories/ContainerRepository.js'
import { tryCatch } from '@/utils/tryCatch.js'
import Host from '@/entities/Host.js'

export default defineCommand({
    name: 'list',
    description: 'List containers from sources',
    execute: async () => {
        const sourceRepository = new SourceRepository()
        const hostRepository = new HostRepository()
        const sources = await sourceRepository.list()

        const containers = [] as Container[]

        for await (const source of sources) {
            let host = await hostRepository.find(source.host)

            if (!host) {
                host = new Host({
                    Host: source.host,
                    Hostname: source.host,
                })
            }

            const containerRepository = new ContainerRepository(host)

            const [error, sourceContainers] = await tryCatch(() => containerRepository.list())

            if (error) {
                console.error(`Error listing containers for source ${source.host}:`, error)
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
