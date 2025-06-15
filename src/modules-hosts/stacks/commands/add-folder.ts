import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'

export default defineCommand({
    name: 'add-folder',
    options: {
        folder: {
            type: 'arg',
            description: 'Path to folder',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)

        let folder = options.folder

        if (!folder) {
            folder = await input({
                message: 'Enter the path to the folder:',
            })
        }

        await repository.addFolder(folder)
    },
})
