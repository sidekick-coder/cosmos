import { createCommander } from '@/core/commander/createCommander.js'
import { defineCommand } from '@/core/commander/defineCommand.js'
import { provide } from '@/core/di/index.js'
import Host from '@/entities/Host.js'
import docker from '@/modules-hosts/docker/index.js'
import sh from '@/modules-hosts/sh/index.js'
import stacks from '@/modules-hosts/stacks/index.js'
import HostRepository from '@/repositories/HostRepository.js'

export default defineCommand({
    name: 'host-module',
    description: 'Manage host commands',
    options: {
        host: {
            type: 'arg',
            description: 'The host to run commands on',
        },
    },
    execute: async ({ args, options }) => {
        const modules = [sh, docker, stacks]

        const repository = new HostRepository()

        let host = repository.find(options.host)

        if (!host) {
            host = new Host({
                Host: options.host,
                Hostname: options.host,
            })
        }

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
