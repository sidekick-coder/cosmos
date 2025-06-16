import { defineCommand } from '@/core/commander/defineCommand.js'
import { array } from '@/core/ui/array.js'
import SourceRepository from '@/modules/nebula/repositories/SourceRepository.js'

export default defineCommand({
    name: 'list',
    description: 'List sources',
    execute: async () => {
        const repository = new SourceRepository()

        const sources = await repository.list()

        if (sources.length === 0) {
            console.log('No sources found.')
            return
        }

        array(sources)
    },
})
