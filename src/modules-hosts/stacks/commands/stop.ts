import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'
import { createShell } from '@/gateways/createShell.js'

export default defineCommand({
    name: 'stop',
    options: {
        query: {
            type: 'arg',
            description: 'Stack query to stop',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)
        const shell = createShell(host)

        let query = options.query

        if (!query) {
            query = await input({
                message: 'Enter the stack to stop:',
            })
        }

        const item = await repository.find(query)

        if (!item) {
            console.log('Stack not found.')
            return
        }

        await shell.command(`docker compose -f ${item.file} down`, {
            onData: (data) => process.stdout.write(data),
        })

        console.log('Stack stopped.')
    },
})
