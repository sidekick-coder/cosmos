import { defineCommand } from '@/core/commander/defineCommand.js'
import { input } from '@inquirer/prompts'
import SourceRepository from '@/modules/nebula/repositories/SourceRepository.js'

export default defineCommand({
    name: 'delete',
    description: 'Delete a source',
    options: {
        host: {
            type: 'arg',
            description: 'Host address to delete',
        },
    },
    async execute(ctx) {
        let host = ctx.options.host

        if (!host) {
            host = await input({ message: 'Enter host address to delete:' })
        }

        const repository = new SourceRepository()
        await repository.delete(host)
        console.log('Source deleted:', host)
    },
})
