import { createCommander } from './core/commander/createCommander.js'
import { createCommanderHelp } from './core/commander/createCommanderHelp.js'

const commander = createCommander({
    bin: 'cosmos',
    defaultCommand: 'help',
})

commander.add(createCommanderHelp(commander))

commander.handle(process.argv.slice(2))
