import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'

import type Host from '@/entities/Host.js'

import { StackRepository } from '../repositories/StackRepository.js'
import { array } from '@/core/ui/array.js'

export default defineCommand({
    name: 'list',
    execute: async () => {
        const host = inject<Host>('host')

        const repository = new StackRepository(host)

        const stacks = await repository.list()

        array(stacks, [
            {
                label: 'Name',
                value: 'name',
                width: 20,
            },
            {
                label: 'File',
                value: 'file',
            },
            {
                label: 'Alias',
                value: (stack) => stack.alias?.join(', ') || 'None',
                width: 10,
            },
        ])
    },
})
