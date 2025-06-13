import createConnection from './commands/createConnection.js'
import listConnections from './commands/listConnections.js'
import updateConnection from './commands/updateConnection.js'
import deleteConnection from './commands/deleteConnection.js'
import { createCommander } from './core/commander/createCommander.js'
import { createCommanderHelp } from './core/commander/createCommanderHelp.js'
import listDockerContainers from './commands/listDockerContainers.js'

const commander = createCommander({
    bin: 'cosmos',
    defaultCommand: 'help',
})

commander.add(createCommanderHelp(commander))

commander.add(
    createConnection,
    listConnections,
    updateConnection,
    deleteConnection,
    listDockerContainers
)

commander.handle(process.argv.slice(2))
