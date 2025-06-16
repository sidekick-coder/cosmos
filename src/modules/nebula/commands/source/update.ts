import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import SourceRepository from '@/modules/nebula/repositories/SourceRepository.js'

export default defineCommand({
    name: 'update',
    description: 'Update a source',
    options: {
        host: {
            type: 'arg',
            description: 'Host address to update',
        },
        description: {
            type: 'flag',
            description: 'Description of the source',
        },
    },
    async execute(ctx) {
        let host = ctx.options.host

        const payload = {
            description: ctx.options.description,
        }

        if (!host) {
            host = await input({ message: 'Enter host address to update:' })
        }

        const repository = new SourceRepository()

        await repository.update(host, payload)

        console.log('Source updated:', host)
    },
})
