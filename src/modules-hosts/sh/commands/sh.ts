import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { createShell } from '@/gateways/createShell.js'

export default defineCommand({
    name: 'sh',
    execute: async ({ args }) => {
        const host = inject<Host>('host')

        const shell = createShell(host)

        const argsWihoutEscape = args.filter((arg) => arg !== '--').filter(Boolean)

        if (!argsWihoutEscape.length) {
            console.error('No command provided. Please specify a command to run.')
            return
        }

        await shell.command(argsWihoutEscape.join(' '), {
            pty: true,
        })
    },
})
