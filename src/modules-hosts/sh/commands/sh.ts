import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import { createShell } from '@/core/ssh/createShell.js'
import type Host from '@/entities/Host.js'

export default defineCommand({
    name: 'sh',
    execute: async ({ args }) => {
        const host = inject<Host>('host')

        const shellOptions = host.toShellOptions()

        const shell = createShell(shellOptions)

        const result = await shell.command(args.join(' '))

        console.log(result)
    },
})
