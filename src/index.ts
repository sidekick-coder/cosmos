// import createConnection from './commands/createConnection.js'
// import listConnections from './commands/listConnections.js'
// import updateConnection from './commands/updateConnection.js'
// import deleteConnection from './commands/deleteConnection.js'
import { resolve } from 'path'
import { createCommander } from './core/commander/createCommander.js'
import connection from './modules/connection/index.js'
// import { createCommanderHelp } from './core/commander/createCommanderHelp.js'
// import listDockerContainers from './commands/listDockerContainers.js'

const commander = createCommander({
    bin: 'cosmos',
    defaultCommand: 'help',
})

commander.addFolder(resolve(import.meta.dirname, 'commands'))

const modules = [connection]

modules.forEach((module) => {
    module.setup({ commander })
})

commander.handle(process.argv.slice(2))
