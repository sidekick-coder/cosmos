import type { Command, Config } from './types.js'
import { createRequire as defaultCreateRequire } from 'module'
import { parse } from './options.js'
import { createCommanderHelp } from './createCommanderHelp.js'
import { createCommandHelp } from './createCommandHelp.js'

import nodeFs from 'fs'
import path from 'path'

export interface Commander extends ReturnType<typeof createCommander> {}

export function createCommander(config: Config = {}) {
    const fs = config.fs || nodeFs
    const require = config.createRequire
        ? config.createRequire(import.meta.url)
        : defaultCreateRequire(import.meta.url)

    const commands: Command[] = []
    const subCommanders = new Map<string, Commander>()

    commands.push(createCommanderHelp({ config, commands, getSubcommaners }))

    function add(...args: Command[]) {
        for (const command of args) {
            const name = command.name

            const exists = commands.some((command) => command.name === name)

            if (command.commander) {
                const subCommander = subCommanders.get(command.commander)

                if (!subCommander) {
                    throw new Error(`Sub commander not found: ${command.commander}`)
                }

                subCommander.add(command)

                continue
            }

            if (exists) {
                return
            }

            commands.push({
                ...command,
                name: name,
            })
        }
    }

    function addFile(file: string) {
        const fileModule = require(file)

        const command = fileModule.default

        return add(command)
    }

    function addFolder(folder: string) {
        if (!fs.existsSync(folder)) {
            throw new Error(`Folder not found: ${folder}`)
        }

        const files = fs.readdirSync(folder)

        for (const file of files) {
            const filePath = path.join(folder, file)

            if (fs.statSync(filePath).isDirectory()) {
                addFolder(filePath)
                return
            }

            addFile(filePath)
        }
    }

    function getSubcommaners() {
        return subCommanders
    }

    function addSubCommander(name: string, commander: Commander) {
        subCommanders.set(name, commander)
    }

    function addToSubCommander(name: string, command: Command) {
        const subCommander = subCommanders.get(name)

        if (!subCommander) {
            throw new Error(`Sub commander not found: ${name}`)
        }

        subCommander.add(command)
    }

    async function run(name: string, args = '') {
        let command = commands.find((command) => command.name === name)

        const defaultCommand = config.defaultCommand || 'help'

        if (!command && defaultCommand) {
            command = commands.find((command) => command.name === defaultCommand)
        }

        if (!command) {
            throw new Error(`Command not found: ${name}`)
        }

        const ctx = {
            args: args.split(' '),
            options: parse(command.options || {}, args),
        }

        const isHelp = ctx.args.some((arg) => arg === '--help')
        const hasEscape = ctx.args.some((arg) => arg.startsWith('--'))

        if (isHelp && command.name !== 'help' && !hasEscape) {
            console.log(createCommandHelp(command, { bin: config.bin }))
            return
        }

        if (config.before) {
            config.before({ command, ctx })
        }

        const result = await command.execute(ctx)

        if (config.after) {
            config.after({ command, ctx })
        }

        return result
    }

    async function handle(args: string[]) {
        const schema = {
            name: {
                type: 'arg',
            },
        } as const

        const options = parse(schema, args.join(' '))

        const subCommander = subCommanders.get(options.name)

        if (subCommander) {
            return subCommander.handle(options._unknown)
        }

        return run(options.name, options._unknown.join(' '))
    }

    function createSubCommander(name: string, options: Omit<Config, 'require' | 'fs'> = {}) {
        const subCommander = createCommander({
            ...config,
            ...options,
        })

        addSubCommander(name, subCommander)

        return subCommander
    }

    return {
        commands,
        config,

        add,
        addFile,
        addFolder,
        addSubCommander,
        addToSubCommander,
        getSubcommaners,
        run,
        handle,
        createSubCommander,
    }
}
