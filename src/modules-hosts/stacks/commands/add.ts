import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { select, input } from '@inquirer/prompts'

export default defineCommand({
    name: 'add',
    options: {
        type: {
            type: 'flag',
            description: 'Type to add: file or folder',
        },
        filepath: {
            type: 'flag',
            description: 'Path to file or folder',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)

        let type = options.type
        let filepath = options.filepath

        if (!type) {
            type = await select({
                message: 'What do you want to add?',
                choices: [
                    { name: 'File', value: 'file' },
                    { name: 'Folder', value: 'folder' },
                ],
            })
        }

        if (!filepath) {
            filepath = await input({
                message: `Enter the path to the ${type}:`,
            })
        }

        if (type === 'file') {
            await repository.addFile(filepath)
            return
        }

        if (type === 'folder') {
            await repository.addFolder(filepath)
        }
    },
})
