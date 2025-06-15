import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'
import { object } from '@/core/ui/object.js'

export default defineCommand({
    name: 'find',
    options: {
        query: {
            type: 'flag',
            alias: ['q'],
            description: 'Name or filename to search for',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)

        let query = options.query

        if (!query) {
            query = await input({
                message: 'Enter the name or filename to search for:',
            })
        }

        const result = await repository.find(query)

        if (!result) {
            console.log('No stack file found.')
            return
        }

        object(result)
    },
})
