import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'
import { createShell } from '@/core/ssh/createShell.js'

export default defineCommand({
    name: 'start',
    options: {
        query: {
            type: 'arg',
            description: 'Stack to start',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)

        let query = options.query

        if (!query) {
            query = await input({
                message: 'Enter the stack name or filename to start:',
            })
        }

        const item = await repository.find(query)

        if (!item) {
            console.log('Stack not found.')
            return
        }

        const shell = createShell(host.toShellOptions())

        await shell.command(`docker compose -f ${item.file} up -d`)
    },
})
