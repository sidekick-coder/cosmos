import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import SourceRepository from '@/modules/nebula/repositories/SourceRepository.js'

export default defineCommand({
    name: 'create',
    description: 'Add a new source',
    options: {
        host: {
            type: 'arg',
            description: 'Host address',
        },
    },
    async execute(ctx) {
        let host = ctx.options.host

        if (!host) {
            host = await input({ message: 'Enter host address:' })
        }

        const repository = new SourceRepository()
        await repository.create({ host })
        console.log('Source added:', host)
    },
})
