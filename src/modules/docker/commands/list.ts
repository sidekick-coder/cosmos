import { defineCommand } from '@/core/commander/defineCommand.js'
import DockerContainerRepository from '@/repositories/DockerContainerRepository.js'
import ConnectionRepository from '@/repositories/ConnectionRepository.js'
import { array } from '@/core/ui/array.js'

export default defineCommand({
    name: 'list',
    description: 'List Docker containers on a remote host',
    execute: async () => {
        const connectionRepository = new ConnectionRepository()

        const connections = await connectionRepository.list()

        const dokerContainerRepository = new DockerContainerRepository(connections)

        const containers = await dokerContainerRepository.list()

        array(containers, [
            {
                label: 'Connetion',
                value: 'connection_id',
                width: 10,
            },
            {
                label: 'ID',
                value: 'id',
                width: 20,
            },
            {
                label: 'Name',
                value: 'name',
                width: 20,
            },
            {
                label: 'Image',
                value: 'image',
            },
            {
                label: 'Status',
                value: 'status',
                width: 10,
            },
        ])
    },
})
