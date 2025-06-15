import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'
import { createShell } from '@/gateways/createShell.js'

export default defineCommand({
    name: 'restart',
    options: {
        query: {
            type: 'arg',
            description: 'Stack to restart',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)
        const shell = createShell(host)

        let query = options.query

        if (!query) {
            query = await input({
                message: 'Enter the stack name or filename to restart:',
            })
        }

        const item = await repository.find(query)

        if (!item) {
            console.log('Stack file not found.')
            return
        }

        await shell.command(`docker compose -f ${item.file} down --remove-orphans`, {
            onData: (data) => process.stdout.write(data),
        })

        await shell.command(`docker compose -f ${item.file} up -d`, {
            onData: (data) => process.stdout.write(data),
        })

        console.log('Stack restarted.')
    },
})
