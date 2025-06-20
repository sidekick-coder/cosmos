import { resolve } from 'path'
import { createCommander } from './core/commander/createCommander.js'
import host from './modules/host/index.js'
import container from './modules/container/index.js'
import stack from './modules/stack/index.js'
import register from './modules/register/index.js'
import { parse } from './core/commander/options.js'

const commander = createCommander({
    bin: 'cosmos',
    defaultCommand: 'help',
})

commander.addFolder(resolve(import.meta.dirname, 'commands'))

const modules = [host, register, container, stack]

modules.forEach((module) => {
    module.setup({ commander })
})

const args = process.argv.slice(2)
const options = parse(
    {
        name: {
            type: 'arg',
        },
    },
    args.join(' ')
)

const firstArg = options.name || args[0] || ''
const registed: string[] = []

commander.commands.forEach((command) => registed.push(command.name))
Array.from(commander.getSubcommaners().keys()).forEach((sub) => registed.push(sub))

const isRootCommand = registed.includes(firstArg)

// If the first argument is not a registered command, we assume it's a host command
if (!isRootCommand && !!firstArg) {
    args.unshift('host-module')
}

commander.handle(args)
