import { defineCommand } from '@/core/commander/defineCommand.js'
import DockerContainerRepository from '@/repositories/DockerContainerRepository.js'
import ConnectionRepository from '@/repositories/ConnectionRepository.js'
import { array } from '@/core/ui/array.js'

export default defineCommand({
    name: 'list-docker-containers',
    description: 'List Docker containers on a remote host',
    execute: async () => {
        const connectionRepository = new ConnectionRepository()

        const connections = await connectionRepository.list()

        const dokerContainerRepository = new DockerContainerRepository(connections)

        const containers = await dokerContainerRepository.list()

        array(containers)
    },
})
