import { resolve } from 'path'
import { createCommander } from './core/commander/createCommander.js'
import connection from './modules/connection/index.js'
import docker from './modules/docker/index.js'

const commander = createCommander({
    bin: 'cosmos',
    defaultCommand: 'help',
})

commander.addFolder(resolve(import.meta.dirname, 'commands'))

const modules = [connection, docker]

modules.forEach((module) => {
    module.setup({ commander })
})

commander.handle(process.argv.slice(2))
