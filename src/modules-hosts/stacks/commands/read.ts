import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { StackRepository } from '../repositories/StackRepository.js'
import { input } from '@inquirer/prompts'

export default defineCommand({
    name: 'read',
    options: {
        query: {
            type: 'flag',
            description: 'Name or filename to read',
        },
    },
    async execute({ options }) {
        const host = inject<Host>('host')
        const repository = new StackRepository(host)

        let query = options.query

        if (!query) {
            query = await input({
                message: 'Enter the name or filename to read:',
            })
        }

        const content = await repository.read(query)

        if (!content) {
            console.log('No content found.')
            return
        }

        console.log(content)
    },
})
