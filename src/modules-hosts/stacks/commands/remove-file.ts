import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'

export default defineCommand({
    name: 'remove-file',
    options: {
        filepath: {
            type: 'flag',
            description: 'Path to file',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)

        let filepath = options.filepath

        if (!filepath) {
            filepath = await input({
                message: 'Enter the path to the file:',
            })
        }

        await repository.removeFile(filepath)
    },
})
