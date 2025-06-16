import { defineCommand } from '@/core/commander/defineCommand.js'
import { inject } from '@/core/di/index.js'
import type Host from '@/entities/Host.js'
import { createShell } from '@/gateways/createShell.js'

export default defineCommand({
    name: 'command',
    execute: async ({ args }) => {
        const host = inject<Host>('host')

        const shell = createShell(host)

        const argsWihoutEscape = args.filter((arg) => arg !== '--')

        await shell.command(argsWihoutEscape.join(' '), {
            onData: (data) => process.stdout.write(data),
        })
    },
})
