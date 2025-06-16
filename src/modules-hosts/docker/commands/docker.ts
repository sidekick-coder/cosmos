import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { createShell } from '@/gateways/createShell.js'

export default defineCommand({
    name: 'docker',
    execute: async ({ args }) => {
        const host = inject<Host>('host')

        const shell = createShell(host)

        const argsWihoutEscape = args.filter((arg) => arg !== '--')

        const finalArgs = ['docker', ...argsWihoutEscape]

        if (process.env.COSMOS_DEBUG) {
            console.log('[cosmos] run command:', finalArgs.join(' '))
        }

        // add exit

        await shell.command(finalArgs.join(' '), {
            pty: true,
        })
    },
})
