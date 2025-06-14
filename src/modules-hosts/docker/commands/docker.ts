import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import { createShell } from '@/core/ssh/createShell.js'
import type Host from '@/entities/Host.js'

export default defineCommand({
    name: 'docker',
    execute: async ({ args }) => {
        const host = inject<Host>('host')

        const shellOptions = host.toShellOptions()

        const shell = createShell(shellOptions)

        const argsWihoutEscape = args.filter((arg) => arg !== '--')

        const finalArgs = ['docker', ...argsWihoutEscape]

        if (process.env.COSMOS_DEBUG) {
            console.log('[cosmos] run command:', finalArgs.join(' '))
        }

        const result = await shell.command(finalArgs.join(' '))

        console.log(result)
    },
})
