import { createCommander } from '@/core/commander/index.js'
import { defineModule } from '@/utils/defineModule.js'
import { resolve } from 'path'

export default defineModule({
    name: 'connection',
    description: 'Manage connections',
    setup({ commander }) {
        const sub = createCommander({
            bin: `${commander.config.bin} connection`,
        })

        sub.addFolder(resolve(import.meta.dirname, 'commands'))

        commander.addSubCommander('connection', sub)
    },
})
