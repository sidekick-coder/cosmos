import { createCommander } from '@/core/commander/createCommander.js'
import { defineCommand } from '@/core/commander/defineCommand.js'
import { provide } from '@/core/di/index.js'
import Host from '@/entities/Host.js'
import sh from '@/modules-hosts/sh/index.js'

export default defineCommand({
    name: 'host',
    description: 'Manage host commands',
    disableHelp: true,
    options: {
        host: {
            type: 'arg',
            description: 'The host to run commands on',
        },
    },
    execute: async ({ args, options }) => {
        const modules = [sh]

        const host = new Host(options.host)

        provide('host', host)

        const commander = createCommander({
            bin: `cosmos ${options.host}`,
        })

        for (const m of modules) {
            m.setup({ commander })
        }

        commander.handle(args.slice(1))
    },
})
